// src/pages/Friends/FriendRequests.jsx
import React, { useState, useEffect } from 'react';
import { getOutgoingFriendRequests, cancelFriendRequest } from './friendService';
import LoadingSpinner from './LoadingSpinner';

const FriendRequests = ({ currentUser }) => {
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Early return if currentUser is not available
  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Please log in to view your friend requests</div>
      </div>
    );
  }

  useEffect(() => {
    if (currentUser?.uid) {
      loadOutgoingRequests();
    }
  }, [currentUser]);

  const loadOutgoingRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const requests = await getOutgoingFriendRequests(currentUser.uid);
      setOutgoingRequests(requests);
    } catch (err) {
      console.error('Error loading outgoing requests:', err);
      setError('Failed to load sent requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (targetUserId) => {
    if (window.confirm('Are you sure you want to cancel this friend request?')) {
      try {
        await cancelFriendRequest(currentUser.uid, targetUserId);
        // Remove from local state
        setOutgoingRequests(outgoingRequests.filter(request => request.uid !== targetUserId));
      } catch (error) {
        console.error('Error cancelling friend request:', error);
        alert('Failed to cancel friend request. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={loadOutgoingRequests}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  {/* Empty State - No Sent Requests */}
  {outgoingRequests.length === 0 && (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-600 mb-2">No Sent Requests</h3>
      <p className="text-gray-500">You haven't sent any friend requests yet.</p>
    </div>
  )}

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Sent Requests ({outgoingRequests.length})
        </h3>
        <button 
          onClick={loadOutgoingRequests}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {outgoingRequests.map((request) => (
          <div key={request.uid} className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-3">
              {/* Profile Picture */}
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                {request.profilePicture ? (
                  <img 
                    src={request.profilePicture} 
                    alt={request.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-semibold text-lg">
                    {request.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                )}
              </div>

              {/* Request Info */}
              <div>
                <h4 className="font-medium text-gray-900">{request.name}</h4>
                {request.email && (
                  <p className="text-sm text-gray-500">{request.email}</p>
                )}
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center text-orange-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs">Pending</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    • Sent {new Date(request.sentAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCancelRequest(request.uid)}
                className="px-3 py-1 text-red-600 border border-red-300 rounded hover:bg-red-50 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRequests;
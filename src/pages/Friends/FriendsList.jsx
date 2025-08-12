// src/pages/Friends/FriendsList.jsx
import React, { useState, useEffect } from 'react';
import { getUserFriends, removeFriend, getIncomingFriendRequests, acceptFriendRequest, denyFriendRequest } from './friendService';
import LoadingSpinner from './LoadingSpinner';

const FriendsList = ({ currentUser }) => {
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('friends'); // 'friends' or 'requests'

  // Early return if currentUser is not available
  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Please log in to view your friends</div>
      </div>
    );
  }

  useEffect(() => {
    if (currentUser?.uid) {
      loadData();
    }
  }, [currentUser]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load both friends and incoming requests
      const [userFriends, requests] = await Promise.all([
        getUserFriends(currentUser.uid),
        getIncomingFriendRequests(currentUser.uid)
      ]);
      
      setFriends(userFriends);
      setIncomingRequests(requests);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load friends and requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (window.confirm('Are you sure you want to remove this friend?')) {
      try {
        await removeFriend(currentUser.uid, friendId);
        // Remove from local state
        setFriends(friends.filter(friend => friend.uid !== friendId));
      } catch (error) {
        console.error('Error removing friend:', error);
        alert('Failed to remove friend. Please try again.');
      }
    }
  };

  const handleAcceptRequest = async (requesterId) => {
    try {
      await acceptFriendRequest(currentUser.uid, requesterId);
      // Reload data to reflect changes
      await loadData();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      alert('Failed to accept friend request. Please try again.');
    }
  };

  const handleDenyRequest = async (requesterId) => {
    try {
      await denyFriendRequest(currentUser.uid, requesterId);
      // Remove from local state
      setIncomingRequests(incomingRequests.filter(request => request.uid !== requesterId));
    } catch (error) {
      console.error('Error denying friend request:', error);
      alert('Failed to deny friend request. Please try again.');
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
          onClick={loadData}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  const renderFriendsList = () => {
    if (friends.length === 0) {
      return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-600 mb-2">No Friends Yet</h3>
        <p className="text-gray-500">Start searching for friends to connect with them!</p>
      </div>
      );
    }

    return (
      <div className="space-y-3">
        {friends.map((friend) => (
          <div key={friend.uid} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              {/* Profile Picture */}
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                {friend.profilePicture ? (
                  <img 
                    src={friend.profilePicture} 
                    alt={friend.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-semibold text-lg">
                    {friend.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                )}
              </div>

              {/* Friend Info */}
              <div>
                <h4 className="font-medium text-gray-900">{friend.name}</h4>
                {friend.email && (
                  <p className="text-sm text-gray-500">{friend.email}</p>
                )}
                <p className="text-xs text-gray-400">
                  Friends since {new Date(friend.addedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleRemoveFriend(friend.uid)}
                className="px-3 py-1 text-red-600 border border-red-300 rounded hover:bg-red-50 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderFriendRequests = () => {
    if (incomingRequests.length === 0) {
      return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-600 mb-2">No Pending Requests</h3>
        <p className="text-gray-500">You don't have any pending friend requests.</p>
      </div>
      );
    }

    return (
      <div className="space-y-3">
        {incomingRequests.map((request) => (
          <div key={request.uid} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
                <p className="text-xs text-gray-400">
                  Sent {new Date(request.receivedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleAcceptRequest(request.uid)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                Accept
              </button>
              <button
                onClick={() => handleDenyRequest(request.uid)}
                className="px-3 py-1 text-red-600 border border-red-300 rounded hover:bg-red-50 text-sm"
              >
                Deny
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Sub-tab Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveSubTab('friends')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeSubTab === 'friends'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveSubTab('requests')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
              activeSubTab === 'requests'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Requests ({incomingRequests.length})
            {incomingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>
        
        <button 
          onClick={loadData}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Content */}
      {activeSubTab === 'friends' ? renderFriendsList() : renderFriendRequests()}
    </div>
  );
};

export default FriendsList;
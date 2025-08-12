// src/pages/Friends/UserCard.jsx
import React, { useState, useEffect } from 'react';
import { sendFriendRequest, cancelFriendRequest, acceptFriendRequest, denyFriendRequest, getRelationshipStatus } from './friendService';

const UserCard = ({ user, searchTerm, currentUser, onRelationshipChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [relationshipStatus, setRelationshipStatus] = useState('none');

  useEffect(() => {
    if (currentUser?.uid && user?.uid) {
      checkRelationshipStatus();
    }
  }, [currentUser?.uid, user?.uid]);

  const checkRelationshipStatus = async () => {
    try {
      const status = await getRelationshipStatus(currentUser.uid, user.uid);
      setRelationshipStatus(status);
    } catch (error) {
      console.error('Error checking relationship status:', error);
    }
  };

  // Fixed highlight function - this was causing the issue
  const highlightText = (text, highlight) => {
    if (!highlight || !text) return text;
    
    const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) => 
          part.toLowerCase() === highlight.toLowerCase() ? 
            <span key={index} className="bg-yellow-200 font-semibold">{part}</span> : 
            <span key={index}>{part}</span>
        )}
      </span>
    );
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    try {
      await sendFriendRequest(currentUser.uid, user.uid);
      setRelationshipStatus('request_sent');
      if (onRelationshipChange) {
        onRelationshipChange(user, 'request_sent');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    setIsLoading(true);
    try {
      await cancelFriendRequest(currentUser.uid, user.uid);
      setRelationshipStatus('none');
      if (onRelationshipChange) {
        onRelationshipChange(user, 'none');
      }
    } catch (error) {
      console.error('Error cancelling friend request:', error);
      alert('Failed to cancel friend request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    setIsLoading(true);
    try {
      await acceptFriendRequest(currentUser.uid, user.uid);
      setRelationshipStatus('friends');
      if (onRelationshipChange) {
        onRelationshipChange(user, 'friends');
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      alert('Failed to accept friend request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDenyRequest = async () => {
    setIsLoading(true);
    try {
      await denyFriendRequest(currentUser.uid, user.uid);
      setRelationshipStatus('none');
      if (onRelationshipChange) {
        onRelationshipChange(user, 'none');
      }
    } catch (error) {
      console.error('Error denying friend request:', error);
      alert('Failed to deny friend request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderActionButton = () => {
    if (isLoading) {
      return (
        <div className="flex items-center text-gray-500">
          <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full mr-2"></div>
          Loading...
        </div>
      );
    }

    switch (relationshipStatus) {
      case 'friends':
        return (
          <div className="flex items-center text-green-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Friends</span>
          </div>
        );

      case 'request_sent':
        return (
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-orange-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Request Sent</span>
            </div>
            <button
              onClick={handleCancelRequest}
              className="px-2 py-1 text-xs text-red-600 border border-red-300 rounded hover:bg-red-50"
            >
              Cancel
            </button>
          </div>
        );

      case 'request_received':
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAcceptRequest}
              className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
            >
              Accept
            </button>
            <button
              onClick={handleDenyRequest}
              className="px-3 py-1 text-red-600 border border-red-300 rounded hover:bg-red-50 text-sm"
            >
              Deny
            </button>
          </div>
        );

      case 'none':
      default:
        return (
          <button
            onClick={handleSendRequest}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Add Friend
          </button>
        );
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        {/* Profile Picture */}
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          {user.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt={user.name || user.displayName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-600 font-semibold text-lg">
              {(user.name || user.displayName)?.charAt(0)?.toUpperCase() || '?'}
            </span>
          )}
        </div>

        {/* User Info */}
        <div>
          <h4 className="font-medium text-gray-900">
            {highlightText(user.name || user.displayName || 'Unknown', searchTerm)}
          </h4>
          {user.email && (
            <p className="text-sm text-gray-500">{user.email}</p>
          )}
          {user.bio && (
            <p className="text-sm text-gray-600 mt-1">{user.bio}</p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex-shrink-0">
        {renderActionButton()}
      </div>
    </div>
  );
};

export default UserCard;
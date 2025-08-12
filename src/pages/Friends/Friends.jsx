// src/pages/Friends/Friends.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase'; // Adjust path as needed
import UserSearch from './UserSearch';
import FriendsList from './FriendsList';
import FriendRequests from './FriendRequests';

const Friends = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('friends');
  const navigate = useNavigate();

  // Check if user is anonymous
  const isAnonymous = currentUser?.isAnonymous;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Trigger force login event
      window.dispatchEvent(new Event('forceLogin'));
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // If user is anonymous, show sign-in prompt
  if (isAnonymous) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
            <svg className="w-16 h-16 mx-auto mb-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Sign In Required
            </h2>
            
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              To use the friends feature, you need to sign in with a real account. 
              Anonymous users cannot add or manage friends.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleSignOut}
                className="w-full max-w-xs mx-auto block px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Sign In with Real Account
              </button>
              
              <button
                onClick={() => navigate('/feed')}
                className="w-full max-w-xs mx-auto block px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Go Back to Feed
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Friends</h1>
        <p className="text-gray-600">Connect and manage your friendships</p>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-3 gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('friends')}
          className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'friends'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Friends</span>
          </div>
        </button>
        
        <button
          onClick={() => setActiveTab('search')}
          className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'search'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'requests'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Requests</span>
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {activeTab === 'friends' && <FriendsList currentUser={currentUser} />}
        {activeTab === 'search' && <UserSearch currentUser={currentUser} />}
        {activeTab === 'requests' && <FriendRequests currentUser={currentUser} />}
      </div>
    </div>
  );
};

export default Friends;
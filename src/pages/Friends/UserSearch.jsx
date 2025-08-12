// src/pages/Friends/UserSearch.jsx
import React, { useState, useEffect } from 'react';
import { searchUsersByName } from './userService';
import UserCard from './UserCard';
import LoadingSpinner from './LoadingSpinner';
import useDebounce from './useDebounce';

const UserSearch = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Early return if currentUser is not available
  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Please log in to search for friends</div>
      </div>
    );
  }

  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.trim().length >= 2) {
      performSearch(debouncedSearchTerm.trim());
    } else if (debouncedSearchTerm.trim().length === 0) {
      setSearchResults([]);
      setHasSearched(false);
      setError(null);
    }
  }, [debouncedSearchTerm, currentUser.uid]);

  const performSearch = async (term) => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      
      const results = await searchUsersByName(term, currentUser.uid);
      setSearchResults(results);
      
      if (results.length === 0) {
        setError(`No users found matching "${term}"`);
      }
    } catch (err) {
      console.error('Error searching users:', err);
      setError('Failed to search users. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRelationshipChange = (user, newStatus) => {
    // Optional: You could update the local state here if needed
    // For now, the UserCard handles its own state
    console.log(`Relationship with ${user.name} changed to: ${newStatus}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim().length >= 2) {
      performSearch(searchTerm.trim());
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Find Friends</h3>
        <p className="text-gray-600 text-sm">Search for people by their name to send friend requests</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for friends by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {searchTerm.trim().length > 0 && searchTerm.trim().length < 2 && (
          <p className="text-sm text-amber-600 mt-2">Enter at least 2 characters to search</p>
        )}
      </form>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">{error}</div>
          {searchTerm.trim().length >= 2 && (
            <button 
              onClick={() => performSearch(searchTerm.trim())}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {/* Search Results */}
      {!loading && !error && hasSearched && searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-800">
              Search Results ({searchResults.length})
            </h4>
            <span className="text-sm text-gray-500">
              Showing results for "{debouncedSearchTerm}"
            </span>
          </div>
          
          <div className="space-y-3">
            {searchResults.map((user) => (
              <UserCard
                key={user.uid}
                user={user}
                searchTerm={debouncedSearchTerm}
                currentUser={currentUser}
                onRelationshipChange={handleRelationshipChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State for fresh component */}
      {!loading && !error && !hasSearched && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-600 mb-2">Search for Friends</h3>
          <p className="text-gray-500">Enter a name in the search box above to find people you know</p>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
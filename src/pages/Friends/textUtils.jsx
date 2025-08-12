// src/pages/Friends/textUtils.js
import React from 'react';

/**
 * Highlights matching text in a string
 * @param {string} text - The full text
 * @param {string} searchTerm - The term to highlight
 * @returns {React.ReactNode} - JSX with highlighted text
 */
export const highlightText = (text, searchTerm) => {
  if (!searchTerm?.trim() || !text) {
    return text;
  }

  // Escape special regex characters in search term
  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Create regex for case-insensitive matching
  const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
  
  // Split the text by the search term
  const parts = text.split(regex);
  
  return parts.map((part, index) => {
    // Check if this part matches the search term (case-insensitive)
    if (part.toLowerCase() === searchTerm.toLowerCase()) {
      return (
        <span 
          key={index} 
          className="bg-yellow-200 font-semibold px-1 rounded"
        >
          {part}
        </span>
      );
    }
    return part;
  });
};
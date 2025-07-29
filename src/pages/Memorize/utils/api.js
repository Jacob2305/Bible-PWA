// src/pages/Memorize/utils/api.js

export const fetchVerseFromAPI = async (reference, version) => {
  try {
    const response = await fetch(
      `https://bible-api.com/${reference}?translation=${version.toLowerCase()}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate that we got the expected data structure
    if (!data.text || !data.reference) {
      throw new Error('Invalid API response format');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch verse from API');
  }
};

// Alternative API endpoints in case bible-api.com is down
export const alternativeAPIEndpoints = [
  {
    name: 'bible-api.com',
    fetchVerse: fetchVerseFromAPI
  },
  // You can add more API endpoints here as fallbacks
  // {
  //   name: 'another-bible-api.com',
  //   fetchVerse: async (reference, version) => { ... }
  // }
];

export const fetchVerseWithFallback = async (reference, version) => {
  for (const api of alternativeAPIEndpoints) {
    try {
      return await api.fetchVerse(reference, version);
    } catch (error) {
      console.warn(`Failed to fetch from ${api.name}:`, error);
      continue;
    }
  }
  
  throw new Error('All API endpoints failed');
};
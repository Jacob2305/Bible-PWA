// src/pages/Friends/userService.js
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  startAt, 
  endAt, 
  getDocs, 
  limit,
  doc,
  updateDoc 
} from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // Correct path to your Firebase config

/**
 * Search for users by their display name
 * @param {string} searchTerm - The search term
 * @param {string} currentUserUid - The current user's UID to exclude from results
 * @returns {Promise<Array>} - Array of user objects
 */
export const searchUsersByName = async (searchTerm, currentUserUid) => {
  if (!searchTerm?.trim()) {
    return [];
  }

  try {
    // Convert search term to lowercase for case-insensitive search
    const searchLower = searchTerm.toLowerCase().trim();
    
    // Create the end range for the search (adds high Unicode character)
    const searchEnd = searchLower + '\uf8ff';

    // Create the query - search by nameLower field
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('nameLower', '>=', searchLower),
      where('nameLower', '<=', searchEnd),
      orderBy('nameLower'),
      limit(20) // Limit results for better performance
    );

    // Execute the query
    const querySnapshot = await getDocs(q);
    const users = [];

    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      
      // Exclude the current user from results
      if (doc.id !== currentUserUid) {
        users.push({
          uid: doc.id,
          displayName: userData.name, // Map name to displayName for consistency
          email: userData.email,
          profilePictureURL: userData.photoURL,
          ...userData
        });
      }
    });

    console.log(`Found ${users.length} users for search term: "${searchTerm}"`);
    return users;

  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

/**
 * Update user document to include lowercase display name for searching
 * Call this when a user signs up or updates their profile
 * @param {string} uid - User's UID
 * @param {Object} userData - User data including displayName
 */
export const updateUserForSearch = async (uid, userData) => {
  try {
    const userRef = doc(db, 'users', uid);
    
    const updateData = {
      ...userData,
      displayNameLower: userData.displayName?.toLowerCase() || ''
    };

    await updateDoc(userRef, updateData);
    console.log('User updated for search compatibility');
  } catch (error) {
    console.error('Error updating user for search:', error);
    throw error;
  }
};
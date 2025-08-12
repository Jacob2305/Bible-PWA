// src/pages/Friends/friendService.js
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  getDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch 
} from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // Adjust path as needed

/**
 * Send a friend request to another user
 */
export const sendFriendRequest = async (currentUserId, targetUserId) => {
  try {
    const batch = writeBatch(db);
    
    // Reference to both user documents
    const currentUserRef = doc(db, 'users', currentUserId);
    const targetUserRef = doc(db, 'users', targetUserId);
    
    // Create request objects with timestamp
    const outgoingRequest = {
      uid: targetUserId,
      sentAt: new Date().toISOString(),
      status: 'pending'
    };
    
    const incomingRequest = {
      uid: currentUserId,
      receivedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    // Add to current user's outgoing requests
    batch.update(currentUserRef, {
      outgoingFriendRequests: arrayUnion(outgoingRequest)
    });
    
    // Add to target user's incoming requests
    batch.update(targetUserRef, {
      incomingFriendRequests: arrayUnion(incomingRequest)
    });
    
    // Commit the batch
    await batch.commit();
    
    console.log(`Friend request sent from ${currentUserId} to ${targetUserId}`);
    return { success: true };
    
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
};

/**
 * Accept a friend request
 */
export const acceptFriendRequest = async (currentUserId, requesterUserId) => {
  try {
    const batch = writeBatch(db);
    
    // Get both user documents to find the exact request objects
    const currentUserDoc = await getDoc(doc(db, 'users', currentUserId));
    const requesterUserDoc = await getDoc(doc(db, 'users', requesterUserId));
    
    if (currentUserDoc.exists() && requesterUserDoc.exists()) {
      const currentUserData = currentUserDoc.data();
      const requesterUserData = requesterUserDoc.data();
      
      // Find the request objects to remove
      const incomingRequest = currentUserData.incomingFriendRequests?.find(r => r.uid === requesterUserId);
      const outgoingRequest = requesterUserData.outgoingFriendRequests?.find(r => r.uid === currentUserId);
      
      if (incomingRequest && outgoingRequest) {
        const currentUserRef = doc(db, 'users', currentUserId);
        const requesterUserRef = doc(db, 'users', requesterUserId);
        
        // Remove the friend requests
        batch.update(currentUserRef, {
          incomingFriendRequests: arrayRemove(incomingRequest)
        });
        
        batch.update(requesterUserRef, {
          outgoingFriendRequests: arrayRemove(outgoingRequest)
        });
        
        // Create friend objects
        const friendshipData = {
          uid: requesterUserId,
          addedAt: new Date().toISOString()
        };
        
        const currentUserFriendshipData = {
          uid: currentUserId,
          addedAt: new Date().toISOString()
        };
        
        // Add to friends arrays
        batch.update(currentUserRef, {
          friends: arrayUnion(friendshipData)
        });
        
        batch.update(requesterUserRef, {
          friends: arrayUnion(currentUserFriendshipData)
        });
        
        await batch.commit();
        console.log(`Friend request accepted between ${currentUserId} and ${requesterUserId}`);
        return { success: true };
      }
    }
    
    throw new Error('Friend request not found');
    
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error;
  }
};

/**
 * Deny/reject a friend request
 */
export const denyFriendRequest = async (currentUserId, requesterUserId) => {
  try {
    const batch = writeBatch(db);
    
    // Get both user documents to find the exact request objects
    const currentUserDoc = await getDoc(doc(db, 'users', currentUserId));
    const requesterUserDoc = await getDoc(doc(db, 'users', requesterUserId));
    
    if (currentUserDoc.exists() && requesterUserDoc.exists()) {
      const currentUserData = currentUserDoc.data();
      const requesterUserData = requesterUserDoc.data();
      
      // Find the request objects to remove
      const incomingRequest = currentUserData.incomingFriendRequests?.find(r => r.uid === requesterUserId);
      const outgoingRequest = requesterUserData.outgoingFriendRequests?.find(r => r.uid === currentUserId);
      
      if (incomingRequest && outgoingRequest) {
        const currentUserRef = doc(db, 'users', currentUserId);
        const requesterUserRef = doc(db, 'users', requesterUserId);
        
        // Remove the friend requests
        batch.update(currentUserRef, {
          incomingFriendRequests: arrayRemove(incomingRequest)
        });
        
        batch.update(requesterUserRef, {
          outgoingFriendRequests: arrayRemove(outgoingRequest)
        });
        
        await batch.commit();
        console.log(`Friend request denied between ${currentUserId} and ${requesterUserId}`);
        return { success: true };
      }
    }
    
    throw new Error('Friend request not found');
    
  } catch (error) {
    console.error('Error denying friend request:', error);
    throw error;
  }
};

/**
 * Cancel a sent friend request
 */
export const cancelFriendRequest = async (currentUserId, targetUserId) => {
  try {
    const batch = writeBatch(db);
    
    // Get both user documents to find the exact request objects
    const currentUserDoc = await getDoc(doc(db, 'users', currentUserId));
    const targetUserDoc = await getDoc(doc(db, 'users', targetUserId));
    
    if (currentUserDoc.exists() && targetUserDoc.exists()) {
      const currentUserData = currentUserDoc.data();
      const targetUserData = targetUserDoc.data();
      
      // Find the request objects to remove
      const outgoingRequest = currentUserData.outgoingFriendRequests?.find(r => r.uid === targetUserId);
      const incomingRequest = targetUserData.incomingFriendRequests?.find(r => r.uid === currentUserId);
      
      if (outgoingRequest && incomingRequest) {
        const currentUserRef = doc(db, 'users', currentUserId);
        const targetUserRef = doc(db, 'users', targetUserId);
        
        // Remove the friend requests
        batch.update(currentUserRef, {
          outgoingFriendRequests: arrayRemove(outgoingRequest)
        });
        
        batch.update(targetUserRef, {
          incomingFriendRequests: arrayRemove(incomingRequest)
        });
        
        await batch.commit();
        console.log(`Friend request cancelled from ${currentUserId} to ${targetUserId}`);
        return { success: true };
      }
    }
    
    throw new Error('Friend request not found');
    
  } catch (error) {
    console.error('Error cancelling friend request:', error);
    throw error;
  }
};

/**
 * Get incoming friend requests for a user
 */
export const getIncomingFriendRequests = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const requests = userData.incomingFriendRequests || [];
      
      // Get detailed requester information
      const requestsWithDetails = await Promise.all(
        requests.map(async (request) => {
          try {
            const requesterDoc = await getDoc(doc(db, 'users', request.uid));
            if (requesterDoc.exists()) {
              return {
                ...requesterDoc.data(),
                uid: request.uid,
                receivedAt: request.receivedAt,
                status: request.status
              };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching requester ${request.uid}:`, error);
            return null;
          }
        })
      );
      
      // Filter out any null results
      return requestsWithDetails.filter(request => request !== null);
    }
    
    return [];
  } catch (error) {
    console.error('Error getting incoming friend requests:', error);
    throw error;
  }
};

/**
 * Get outgoing friend requests for a user
 */
export const getOutgoingFriendRequests = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const requests = userData.outgoingFriendRequests || [];
      
      // Get detailed target user information
      const requestsWithDetails = await Promise.all(
        requests.map(async (request) => {
          try {
            const targetDoc = await getDoc(doc(db, 'users', request.uid));
            if (targetDoc.exists()) {
              return {
                ...targetDoc.data(),
                uid: request.uid,
                sentAt: request.sentAt,
                status: request.status
              };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching target user ${request.uid}:`, error);
            return null;
          }
        })
      );
      
      // Filter out any null results
      return requestsWithDetails.filter(request => request !== null);
    }
    
    return [];
  } catch (error) {
    console.error('Error getting outgoing friend requests:', error);
    throw error;
  }
};

/**
 * Check the relationship status between two users
 * Returns: 'friends', 'request_sent', 'request_received', 'none'
 */
export const getRelationshipStatus = async (currentUserId, targetUserId) => {
  try {
    const currentUserDoc = await getDoc(doc(db, 'users', currentUserId));
    
    if (currentUserDoc.exists()) {
      const userData = currentUserDoc.data();
      
      // Check if already friends
      const friends = userData.friends || [];
      if (friends.some(friend => friend.uid === targetUserId)) {
        return 'friends';
      }
      
      // Check outgoing requests
      const outgoingRequests = userData.outgoingFriendRequests || [];
      if (outgoingRequests.some(request => request.uid === targetUserId)) {
        return 'request_sent';
      }
      
      // Check incoming requests
      const incomingRequests = userData.incomingFriendRequests || [];
      if (incomingRequests.some(request => request.uid === targetUserId)) {
        return 'request_received';
      }
    }
    
    return 'none';
  } catch (error) {
    console.error('Error checking relationship status:', error);
    return 'none';
  }
};

// Keep existing functions for backward compatibility
/**
 * Add a friend relationship between two users (LEGACY - use sendFriendRequest instead)
 * This creates a bidirectional friendship immediately
 */
export const addFriend = async (currentUserId, friendUserId) => {
  try {
    const batch = writeBatch(db);
    
    // Reference to both user documents
    const currentUserRef = doc(db, 'users', currentUserId);
    const friendUserRef = doc(db, 'users', friendUserId);
    
    // Create friend object with timestamp
    const friendshipData = {
      uid: friendUserId,
      addedAt: new Date().toISOString()
    };
    
    const currentUserFriendshipData = {
      uid: currentUserId,
      addedAt: new Date().toISOString()
    };
    
    // Add friend to current user's friends array
    batch.update(currentUserRef, {
      friends: arrayUnion(friendshipData)
    });
    
    // Add current user to friend's friends array (bidirectional)
    batch.update(friendUserRef, {
      friends: arrayUnion(currentUserFriendshipData)
    });
    
    // Commit the batch
    await batch.commit();
    
    console.log(`Friendship created between ${currentUserId} and ${friendUserId}`);
    return { success: true };
    
  } catch (error) {
    console.error('Error adding friend:', error);
    throw error;
  }
};

/**
 * Remove a friend relationship between two users
 */
export const removeFriend = async (currentUserId, friendUserId) => {
  try {
    const batch = writeBatch(db);
    
    // Get current user's friends to find the exact friend object to remove
    const currentUserDoc = await getDoc(doc(db, 'users', currentUserId));
    const friendUserDoc = await getDoc(doc(db, 'users', friendUserId));
    
    if (currentUserDoc.exists() && friendUserDoc.exists()) {
      const currentUserData = currentUserDoc.data();
      const friendUserData = friendUserDoc.data();
      
      // Find the friend objects to remove
      const friendToRemove = currentUserData.friends?.find(f => f.uid === friendUserId);
      const currentUserToRemove = friendUserData.friends?.find(f => f.uid === currentUserId);
      
      if (friendToRemove && currentUserToRemove) {
        const currentUserRef = doc(db, 'users', currentUserId);
        const friendUserRef = doc(db, 'users', friendUserId);
        
        // Remove friend from both users
        batch.update(currentUserRef, {
          friends: arrayRemove(friendToRemove)
        });
        
        batch.update(friendUserRef, {
          friends: arrayRemove(currentUserToRemove)
        });
        
        await batch.commit();
        console.log(`Friendship removed between ${currentUserId} and ${friendUserId}`);
        return { success: true };
      }
    }
    
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
};

/**
 * Get all friends for a user
 */
export const getUserFriends = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const friends = userData.friends || [];
      
      // Get detailed friend information
      const friendsWithDetails = await Promise.all(
        friends.map(async (friend) => {
          try {
            const friendDoc = await getDoc(doc(db, 'users', friend.uid));
            if (friendDoc.exists()) {
              return {
                ...friendDoc.data(),
                uid: friend.uid,
                addedAt: friend.addedAt
              };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching friend ${friend.uid}:`, error);
            return null;
          }
        })
      );
      
      // Filter out any null results
      return friendsWithDetails.filter(friend => friend !== null);
    }
    
    return [];
  } catch (error) {
    console.error('Error getting user friends:', error);
    throw error;
  }
};

/**
 * Check if two users are friends
 */
export const areFriends = async (userId1, userId2) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId1));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const friends = userData.friends || [];
      return friends.some(friend => friend.uid === userId2);
    }
    
    return false;
  } catch (error) {
    console.error('Error checking friendship:', error);
    return false;
  }
};

/**
 * Get friend count for a user
 */
export const getFriendCount = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.friends?.length || 0;
    }
    
    return 0;
  } catch (error) {
    console.error('Error getting friend count:', error);
    return 0;
  }
};
import React, { useEffect, useState } from 'react';
import styles from './Account.module.css';
import { FaUserCircle, FaEdit, FaCog, FaSignOutAlt, FaUserFriends } from 'react-icons/fa';
import { auth } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import EditProfileModal from '../../components/Modal/EditProfileModal';
import SettingsModal from '../../components/Modal/SettingsModal';

function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function Account() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const snap = await getDoc(doc(db, 'users', u.uid));
        if (snap.exists()) setProfile(snap.data());
      } else {
        setUser(null);
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  if (!user || !profile) return <p>Loading...</p>;

  return (
    <div className={styles.accountContainer}>
      <div className={styles.profileSection}>
        {profile.photoURL ? (
          <img src={profile.photoURL} alt="avatar" className={styles.profileIcon} />
        ) : (
          <div className={styles.avatarFallback}>
            {getInitials(profile.name)}
          </div>
        )}
        <h2 className={styles.userName}>{profile.name}</h2>
        <p className={styles.userDescription}>
          {profile.description || 'No description added.'}
        </p>
        {profile.location && (
          <p className={styles.userFrom}>
            <span className="material-icons fromIcon">home</span>
            {profile.location}
          </p>
        )}
      </div>

      <div className={styles.actionsSection}>
        <button className={styles.actionButton} onClick={() => setEditOpen(true)}>
          <FaEdit className={styles.actionIcon} />
          Edit Profile
        </button>
        <button className={styles.actionButton} onClick={() => setSettingsOpen(true)}>
          <FaCog className={styles.actionIcon} />
          Settings
        </button>
      </div>

      <div className={styles.friendsSection}>
        <div className={styles.friendsHeader}>
          <h3>
            <FaUserFriends className={styles.sectionIcon} /> Friends
          </h3>
          <button className={styles.addFriendButton} aria-label="Add Friend">
            +
          </button>
        </div>
        <p className={styles.friendsPlaceholder}>No friends added yet.</p>
      </div>

      <button className={styles.logoutButton} onClick={handleLogout}>
        <FaSignOutAlt className={styles.actionIcon} />
        Logout
      </button>

      <EditProfileModal
        isOpen={editOpen}
        onClose={async () => {
          setEditOpen(false);
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists()) setProfile(snap.data());
        }}
        user={user}
        profile={profile}
      />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    
    </div>
  );
}

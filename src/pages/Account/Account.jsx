import React from 'react';
import styles from './Account.module.css';
import { FaUserCircle, FaEdit, FaCog, FaSignOutAlt, FaUserFriends } from 'react-icons/fa';

export default function Account() {
  return (
    <div className={styles.accountContainer}>
      <div className={styles.profileSection}>
        <FaUserCircle className={styles.profileIcon} />
        <h2 className={styles.userName}>John Doe</h2>
        <p className={styles.userDescription}>
          Hello there :)
        </p>
      </div>

      <div className={styles.actionsSection}>
        <button className={styles.actionButton}>
          <FaEdit className={styles.actionIcon} />
          Edit Profile
        </button>
        <button className={styles.actionButton}>
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


      <button className={styles.logoutButton}>
        <FaSignOutAlt className={styles.actionIcon} />
        Logout
      </button>
    </div>
  );
}

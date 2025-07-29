import React, { useState } from 'react';
import styles from './SettingsModal.module.css';
import Modal from './Modal';

export default function SettingsModal({ isOpen, onClose }) {
  const [postVisibility, setPostVisibility] = useState('public');
  const [feedDays, setFeedDays] = useState(7);
  const [feedSource, setFeedSource] = useState('all');

  const handleSave = () => {
    // Dummy save handler
    console.log({
      postVisibility,
      feedDays,
      feedSource,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.settingsContainer}>
        <h2 className={styles.heading}>Settings</h2>

        <label className={styles.label}>Who can see your posts?</label>
        <select
          className={styles.input}
          value={postVisibility}
          onChange={(e) => setPostVisibility(e.target.value)}
        >
          <option value="public">Public</option>
          <option value="friends">Only Friends</option>
        </select>

        <label className={styles.label}>How many days of posts to show in feed?</label>
        <select
          className={styles.input}
          value={feedDays}
          onChange={(e) => setFeedDays(Number(e.target.value))}
        >
          <option value={1}>1 Day</option>
          <option value={3}>3 Days</option>
          <option value={7}>7 Days</option>
          <option value={30}>30 Days</option>
        </select>

        <label className={styles.label}>Whose posts appear in your feed?</label>
        <select
          className={styles.input}
          value={feedSource}
          onChange={(e) => setFeedSource(e.target.value)}
        >
          <option value="all">All Public</option>
          <option value="friends">Only Friends</option>
        </select>

        <button className={styles.saveButton} onClick={handleSave}>
          Save
        </button>
      </div>
    </Modal>
  );
}

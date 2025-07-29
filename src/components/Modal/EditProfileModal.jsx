import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import styles from './EditProfileModal.module.css';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const VERSION_OPTIONS = [
  { value: 'kjv', label: 'KJV' },
  { value: 'web', label: 'WEB' },
  { value: 'chinese_union_simp', label: 'CUVS' },
];

export default function EditProfileModal({ isOpen, onClose, user, profile }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [version, setVersion] = useState(VERSION_OPTIONS[0].value);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setDescription(profile.description || '');
      setLocation(profile.location || '');
      setVersion(profile.version || VERSION_OPTIONS[0].value);
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name,
        description,
        location,
        version,
      });
      onClose();
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <>
        <h2 className={styles.title}>Edit Profile</h2>

        <div className={styles.field}>
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className={styles.field}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about yourself"
          />
        </div>

        <div className={styles.field}>
          <label>Where are you from?</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Your location"
          />
        </div>

        <div className={styles.field}>
          <label>Preferred Bible Version</label>
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className={styles.select}
          >
            {VERSION_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.buttonContainer}>
          <button onClick={handleSave} className={styles.saveButton}>
            Save
          </button>
        </div>
      </>
    </Modal>
  );
}

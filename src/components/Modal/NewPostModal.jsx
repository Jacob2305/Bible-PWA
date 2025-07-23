import React, { useState, useEffect } from 'react';
import styles from './NewPostModal.module.css';
import Post from '../Post/Post';
import { db } from '../../firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function NewPostModal({ isOpen, onClose }) {
  const [verseInput, setVerseInput] = useState('');
  const [verseText, setVerseText] = useState('');
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');
  const [poster, setPoster] = useState('');
  const [background, setBackground] = useState(generateRandomGradient());
  const [errors, setErrors] = useState([]);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setVerseInput('');
    setVerseText('');
    setReference('');
    setDescription('');
    setPoster('');
    setBackground(generateRandomGradient());
    setErrors([]);
  }, [isOpen]);

  const handleSearch = async () => {
    if (!verseInput) return;

    try {
      const url = `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://bible-api.com/${verseInput}`
      )}`;
      const response = await fetch(url);
      const data = await response.json();
      const parsed = JSON.parse(data.contents);

      if (parsed.text) {
        setVerseText(parsed.text.trim());
        setReference(parsed.reference || verseInput);
        setBackground(generateRandomGradient(parsed.text));
      } else {
        setVerseText('Verse not found');
        setReference('');
      }
    } catch (err) {
      setVerseText('Error fetching verse');
      setReference('');
    }
  };

  const handleRandomBackground = () => {
    setBackground(generateRandomGradient());
  };

  const handleSubmit = async () => {
    if (isPosting) return;

    const missing = [];
    if (!poster.trim()) missing.push('name');
    if (
      !verseText.trim() ||
      verseText === 'Verse not found' ||
      verseText === 'Error fetching verse'
    ) {
      missing.push('verse');
    }

    if (missing.length > 0) {
      setErrors(missing);
      return;
    }

    try {
      setIsPosting(true);
      await addDoc(collection(db, 'posts'), {
        verse: verseText,
        reference,
        description,
        poster,
        colorInput: background,
        createdAt: serverTimestamp(),
      });

      setErrors([]);
      onClose();
    } catch (err) {
      console.error('Error posting to Firebase:', err);
      setErrors(['Failed to post to Firebase']);
    } finally {
      setIsPosting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          placeholder="Your name"
          value={poster}
          onChange={(e) => setPoster(e.target.value)}
          className={styles.input}
        />

        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Your verse"
            value={verseInput}
            onChange={(e) => setVerseInput(e.target.value)}
            className={styles.input}
          />
          <button className={styles.iconButton} onClick={handleSearch} aria-label="Search verse">
            🔍
          </button>
        </div>

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textarea}
        />

        <button className={styles.randomizeButton} onClick={handleRandomBackground} aria-label="Random background">
          Randomize Color 🎨
        </button>

        <div className={styles.preview}>
          <Post
            verse={verseText}
            reference={reference}
            poster={poster}
            description={description}
            colorInput={background}
            isPreview={true}
          />
        </div>

        {errors.length > 0 && (
          <div className={styles.errorBox}>
            Please fill out the following fields: {errors.join(', ')}.
          </div>
        )}

        <button
          className={styles.greenButton}
          onClick={handleSubmit}
          disabled={isPosting}
        >
          {isPosting ? 'Post' : 'Post'}
        </button>;
      </div>
    </div>
  );
}

// Utility functions
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash >>> 0;
}

function generateRandomGradient(input = '') {
  const hash = hashString(input || Math.random().toString());

  const h1 = hash % 360;
  const h2 = (h1 + 60 + (hash % 60)) % 360;
  const s1 = 65 + (hash % 20);
  const s2 = 60 + (hash % 30);
  const l1 = 45 + ((hash >> 3) % 20);
  const l2 = 45 + ((hash >> 4) % 30);

  const color1 = `hsl(${h1}, ${s1}%, ${l1}%)`;
  const color2 = `hsl(${h2}, ${s2}%, ${l2}%)`;

  return [color1, color2];
}

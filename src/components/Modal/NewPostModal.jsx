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
  const [version, setVersion] = useState('kjv');
  const [shortVersion, setShortVersion] = useState('KJV');
  const VERSION_OPTIONS = [
    { value: 'kjv', label: 'KJV' },
    { value: 'web', label: 'WEB' },
    { value: 'chinese_union_simp', label: 'CUVS' },
  ];

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

    setErrors([]);

    try {
      const match = verseInput.match(/^([^\d]+)\s+(\d+:\d+(-\d+)?)$/);
      let book = '';
      let verse = '';
      if (match) {
        book = match[1].trim();
        verse = match[2].trim();
      }
      if (version === 'cuv' && bookNameMap[book]) {
        book = bookNameMap[book];
      }

      const apiUrl = `https://api.biblesupersearch.com/api?bible=${version}&reference=${book}+${verse}`;
      const url = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;

      const response = await fetch(url);
      const data = await response.json();

      const parsed = JSON.parse(data.contents);

      if (!parsed.results || parsed.results.length === 0) {
        setVerseText('Verse not found');
        setReference('');
        return;
      }

      // The verses are nested inside results[0].verses[version][chapter][verse]
      const result = parsed.results[0];
      const versesObj = result.verses?.[version];

      if (!versesObj) {
        setVerseText('Verse not found');
        setReference('');
        return;
      }

      // The chapter number is before ':' in verse string
      const chapter = verse.split(':')[0];

      const chapterVerses = versesObj[chapter];
      if (!chapterVerses) {
        setVerseText('Verse not found');
        setReference('');
        return;
      }

      // Collect all verses in the range requested (e.g. 1-10)
      let verseText = '';
      const verseRangeMatch = verse.match(/(\d+):(\d+)(-(\d+))?/);
      if (!verseRangeMatch) {
        setVerseText('Verse not found');
        setReference('');
        return;
      }

      const startVerse = parseInt(verseRangeMatch[2], 10);
      const endVerse = verseRangeMatch[4] ? parseInt(verseRangeMatch[4], 10) : startVerse;

      for (let v = startVerse; v <= endVerse; v++) {
        if (chapterVerses[v] && chapterVerses[v].text) {
          verseText += chapterVerses[v].text + ' ';
        }
      }

      const trimmedText = verseText.trim();

      if (trimmedText.length > 500) {
        setVerseText('');
        setReference('');
        setErrors(prev => [...prev, 'verse too long']);
        return;
      }

      setVerseText(trimmedText);
      setReference(`${result.book_name} ${verse} (${shortVersion})`);
      setBackground(generateRandomGradient(trimmedText));

    } catch (err) {
      console.error(err);
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
    if (
      !verseText.trim() ||
      verseText === 'Verse not found' ||
      verseText === 'Error fetching verse'
    ) {
      missing.push('missing verse');
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

  const shouldTruncateVerse = verseText.length > 200;
  const shouldTruncateDescription = description.length > 120;

  let truncatedVerse = verseText;
  if (shouldTruncateVerse) {
    truncatedVerse = verseText.slice(0, 200) + '...';
  }
  let truncatedDescription = description;
  if (shouldTruncateDescription) {
    truncatedDescription = description.slice(0, 120) + '...';
  }

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
          <select
            value={version}
            onChange={(e) => {
              const selected = e.target.value;
              setVersion(selected);
              const selectedOption = VERSION_OPTIONS.find(opt => opt.value === selected);
              setShortVersion(selectedOption ? selectedOption.label : selected.toUpperCase());
            }}
            className={styles.select}
          >
            {VERSION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
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
            verse={truncatedVerse}
            reference={reference}
            poster={poster}
            description={truncatedDescription}
            colorInput={background}
            isPreview={true}
          />
        </div>

        {errors.length > 0 && (
          <div className={styles.errorBox}>
            Invalid input: {errors.join(', ')}.
          </div>
        )}

        <button
          className={styles.greenButton}
          onClick={handleSubmit}
          disabled={isPosting}
        >
          {isPosting ? 'Post' : 'Post'}
        </button>
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

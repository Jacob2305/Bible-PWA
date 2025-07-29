// src/pages/Memorize/components/VerseSelector.jsx
import React from 'react';
import styles from './VerseSelector.module.css';

const VerseSelector = ({
  selectedBook,
  setSelectedBook,
  selectedChapter,
  setSelectedChapter,
  selectedVerse,
  setSelectedVerse,
  selectedVersion,
  setSelectedVersion,
  onFetchVerse,
  loading,
  error,
  bibleBooks,
  versions
}) => {
  return (
    <div className={styles.container}>
      <h3>Select Verse</h3>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="book">Book</label>
          <select 
            id="book"
            value={selectedBook} 
            onChange={(e) => setSelectedBook(e.target.value)}
            className={styles.select}
          >
            <option value="">Choose book...</option>
            {bibleBooks.map(book => (
              <option key={book} value={book}>{book}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="chapter">Chapter</label>
          <input 
            id="chapter"
            type="number" 
            min="1" 
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            placeholder="1"
            className={styles.input}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="verse">Verse</label>
          <input 
            id="verse"
            type="number" 
            min="1" 
            value={selectedVerse}
            onChange={(e) => setSelectedVerse(e.target.value)}
            placeholder="1"
            className={styles.input}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="version">Version</label>
          <select 
            id="version"
            value={selectedVersion} 
            onChange={(e) => setSelectedVersion(e.target.value)}
            className={styles.select}
          >
            {versions.map(version => (
              <option key={version} value={version}>{version}</option>
            ))}
          </select>
        </div>
      </div>
      
      <button 
        className={styles.fetchButton} 
        onClick={onFetchVerse}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Load Verse'}
      </button>
      
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default VerseSelector;
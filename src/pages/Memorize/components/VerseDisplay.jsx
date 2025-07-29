// src/pages/Memorize/components/VerseDisplay.jsx
import React from 'react';
import { getWordsArray, getFirstLetters, getUnderlineHints } from '../utils/memorization';
import styles from './VerseDisplay.module.css';

const VerseDisplay = ({
  verseData,
  selectedVersion,
  currentMode,
  hiddenWords,
  showAssistance,
  currentWordIndex
}) => {
  const renderVerse = () => {
    if (!verseData?.text) return null;
    
    const words = getWordsArray(verseData.text);
    
    // First Letters Mode - show only first letters
    if (currentMode === 'firstLetters') {
      return (
        <div className={styles.verseDisplay}>
          <p className={styles.firstLettersHint}>
            {getFirstLetters(verseData.text)}
          </p>
        </div>
      );
    }
    
    // Fade Away Mode or normal display
    return (
      <div className={styles.verseDisplay}>
        <p className={styles.verseText}>
          {words.map((word, index) => {
            const isHidden = hiddenWords.has(index);
            const isCurrent = currentWordIndex === index;
            
            if (isHidden) {
              return (
                <span key={index} className={styles.hiddenWord}>
                  {showAssistance ? getUnderlineHints(word) : '____'}
                </span>
              );
            }
            
            return (
              <span 
                key={index} 
                className={`${styles.word} ${isCurrent ? styles.currentWord : ''}`}
              >
                {word}
              </span>
            );
          })}
        </p>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.verseReference}>
        {verseData.reference} ({selectedVersion})
      </div>
      {renderVerse()}
    </div>
  );
};

export default VerseDisplay;
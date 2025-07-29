// src/pages/Memorize/components/MemorizationInput.jsx
import React, { useEffect } from 'react';
import { 
  getWordsArray, 
  hideRandomWord, 
  checkWordAnswer, 
  checkFullVerseAnswer 
} from '../utils/memorization';
import styles from './MemorizationInput.module.css';

const MemorizationInput = ({
  currentMode,
  verseData,
  userInput,
  setUserInput,
  hiddenWords,
  setHiddenWords,
  currentWordIndex,
  setCurrentWordIndex,
  score,
  setScore,
  isComplete,
  setIsComplete,
  onReset
}) => {
  const words = getWordsArray(verseData.text);

  const handleSubmit = () => {
    if (currentMode === 'firstLetters') {
      // Check entire verse for first letters mode
      if (checkFullVerseAnswer(userInput, verseData.text)) {
        setScore(prev => prev + 10);
        setIsComplete(true);
      } else {
        // Give feedback for incorrect answer
        console.log('Incorrect answer, try again!');
      }
    } else if (currentMode === 'fade') {
      // Check individual word for fade mode
      const correctWord = words[currentWordIndex];
      if (checkWordAnswer(userInput, correctWord)) {
        setScore(prev => prev + 1);
        setUserInput('');
        
        // Hide next random word after a short delay
        setTimeout(() => {
          const nextIndex = hideRandomWord(words, hiddenWords);
          if (nextIndex === null) {
            setIsComplete(true);
          } else {
            setHiddenWords(prev => new Set([...prev, nextIndex]));
            setCurrentWordIndex(nextIndex);
          }
        }, 500);
      } else {
        // Give feedback for incorrect word
        console.log('Incorrect word, try again!');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Start the fade mode by hiding the first word
  useEffect(() => {
    if (currentMode === 'fade' && hiddenWords.size === 0) {
      const timer = setTimeout(() => {
        const firstIndex = hideRandomWord(words, hiddenWords);
        if (firstIndex !== null) {
          setHiddenWords(new Set([firstIndex]));
          setCurrentWordIndex(firstIndex);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentMode, words, hiddenWords, setHiddenWords, setCurrentWordIndex]);

  if (isComplete) {
    return (
      <div className={styles.completionSection}>
        <div className={styles.completionMessage}>
          <div className={styles.completionIcon}>🎉</div>
          <h3>Congratulations!</h3>
          <p>You've successfully memorized the verse!</p>
          <div className={styles.finalScore}>Final Score: {score}</div>
          
          <div className={styles.completionActions}>
            <button className={styles.resetButton} onClick={onReset}>
              Try Again
            </button>
            <button className={styles.newVerseButton} onClick={onReset}>
              Choose New Verse
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.inputSection}>
      <div className={styles.scoreDisplay}>
        Score: {score}
        {currentMode === 'fade' && (
          <span className={styles.progress}>
            ({hiddenWords.size}/{words.length} words)
          </span>
        )}
      </div>
      
      <div className={styles.inputContainer}>
        <input
          className={styles.wordInput}
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            currentMode === 'firstLetters' 
              ? "Type the entire verse..." 
              : `Type the missing word: "${words[currentWordIndex] || ''}"`
          }
          autoFocus
        />
        <button 
          className={styles.submitButton} 
          onClick={handleSubmit}
          disabled={!userInput.trim()}
        >
          Submit
        </button>
      </div>
      
      {currentMode === 'fade' && (
        <div className={styles.currentWordHint}>
          Missing word #{hiddenWords.size}: 
          <span className={styles.wordLength}>
            ({words[currentWordIndex]?.replace(/[^a-zA-Z]/g, '').length} letters)
          </span>
        </div>
      )}
      
      <div className={styles.controls}>
        <button className={styles.resetButton} onClick={onReset}>
          Reset
        </button>
        
        {currentMode === 'fade' && (
          <button 
            className={styles.skipButton}
            onClick={() => {
              // Skip current word and move to next
              const nextIndex = hideRandomWord(words, hiddenWords);
              if (nextIndex === null) {
                setIsComplete(true);
              } else {
                setHiddenWords(prev => new Set([...prev, nextIndex]));
                setCurrentWordIndex(nextIndex);
                setUserInput('');
              }
            }}
          >
            Skip Word
          </button>
        )}
      </div>
    </div>
  );
};

export default MemorizationInput;
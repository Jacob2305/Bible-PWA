// src/pages/Memorize/Memorize.jsx
import React, { useState } from 'react';
import VerseSelector from './components/VerseSelector';
import VerseDisplay from './components/VerseDisplay';
import ModeSelector from './components/ModeSelector';
import MemorizationInput from './components/MemorizationInput';
import { fetchVerseFromAPI } from './utils/api';
import { bibleBooks, versions } from './data/bibleData';
import styles from './Memorize.module.css';
import { useNavigate } from 'react-router-dom';

  

const Memorize = () => {

    const navigate = useNavigate();
  // Verse selection state
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedVerse, setSelectedVerse] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('ESV');
  const [verseData, setVerseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Memorization state
  const [currentMode, setCurrentMode] = useState(null);
  const [showAssistance, setShowAssistance] = useState(true);
  const [hiddenWords, setHiddenWords] = useState(new Set());
  const [userInput, setUserInput] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  

  const handleFetchVerse = async () => {
    if (!selectedBook || !selectedChapter || !selectedVerse) {
      setError('Please select book, chapter, and verse');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const reference = `${selectedBook} ${selectedChapter}:${selectedVerse}`;
      const data = await fetchVerseFromAPI(reference, selectedVersion);
      setVerseData(data);
    } catch (err) {
      setError('Failed to load verse. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startMode = (mode) => {
    setCurrentMode(mode);
    setHiddenWords(new Set());
    setUserInput('');
    setCurrentWordIndex(0);
    setScore(0);
    setIsComplete(false);
  };

  const resetMemorization = () => {
    setCurrentMode(null);
    setHiddenWords(new Set());
    setUserInput('');
    setCurrentWordIndex(0);
    setScore(0);
    setIsComplete(false);
  };

  

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          onClick={() => navigate('/')} // or navigate(-1) to go back
          className={styles.backButton}
        >
          ← Back to Home
        </button>
        <h2>🧠 Bible Verse Memorization</h2>
        <p>Select a verse and choose your memorization method</p>
      </div>
        <h2>🧠 Bible Verse Memorization</h2>
        <p>Select a verse and choose your memorization method</p>

      <VerseSelector
        selectedBook={selectedBook}
        setSelectedBook={setSelectedBook}
        selectedChapter={selectedChapter}
        setSelectedChapter={setSelectedChapter}
        selectedVerse={selectedVerse}
        setSelectedVerse={setSelectedVerse}
        selectedVersion={selectedVersion}
        setSelectedVersion={setSelectedVersion}
        onFetchVerse={handleFetchVerse}
        loading={loading}
        error={error}
        bibleBooks={bibleBooks}
        versions={versions}
      />

      {verseData && (
        <div className={styles.verseSection}>
          <VerseDisplay
            verseData={verseData}
            selectedVersion={selectedVersion}
            currentMode={currentMode}
            hiddenWords={hiddenWords}
            showAssistance={showAssistance}
            currentWordIndex={currentWordIndex}
          />

          {!currentMode && (
            <ModeSelector
              onStartMode={startMode}
              showAssistance={showAssistance}
              setShowAssistance={setShowAssistance}
            />
          )}

          {currentMode && (
            <MemorizationInput
              currentMode={currentMode}
              verseData={verseData}
              userInput={userInput}
              setUserInput={setUserInput}
              hiddenWords={hiddenWords}
              setHiddenWords={setHiddenWords}
              currentWordIndex={currentWordIndex}
              setCurrentWordIndex={setCurrentWordIndex}
              score={score}
              setScore={setScore}
              isComplete={isComplete}
              setIsComplete={setIsComplete}
              onReset={resetMemorization}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Memorize;
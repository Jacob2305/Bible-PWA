// src/pages/Memorize/utils/memorization.js

export const getWordsArray = (verseText) => {
  if (!verseText) return [];
  return verseText.trim().split(/\s+/);
};

export const getFirstLetters = (verseText) => {
  return getWordsArray(verseText)
    .map(word => word.charAt(0).toUpperCase())
    .join(' ');
};

export const getUnderlineHints = (word) => {
  return '_'.repeat(word.replace(/[^a-zA-Z]/g, '').length);
};

export const hideRandomWord = (words, hiddenWords) => {
  const availableIndices = words
    .map((_, index) => index)
    .filter(index => !hiddenWords.has(index));
  
  if (availableIndices.length === 0) {
    return null; // All words hidden
  }
  
  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  return randomIndex;
};

export const checkWordAnswer = (userInput, correctWord) => {
  const cleanCorrect = correctWord.toLowerCase().replace(/[^a-zA-Z]/g, '');
  const cleanUser = userInput.toLowerCase().replace(/[^a-zA-Z]/g, '');
  return cleanCorrect === cleanUser;
};

export const checkFullVerseAnswer = (userInput, verseText) => {
  const correctText = getWordsArray(verseText)
    .join(' ')
    .toLowerCase()
    .replace(/[^a-zA-Z\s]/g, '');
  const userText = userInput.toLowerCase().replace(/[^a-zA-Z\s]/g, '');
  
  return correctText === userText;
};
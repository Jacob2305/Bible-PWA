// src/pages/Memorize/data/bibleData.js

export const bibleBooks = [
  // Old Testament
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', 
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 
  'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 
  'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  
  // New Testament
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', 
  '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', 
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 
  'James', '1 Peter', '2 Peter', '1 John', '2 John', 
  '3 John', 'Jude', 'Revelation'
];

export const versions = [
  'ESV',    // English Standard Version
  'KJV',    // King James Version
  'NIV',    // New International Version
  'NASB',   // New American Standard Bible
  'NLT'     // New Living Translation
];

export const memorializationModes = [
  {
    id: 'fade',
    name: 'Fade-Away Mode',
    icon: '🔁',
    description: 'Words disappear one by one',
    instructions: 'Type each missing word as it fades away'
  },
  {
    id: 'firstLetters',
    name: 'First Letters Mode',
    icon: '🔤',
    description: 'Only first letters shown',
    instructions: 'Type the entire verse using the letter hints'
  }
];

// Popular verses for quick selection (optional feature)
export const popularVerses = [
  { reference: 'John 3:16', book: 'John', chapter: '3', verse: '16' },
  { reference: 'Romans 8:28', book: 'Romans', chapter: '8', verse: '28' },
  { reference: 'Philippians 4:13', book: 'Philippians', chapter: '4', verse: '13' },
  { reference: 'Jeremiah 29:11', book: 'Jeremiah', chapter: '29', verse: '11' },
  { reference: 'Psalm 23:1', book: 'Psalms', chapter: '23', verse: '1' },
  { reference: '1 Corinthians 10:13', book: '1 Corinthians', chapter: '10', verse: '13' },
  { reference: 'Isaiah 41:10', book: 'Isaiah', chapter: '41', verse: '10' },
  { reference: 'Matthew 28:19-20', book: 'Matthew', chapter: '28', verse: '19' }
];
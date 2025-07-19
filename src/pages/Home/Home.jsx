import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import Post from '../../components/Post/Post';

export default function Home() {
  const streak = 7;
  const points = 120;

  const checklist = [
    '🧠 Read today’s verse',
    '📖 Enter a verse you read',
    '✍️ Submit your daily manna',
    '🤝 Read a friend\'s daily manna',
  ];

  const [verseData, setVerseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://beta.ourmanna.com/api/v1/get?format=json&order=daily', {
      headers: {
        accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const verseText = data?.verse?.details?.text || 'No verse today.';
        const verseRef = data?.verse?.details?.reference || '';
        setVerseData({
          verse: verseText,
          reference: verseRef,
          poster: 'OurManna',
          description: '',
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.homeWelcome}>Welcome back! 👋</h1>

      <div className={styles.homeStatsContainer}>
        <div className={styles.homeStatBox}>
          <div className={styles.homeEmoji}>🔥</div>
          <div>
            <div className={styles.homeStatNumber}>{streak}</div>
            <div className={styles.homeStatLabel}>Streak</div>
          </div>
        </div>

        <div className={styles.homeStatBox}>
          <div className={styles.homeEmoji}>🍞</div>
          <div>
            <div className={styles.homeStatNumber}>{points}</div>
            <div className={styles.homeStatLabel}>Manna</div>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading verse of the day...</p>
      ) : verseData ? (
        <Post
          verse={verseData.verse}
          reference={verseData.reference}
          poster={verseData.poster}
          description={verseData.description}
        />
      ) : (
        <p>Failed to load verse.</p>
      )}

      <div className={styles.homeChecklistContainer}>
        <h2 className={styles.homeChecklistTitle}>Daily Checklist:</h2>
        <ul className={styles.homeChecklist}>
          {checklist.map(item => (
            <li key={item} className={styles.homeChecklistItem}>
              ☐ {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

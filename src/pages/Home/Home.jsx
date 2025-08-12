import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import Post from '../../components/Post/Post';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export default function Home() {
  const { user } = useAuth(); // Get current user
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [verseData, setVerseData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Manna verse
  useEffect(() => {
    async function fetchVerse() {
      try {
        const res = await fetch('https://beta.ourmanna.com/api/v1/get?format=json&order=daily');
        const data = await res.json();
        const verseText = data?.verse?.details?.text || 'No verse today.';
        const verseRef = data?.verse?.details?.reference || '';
        setVerseData({
          verse: verseText,
          reference: verseRef,
          poster: 'OurManna',
          description: '',
        });
      } catch (err) {
        console.error('Failed to fetch verse:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchVerse();
  }, []);

  // Fetch user streak and points
  useEffect(() => {
    if (!user) return;

    const fetchUserStats = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStreak(data.streak || 0);
          setPoints(data.points || 0);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserStats();
  }, [user]);

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.homeWelcome}>Welcome back!</h1>

      <div className={styles.homeStatsContainer}>
        <div className={styles.homeStatBox}>
          <div className={styles.homeEmoji}>🔥</div>
          <div className={styles.homeStatText}>
            <div className={styles.homeStatNumber}>{streak}</div>
            <div className={styles.homeStatLabel}>Streak</div>
          </div>
        </div>

        <div className={styles.homeStatBox}>
          <div className={styles.homeEmoji}>🍞</div>
          <div className={styles.homeStatText}>
            <div className={styles.homeStatNumber}>{points}</div>
            <div className={styles.homeStatLabel}>Manna</div>
          </div>
        </div>
      </div>

      <div className={styles.verseContainer}>
        {loading ? (
          <p className={styles.verseLoading}>Loading verse of the day...</p>
        ) : verseData ? (
          <Post
            verse={verseData.verse}
            reference={verseData.reference}
            poster={verseData.poster}
            description={verseData.description}
          />
        ) : (
          <p className={styles.verseLoading}>Failed to load verse.</p>
        )}
      </div>
    </div>
  );
}

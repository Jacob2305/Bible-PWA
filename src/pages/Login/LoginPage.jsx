import React, { useEffect, useState } from 'react';
import styles from './LoginPage.module.css';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth, provider, db } from '../../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigate('/feed');
    });
    return () => unsub();
  }, []);

  const createProfile = async (user) => {
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: user.displayName || 'Anonymous',
      email: user.email || '',
      photoURL: user.photoURL || '',
      description: '',
    }, { merge: true });
  };

  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      await createProfile(result.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAnonymous = async () => {
    try {
      const result = await signInAnonymously(auth);
      await createProfile(result.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmail = async () => {
    try {
      const fn = mode === 'signin' ? signInWithEmailAndPassword : createUserWithEmailAndPassword;
      const result = await fn(auth, email, password);
      await createProfile(result.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Daily Manna</h1>
        <p className={styles.subtitle}>Sign in to continue</p>

        {error && <p className={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.primaryButton} onClick={handleEmail}>
          {mode === 'signin' ? 'Sign In with Email' : 'Create Account'}
        </button>
        <p
          className={styles.toggle}
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
        >
          {mode === 'signin' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
        </p>

        <div className={styles.divider}>or</div>

        <button className={styles.googleButton} onClick={handleGoogle}>
          Continue with Google
        </button>
        <button className={styles.anonButton} onClick={handleAnonymous}>
          Continue as Guest
        </button>
      </div>
    </div>
  );
}

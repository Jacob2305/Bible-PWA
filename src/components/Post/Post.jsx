import React, { useState } from 'react';
import styles from './Post.module.css';

export default function Post({ verse, reference, poster, description, colorInput, isPreview = false }) {
  const [reacted, setReacted] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const handleCopy = () => {
    const textToCopy = `${verse} — ${reference}`;
    navigator.clipboard.writeText(textToCopy);
  };

  // Hash string to a number
  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash >>> 0;
  };

  // Generate two different hues for the gradient
  const generateGradient = (input) => {
    const hash = hashString(input);
    const h1 = hash % 360;
    const h2 = (hash * 3) % 360;
    const s1 = 65 + (hash % 20);
    const s2 = 60 + (hash % 30);
    const l1 = 55 + ((hash >> 3) % 20);
    const l2 = 45 + ((hash >> 4) % 30);

    const color1 = `hsl(${h1}, ${s1}%, ${l1}%)`;
    const color2 = `hsl(${h2}, ${s2}%, ${l2}%)`;

    return [color1, color2];
  };

  const [color1, color2] = colorInput?.length === 2
    ? colorInput
    : generateGradient(verse);

  const lightnessMatch = (str) => parseInt(str.match(/(\d+)%\)$/)?.[1]) || 50;
  const averageLightness = (lightnessMatch(color1) + lightnessMatch(color2)) / 2;
  const textColor = averageLightness > 60 ? '#000' : '#fff';

  return (
    <div
      className={styles.postContainer}
      style={{
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
        color: textColor
      }}
    >
      {poster && poster.trim() !== '' && (
        <div className={styles.postPoster}>Posted by {poster}</div>
      )}
      <div className={styles.postVerse}>“{verse}”</div>
      <div className={styles.postReference}>{reference}</div>
      {description && <div className={styles.postDescription}>{description}</div>}

      {!isPreview && (
        <div className={styles.postActions}>
          <button
            className={`${styles.postBtn} ${reacted ? styles.postBtnReacted : ''}`}
            onClick={() => setReacted(!reacted)}
            aria-label="React to post"
            type="button"
          >
            {reacted ? '❤️ Reacted' : '🤍 React'}
          </button>

          <button
            className={styles.postBtn}
            onClick={() => setCommentCount(commentCount + 1)}
            aria-label="Add comment"
            type="button"
          >
            💬 Comment ({commentCount})
          </button>

          <button
            className={styles.postBtn}
            onClick={handleCopy}
            aria-label="Copy verse"
            type="button"
          >
            📋 Copy
          </button>
        </div>
      )}
    </div>
  );
}

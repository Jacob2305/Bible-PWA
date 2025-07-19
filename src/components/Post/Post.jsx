import React, { useState } from 'react';
import styles from './Post.module.css';

export default function Post({ verse, reference, poster, description, colorInput }) {
  const [reacted, setReacted] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const handleCopy = () => {
    const textToCopy = `${verse} — ${reference}`;
    navigator.clipboard.writeText(textToCopy);
    alert('Verse copied to clipboard!');
  };

  // Hash string to a number
  const hashString = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    return hash >>> 0
  }

  // Generate two different hues for the gradient
  const generateGradient = (input) => {
    const hash = hashString(input)
    const h1 = hash % 360
    const h2 = (hash * 3) % 360 // different hue
    const s1 = 65 + (hash % 20) // 65–85%
    const s2 = 60 + (hash % 30)
    const l1 = 55 + ((hash >> 3) % 20) // 55–75%
    const l2 = 45 + ((hash >> 4) % 30)

    const color1 = `hsl(${h1}, ${s1}%, ${l1}%)`
    const color2 = `hsl(${h2}, ${s2}%, ${l2}%)`

    return [color1, color2]
  }

  const [color1, color2] = colorInput
    ? [colorInput, colorInput]
    : generateGradient(verse)

  // Calculate contrast against average lightness
  const averageLightness = (parseInt(color1.match(/(\d+)%\)$/)?.[1]) + parseInt(color2.match(/(\d+)%\)$/)?.[1])) / 2
  const textColor = averageLightness > 60 ? '#000' : '#fff'

  return (
    <div className={styles.postContainer}
          style={{
            background: `linear-gradient(135deg, ${color1}, ${color2})`,
            color: textColor
          }}
    >
      <div className={styles.postPoster}>Posted by {poster}</div>
      <div className={styles.postVerse}>“{verse}”</div>
      <div className={styles.postReference}>{reference}</div>

      {description && <div className={styles.postDescription}>{description}</div>}

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
    </div>
  );
}

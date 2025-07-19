import React from 'react';
import Post from '../../components/Post/Post';
import styles from './Feed.module.css';
import posts from '../../data/posts';

export default function Feed() {
  return (
    <div className={styles.feedContainer}>
      <div className={styles.newPostContainer}>
        <input
          type="text"
          placeholder="What verse or insight do you want to share?"
          className={styles.newPostInput}
        />
      </div>

      {posts.map((post, index) => (
        <div key={index} className={styles.postSpacing}>
          <Post {...post} />
        </div>
      ))}
    </div>
  );
}

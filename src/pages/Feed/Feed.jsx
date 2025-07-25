import React, { useState, useEffect } from 'react';
import Post from '../../components/Post/Post';
import NewPostModal from '../../components/Modal/NewPostModal';
import styles from './Feed.module.css';
import posts from '../../data/posts';

import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export default function Feed() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allPosts, setAllPosts] = useState(posts);

  useEffect(() => {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setAllPosts(posts);
          return;
        }

        const fetchedPosts = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            verse: data.verse || '',
            reference: data.reference || '',
            poster: data.poster || '',
            description: data.description || '',
            background: data.colorInput || ['#ffffff', '#ffffff'],
            timestamp: data.createdAt || null,
            reactions: data.reactions || {},
          };
        });

        setAllPosts(fetchedPosts);
      },
      (error) => {
        setAllPosts(posts);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleNewPost = (newPost) => {
    setAllPosts((prev) => [newPost, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.feedContainer}>
      <div
        className={styles.newPostContainer}
        onClick={() => setIsModalOpen(true)}
      >
        <input
          type="text"
          placeholder="Share a verse that you read today!"
          className={styles.newPostInput}
          readOnly
        />
      </div>

      {allPosts.map((post, index) => (
        <div key={post.id || index} className={styles.postSpacing}>
          <Post
            id={post.id}
            verse={post.verse}
            reference={post.reference}
            poster={post.poster}
            description={post.description}
            colorInput={post.background}
            reactions={post.reactions}
          />
        </div>
      ))}

      <NewPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewPost}
      />
    </div>
  );
}

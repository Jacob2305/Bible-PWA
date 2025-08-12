import { useState, useRef, useEffect } from 'react';
import styles from './Post.module.css';
import EmojiPicker from 'emoji-picker-react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';
import { updatePoints } from '../../utils/points';
import NewPostModal from '../Modal/NewPostModal';
import { onAuthStateChanged } from 'firebase/auth';

export default function Post({
  id,
  verse,
  reference,
  poster,
  description,
  colorInput,
  reactions = {},
  isPreview = false,
}) {
  const [localReactions, setLocalReactions] = useState(reactions);
  const [toggled, setToggled] = useState(new Set());
  const [showPicker, setShowPicker] = useState(false);
  const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 });
  const [commentCount, setCommentCount] = useState(0);
  const pickerRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    }

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      }
    });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      unsubscribe();
    };
  }, [showPicker]);

  const toggleReaction = async (emoji) => {
    const hasToggled = toggled.has(emoji);
    const newCount = (localReactions[emoji] || 0) + (hasToggled ? -1 : 1);
    if (newCount < 0) return;

    const updated = {
      ...localReactions,
      [emoji]: newCount,
    };

    const postRef = doc(db, 'posts', id);
    await updateDoc(postRef, { reactions: updated });
    await updatePoints(user.uid, 'react');

    setLocalReactions(updated);
    setToggled((prev) => {
      const copy = new Set(prev);
      hasToggled ? copy.delete(emoji) : copy.add(emoji);
      return copy;
    });
  };

  const handleCopy = () => {
    const textToCopy = `${verse}\n— ${reference}`;
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
    <>
    <div
      className={`${styles.postContainer} ${isPreview ? styles.previewScroll : ''}`}
      style={{
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
        color: textColor
      }}
    >
      <div className={isPreview ? styles.previewInner : ''}>
        {poster && poster.trim() !== '' && (
          <div className={styles.postPoster}>Posted by {poster}</div>
        )}
        <div className={styles.postVerse}>“{verse}”</div>
        <div className={styles.postReference}>{reference}</div>
        {description && <div className={styles.postDescription}>{description}</div>}
      </div>

      {!isPreview && (
        <div className={styles.bottomRow}>
          <div className={styles.reactions}>
            <button
              className={styles.iconBtn}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setPickerPos({ top: rect.bottom + window.scrollY + 6, left: rect.left + window.scrollX });
                setShowPicker(true);
              }}
              type="button"
              aria-label="Add emoji"
            >
              <span className="material-icons">add</span>
            </button>

            {Object.entries(localReactions)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([emoji, count]) => (
                <button
                  key={emoji}
                  className={`${styles.reactionButton} ${toggled.has(emoji) ? styles.reactionToggled : ''}`}
                  onClick={() => toggleReaction(emoji)}
                  type="button"
                >
                  <span className={styles.emojiBubble}>
                    {emoji} {count}
                  </span>
                </button>
              ))}
          </div>

          <div className={styles.actions}>
            <button className={styles.iconBtn} onClick={handleCopy} type="button" aria-label="Copy">
              <span className="material-icons">content_copy</span>
            </button>
            <button
              className={styles.iconBtn}
              type="button"
              aria-label="Repost"
              onClick={() => setIsRepostModalOpen(true)}
            >
              <span className="material-icons">repeat</span>
            </button>
            <button className={styles.iconBtn}
              type="button"
              aria-label="Comments"
              onClick={() => setCommentCount(commentCount + 1)}
            >
              <span className="material-icons">chat_bubble_outline</span>
              <span className={styles.commentCount}>{commentCount}</span>
            </button>
          </div>

          {showPicker && (
            <div
              className={styles.pickerPopup}
              style={{ top: pickerPos.top, left: pickerPos.left }}
            >
              <EmojiPicker
                onEmojiClick={(emojiObject) => {
                  setShowPicker(false);
                  toggleReaction(emojiObject.emoji);
                }}
                theme={textColor === '#000' ? 'light' : 'dark'}
                height={350}
                width={300}
              />
            </div>
          )}
        </div>
      )}
    </div>
    {showPicker && (
      <div
        ref={pickerRef}
        className={styles.pickerPopup}
        style={{ top: pickerPos.top, left: pickerPos.left }}
      >
        <EmojiPicker
          onEmojiClick={(emojiObject) => {
            setShowPicker(false);
            toggleReaction(emojiObject.emoji);
          }}
          theme={textColor === '#000' ? 'light' : 'dark'}
          height={350}
          width={300}
        />
      </div>
    )}
    {isRepostModalOpen && (
      <NewPostModal
        isOpen={isRepostModalOpen}
        onClose={() => setIsRepostModalOpen(false)}
        repostData={{
          verse,
          reference,
          description,
          colorInput: [color1, color2],
        }}
      />
    )}
    </>
  );
}
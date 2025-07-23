import React, { useEffect, useState } from 'react';
import styles from './Modal.module.css';

export default function Modal({ isOpen, onClose, children }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setShow(true));
    } else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`${styles.overlay} ${show ? styles.show : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modal}>
        {children}
      </div>
    </div>
  );
}

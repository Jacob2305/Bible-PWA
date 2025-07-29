// src/pages/Memorize/components/ModeSelector.jsx
import React from 'react';
import { memorializationModes } from '../data/bibleData';
import styles from './ModeSelector.module.css';

const ModeSelector = ({ onStartMode, showAssistance, setShowAssistance }) => {
  return (
    <div className={styles.container}>
      <h3>Choose Memorization Mode</h3>
      
      {/* Assistance Toggle */}
      <div className={styles.assistanceToggle}>
        <span className={styles.toggleLabel}>Show word length hints:</span>
        <div 
          className={`${styles.toggleSwitch} ${showAssistance ? styles.active : ''}`}
          onClick={() => setShowAssistance(!showAssistance)}
        >
          <div className={styles.toggleSlider}></div>
        </div>
      </div>
      
      {/* Mode Selection Grid */}
      <div className={styles.modesGrid}>
        <div 
          className={styles.modeButton} 
          onClick={() => onStartMode('fade')}
        >
          <div className={styles.modeIcon}>🔁</div>
          <div className={styles.modeTitle}>Fade-Away Mode</div>
          <div className={styles.modeDescription}>
            Words disappear one by one as you type them correctly
          </div>
        </div>
        
        <div 
          className={styles.modeButton} 
          onClick={() => onStartMode('firstLetters')}
        >
          <div className={styles.modeIcon}>🔤</div>
          <div className={styles.modeTitle}>First Letters Mode</div>
          <div className={styles.modeDescription}>
            Only first letters shown - type the entire verse
          </div>
        </div>
      </div>
      
      {/* Instructions */}
      <div className={styles.instructions}>
        <h4>How it works:</h4>
        <ul>
          <li><strong>Fade-Away:</strong> Start with the full verse visible. Words will randomly disappear and you'll type each missing word.</li>
          <li><strong>First Letters:</strong> See only the first letter of each word as a hint, then type the complete verse.</li>
          <li><strong>Hints:</strong> Toggle on to see underlines showing word length when words are hidden.</li>
        </ul>
      </div>
    </div>
  );
};

export default ModeSelector;
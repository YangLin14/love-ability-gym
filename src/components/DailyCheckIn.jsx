import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppProvider';
import StorageService from '../services/StorageService';
import styles from './DailyCheckIn.module.css';

const DailyCheckIn = () => {
  const { t, userStats } = useApp();
  const navigate = useNavigate();
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  useEffect(() => {
    // Check if we already logged a "Emotion Scan" or "Rapid Awareness" today
    const checkStatus = () => {
      const today = new Date().toISOString().split('T')[0];
      const logs = StorageService.getAllLogs(); // Get all logs to cover both tools
      
      const todaysLog = logs.find(log => 
        (log.tool === 'Rapid Awareness' || log.tool === 'Emotion Scan' || log.type === 'Emotion Scan') && 
        log.timestamp.startsWith(today)
      );
      
      if (todaysLog) {
        setHasCheckedIn(true);
      }
    };
    
    checkStatus();
  }, [userStats]); 

  const handleCheckIn = () => {
    // Navigate to Emotion Scan
    navigate('/module1/emotion-scan');
  };

  if (hasCheckedIn) {
    return (
      <div className={`glass-panel ${styles.completedPanel}`}>
        <div className={styles.completedContent}>
          <div className={styles.checkIcon} aria-hidden="true">
            ✅
          </div>
          <div>
            <h4 className={styles.completedTitle}>
              {typeof t('dashboard.checkin_complete') === 'string' ? t('dashboard.checkin_complete') : 'Checked in!'}
            </h4>
            <p className={styles.completedSub}>
              {typeof t('dashboard.checkin_streak_keep') === 'string' ? t('dashboard.checkin_streak_keep') : 'Great job!'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-panel ${styles.wrapper}`}>
      <h3 className={styles.title}>
        {t('dashboard.checkin_title')}
      </h3>
      <p className={styles.subtitle}>
        {t('dashboard.checkin_sub')}
      </p>
      
      <button 
        onClick={handleCheckIn}
        className={`primary-btn scale-on-active ${styles.ctaButton}`}
        aria-label="Start daily check-in"
      >
        <span className={styles.ctaIcon} aria-hidden="true">🌡️</span>
        {t('dashboard.checkin_cta')}
      </button>
    </div>
  );
};

export default DailyCheckIn;

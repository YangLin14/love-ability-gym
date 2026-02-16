import React from 'react';
import styles from '../../pages/Profile.module.css';

const StatsOverview = ({ userStats, historyCount, t }) => {
  return (
    <div className={styles.statsRow}>
       <div className={`${styles.statBox} ${styles.streakBox}`}>
          <div className={styles.streakValue}>{userStats.streak}</div>
          <div className={styles.statLabel}>{t('profile.streak')}</div>
       </div>
       <div className={`${styles.statBox} ${styles.activityBox}`}>
          <div className={styles.activityValue}>{historyCount}</div>
          <div className={styles.statLabel}>Activities</div>
       </div>
    </div>
  );
};

export default StatsOverview;

import React from 'react';
import styles from '../../pages/Profile.module.css';
import LogItem from './LogItem';

const ActivityHistory = ({ history, t }) => {
  const getToolIcon = (type) => {
    switch(type) {
      case 'Log': return '📝';
      case 'Attribution': return '🔄';
      case 'Emotion Scan': return '🌡️';
      case 'Rapid Awareness': return '⚡';
      case 'Story Buster': return '🎥';
      case 'Draft Builder': return '💌';
      case 'Apology': return '🕊️';
      case 'Permission': return '🎟️';
      case 'Spotlight Journal': return '🔦';
      default: return '✅';
    }
  };

  const getToolName = (log) => {
    return log.tool || log.type || 'Activity';
  };

  if (history.length === 0) {
    return (
      <div className={styles.noHistory}>
        {t('profile.no_history')}
      </div>
    );
  }

  return (
    <div className={styles.historyCard}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th} style={{width: '25%'}}>Date</th>
            <th className={styles.th} style={{width: '25%'}}>Activity</th>
            <th className={styles.th} style={{width: '50%'}}>Result</th>
          </tr>
        </thead>
        <tbody>
          {history.map((log) => (
            <tr key={log.id || log.uuid || Math.random()} className={styles.tr}>
              <td className={`${styles.td} ${styles.tdDate}`}>
                {new Date(log.createdAt || log.timestamp).toLocaleDateString()}
              </td>
              <td className={`${styles.td} ${styles.tdActivity}`}>
                <div className={styles.activityFlex}>
                   <span className={styles.toolIcon}>{getToolIcon(log.tool || log.type)}</span>
                   <span>{getToolName(log)}</span>
                </div>
              </td>
              <td className={`${styles.td} ${styles.tdResult}`}>
                <LogItem log={log} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityHistory;

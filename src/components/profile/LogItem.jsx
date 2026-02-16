import React from 'react';
import styles from '../../pages/Profile.module.css';

const LogItem = ({ log }) => {
  if (!log) return <span style={{color: '#ccc'}}>No Data</span>;

  const tool = log.tool || log.type;

  // Module 1
  if (tool === 'Emotion Scan' || tool === 'Rapid Awareness') {
      const score = log.score !== undefined ? log.score : log.intensity;
      const scoreDisplay = tool === 'Rapid Awareness' && score > 0 ? `+${score}` : score;
      return (
        <div>
          <span style={{fontWeight: 'bold', color: 'var(--color-sage-dark)'}}>{log.emotion}</span> 
          {score !== undefined && ` (Intensity: ${scoreDisplay})`}
          {log.location && ` @ ${log.location}`}
        </div>
      );
  }
  
  if (tool === 'Attribution Shift') {
      return <div className={styles.tdResult}>Shifted: "{log.event?.substring(0, 20)}...</div>;
  }
  
  if (tool === 'Story Buster') {
      // Quiz mode
      if (log.type === 'quiz' && log.score !== undefined) {
        return <div className={styles.tdResult}>
          <span style={{fontWeight: 'bold', color: log.percentage >= 80 ? 'var(--color-sage-dark)' : log.percentage >= 50 ? '#fb8c00' : '#e57373'}}>
            {log.score}/{log.total} ({log.percentage}%)
          </span>
        </div>;
      }
      // Practice mode
      if ((log.type === 'practice' || !log.type) && log.original_thought) {
        return <div className={styles.tdResult}>"{log.original_thought?.substring(0, 15)}..." → "{log.fact?.substring(0, 15)}..."</div>;
      }
      return <div className={styles.tdResult}>Completed</div>;
  }
  
  if (tool === 'Time Travel') {
      return <div className={styles.tdResult}>Visited self at age {log.age}</div>;
  }

  // Module 2
  if (tool === 'Draft Builder') {
      return <div style={{fontStyle: 'italic', fontSize: '13px', color: '#666'}}>{log.preview?.substring(0, 50)}...</div>;
  }
  if (tool === 'Vocabulary Swap') {
      return <div className={styles.tdResult}>Swapped {log.total_items} negative phrases</div>;
  }
  if (tool === 'Apology Builder') {
      return <div style={{fontStyle: 'italic', fontSize: '13px', color: '#666'}}>Apology for: {log.action?.substring(0, 30)}...</div>;
  }

  // Module 3
  if (tool === 'Anger Decoder') {
       return <div className={styles.tdResult}>Decoded: {log.surface_emotion} → <strong>{log.deep_fear}</strong></div>;
  }
  if (tool === 'Deep Listening Lab') {
       return <div className={styles.tdResult}>Listened for {log.duration}s (Level {log.level_id})</div>;
  }
  if (tool === 'Perspective Switcher') {
       return <div className={styles.tdResult}>Perspective: {log.notes}</div>;
  }

  // Module 4
  if (tool === 'Permission Slip') {
      return <div>Allowed: <span style={{fontWeight: 'bold'}}>{log.issue}</span></div>;
  }
  if (tool === 'Reframing Tool') {
      return <div className={styles.tdResult}>Reframed: {log.weakness} → <strong>{log.strength}</strong></div>;
  }

  // Module 5
  if (tool === 'Spotlight Journal' || log.type === 'journal') {
      return <div style={{fontStyle: 'italic', fontSize: '13px'}}>"{log.highlight?.substring(0, 30)}..."</div>;
  }
  if (tool === 'Vision Board') {
      return <div className={styles.tdResult}>Mission: {log.action}</div>;
  }
  
  // Fallback
  return <span style={{color: '#999', fontSize: '12px'}}>Task Completed</span>;
};

export default LogItem;

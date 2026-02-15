import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppProvider';
import StorageService from '../services/StorageService';

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
      <div className="glass-panel" style={{
        borderRadius: 'var(--radius-xl)',
        padding: '20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,248,240,0.9))'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <div style={{
            fontSize: '28px', 
            background: 'var(--color-sage-light)', 
            width: '48px', height: '48px', 
            borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            ✅
          </div>
          <div>
            <h4 style={{margin: '0 0 4px 0', color: 'var(--color-moss-dark)'}}>{t('dashboard.checkin_complete')}</h4>
            <p style={{margin: 0, fontSize: '13px', color: '#666'}}>{t('dashboard.checkin_streak_keep')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{
      borderRadius: 'var(--radius-xl)',
      padding: '24px',
      marginBottom: '24px',
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'center'
    }}>
      <h3 style={{
        margin: '0 0 8px 0',
        fontFamily: 'var(--font-display)',
        fontSize: '20px',
        color: 'var(--color-soft-charcoal)',
      }}>
        {t('dashboard.checkin_title')}
      </h3>
      <p style={{
        margin: '0 0 20px 0',
        fontSize: '14px',
        color: '#888'
      }}>
        {t('dashboard.checkin_sub')}
      </p>
      
      <button 
        onClick={handleCheckIn}
        className="primary-btn scale-on-active"
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '16px',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          background: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          boxShadow: 'var(--shadow-md)',
          cursor: 'pointer'
        }}
      >
        <span style={{fontSize: '20px'}}>🌡️</span>
        {t('dashboard.checkin_cta')}
      </button>
    </div>
  );
};

export default DailyCheckIn;

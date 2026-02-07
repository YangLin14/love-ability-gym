import React from 'react';
import { useApp } from '../context/AppProvider';

const CrisisOverlay = () => {
  const { isCrisisMode, toggleCrisisMode, t } = useApp();

  if (!isCrisisMode) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(56, 82, 72, 0.95)', // Deep Sage
      backdropFilter: 'blur(5px)',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      transition: 'opacity 0.5s ease'
    }}>
      
      <h2 style={{ 
        marginBottom: '60px', 
        fontSize: '32px', 
        fontWeight: '300', 
        letterSpacing: '2px',
        textAlign: 'center',
        opacity: 0.9,
        textShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        {t('common.crisis_title')}
      </h2>

      <div className="breathing-circle" style={{
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 100%)',
        borderRadius: '50%',
        marginBottom: '80px',
        boxShadow: '0 0 40px rgba(255,255,255,0.3)',
        animation: 'breathe 19s infinite ease-in-out' // 4-7-8 Timing
      }}></div>

      <button 
        onClick={toggleCrisisMode}
        style={{
          border: '1px solid rgba(255,255,255,0.5)',
          background: 'rgba(255,255,255,0.1)',
          color: 'white',
          padding: '15px 40px',
          borderRadius: 'var(--radius-full)',
          cursor: 'pointer',
          fontSize: '18px',
          letterSpacing: '1px',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
        onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
      >
        {t('common.crisis_button')}
      </button>

      <style>{`
        @keyframes breathe {
          0% { transform: scale(1); opacity: 0.5; }                   /* Start Inhale */
          21% { transform: scale(1.6); opacity: 1; }                  /* End Inhale (4s) */
          58% { transform: scale(1.6); opacity: 1; }                  /* End Hold (7s) */
          100% { transform: scale(1); opacity: 0.5; }                 /* End Exhale (8s) */
        }
      `}</style>
    </div>
  );
};

export default CrisisOverlay;

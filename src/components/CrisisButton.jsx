import React from 'react';
import { useApp } from '../context/AppProvider';

const CrisisButton = () => {
  const { toggleCrisisMode } = useApp();

  return (
    <button
      onClick={toggleCrisisMode}
      className="breathe-animation-button"
      style={{
        position: 'fixed',
        bottom: '90px',
        right: '20px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-soft-coral)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.4)',
        color: 'white',
        boxShadow: '0 4px 20px rgba(224, 159, 159, 0.4)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 30,
        transition: 'all 0.2s ease'
      }}
    >
      <span className="material-symbols-outlined" style={{
        fontSize: '28px',
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))'
      }}>
        self_improvement
      </span>
      <span style={{
        position: 'absolute',
        top: '-2px',
        right: '-2px',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.8)',
        boxShadow: '0 0 6px rgba(255,255,255,0.6)'
      }}></span>
    </button>
  );
};

export default CrisisButton;

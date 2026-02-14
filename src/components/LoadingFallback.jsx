import React from 'react';

const LoadingFallback = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#f8f9fa',
      color: 'var(--color-moss-dark, #5c7c64)'
    }}>
      <div className="spinner" style={{
        width: '40px',
        height: '40px',
        border: '4px solid rgba(92, 124, 100, 0.2)',
        borderLeftColor: 'var(--color-moss-dark, #5c7c64)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ marginTop: '20px', fontSize: '14px', fontWeight: 500 }}>
        Loading Love Ability Gym...
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingFallback;

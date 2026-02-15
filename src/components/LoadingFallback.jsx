import React from 'react';

const LoadingFallback = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      minHeight: '100dvh', // Modern mobile viewport fix
      width: '100vw',
      backgroundColor: '#f8f9fa',
      color: 'var(--color-moss-dark, #5c7c64)',
      fontFamily: 'var(--font-body, sans-serif)'
    }}>
      <div className="logo-container">
        <img 
          src="/logo.png" 
          alt="Love Ability Gym" 
          style={{
            width: '80px', 
            height: '80px', 
            objectFit: 'cover', 
            borderRadius: '50%',
            boxShadow: '0 4px 20px rgba(92, 124, 100, 0.2)'
          }} 
        />
        <div className="pulse-ring"></div>
      </div>
      
      <p style={{ 
        marginTop: '24px', 
        fontSize: '16px', 
        fontWeight: 500,
        letterSpacing: '0.5px',
        opacity: 0.8
      }}>
        Love Ability Gym
      </p>
      
      <style>{`
        .logo-container {
          position: relative;
          display: flex;
          alignItems: center;
          justifyContent: center;
        }
        
        .pulse-ring {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          border: 2px solid var(--color-moss-dark, #5c7c64);
          animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.95);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
            border-width: 2px;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
            border-width: 0px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingFallback;

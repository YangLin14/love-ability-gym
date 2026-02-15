import React, { useState, useEffect } from 'react';

const SPLASH_DURATION = 1000; // 1 second minimum
const FADE_DURATION = 600;    // fade-out duration in ms

const SplashScreen = ({ onFinished }) => {
  const [phase, setPhase] = useState('visible'); // 'visible' | 'fading' | 'done'

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setPhase('fading');
    }, SPLASH_DURATION);

    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    if (phase === 'fading') {
      const fadeTimer = setTimeout(() => {
        setPhase('done');
        onFinished();
      }, FADE_DURATION);
      return () => clearTimeout(fadeTimer);
    }
  }, [phase, onFinished]);

  if (phase === 'done') return null;

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
      minHeight: '100dvh',
      width: '100vw',
      backgroundColor: '#f8f9fa',
      color: 'var(--color-moss-dark, #5c7c64)',
      fontFamily: 'var(--font-body, sans-serif)',
      opacity: phase === 'fading' ? 0 : 1,
      transition: `opacity ${FADE_DURATION}ms ease-out`,
    }}>
      <div className="splash-logo-container">
        <img
          src="/logo.png"
          alt="Love Ability Gym"
          className="splash-logo"
          style={{
            width: '80px',
            height: '80px',
            objectFit: 'cover',
            boxShadow: '0 4px 20px rgba(92, 124, 100, 0.2)'
          }}
        />
        <div className="splash-pulse-ring"></div>
      </div>

      <p style={{
        marginTop: '28px',
        fontSize: '18px',
        fontWeight: 400,
        letterSpacing: '0.3px',
        opacity: 0.85,
        fontFamily: 'var(--font-display, Georgia, serif)',
        fontStyle: 'italic',
      }}>
        Welcome to Love Ability Gym
      </p>

      <style>{`
        .splash-logo-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .splash-logo {
          border-radius: 50%;
        }
        .splash-pulse-ring {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 50%;
          border: 2px solid var(--color-moss-dark, #5c7c64);
          animation: splash-pulse 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
        


        @keyframes splash-pulse {
          0% { transform: scale(0.95); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; border-width: 2px; }
          100% { transform: scale(1.5); opacity: 0; border-width: 0px; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;

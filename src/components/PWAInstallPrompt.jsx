import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppProvider';

const PWAInstallPrompt = () => {
  const { t, deferredPrompt, isIos, isStandalone, installPWA, showIosInstall, setShowIosInstall } = useApp();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check dismissal
    const isDismissed = localStorage.getItem('pwa_prompt_dismissed');
    if (isDismissed) {
        const dismissedTime = parseInt(isDismissed, 10);
        const now = Date.now();
        if (now - dismissedTime < 604800000) { // 7 days
            return;
        }
    }

    // Auto-show logic
    if (deferredPrompt) {
        const timer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(timer);
    } else if (isIos && !isStandalone) {
        const timer = setTimeout(() => {
             setShowIosInstall(true);
        }, 3000);
        return () => clearTimeout(timer);
    }
  }, [deferredPrompt, isIos, isStandalone, setShowIosInstall]);

  useEffect(() => {
     if (showIosInstall) {
         setIsVisible(true);
     }
  }, [showIosInstall]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (showIosInstall) setShowIosInstall(false);
    localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '90px', 
      left: '20px',
      right: '20px',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRadius: '24px',
      padding: '24px',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 1000,
      border: '1px solid rgba(255, 255, 255, 0.6)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      animation: 'slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      maxWidth: '400px',
      margin: '0 auto' // Center on larger screens
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
           <div style={{
             width: '48px', 
             height: '48px', 
             background: 'var(--color-sage-light)', 
             borderRadius: '16px',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             fontSize: '24px',
             boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
           }}>
             🌿
           </div>
           <div>
             <h4 style={{
                 margin: 0, 
                 fontFamily: 'var(--font-display)', 
                 fontSize: '18px', 
                 color: 'var(--color-sage-dark)',
                 fontWeight: '600'
             }}>
               {t('pwa.install_title') || 'Install App'}
             </h4>
             <p style={{margin: '4px 0 0', fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.4}}>
               {t('pwa.install_desc') || 'Add to home screen for a better experience'}
             </p>
           </div>
        </div>
        <button 
          onClick={handleDismiss}
          style={{
            background: '#f0f0f0', 
            border: 'none', 
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999', 
            cursor: 'pointer',
            padding: 0,
            fontSize: '16px',
            transition: 'background 0.2s'
          }}
        >
          ×
        </button>
      </div>

      {showIosInstall ? (
        <div style={{
            fontSize: '14px', 
            color: 'var(--color-soft-charcoal)', 
            background: 'var(--color-sage-light)', 
            padding: '16px', 
            borderRadius: '16px', 
            lineHeight: 1.6,
            border: '1px solid rgba(255,255,255,0.5)'
        }}>
           <div style={{marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span style={{background: 'white', opacity: 0.8, borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold'}}>1</span>
                {t('pwa.ios_step1') || "Tap the Share button"} <span style={{fontSize: '18px'}}>⎋</span>
           </div>
           <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span style={{background: 'white', opacity: 0.8, borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold'}}>2</span>
                {t('pwa.ios_step2') || "Select 'Add to Home Screen'"} <span style={{fontSize: '18px'}}>➕</span>
           </div>
        </div>
      ) : (
        <button 
          onClick={() => {
              installPWA();
          }}
          className="primary-btn"
          style={{
              width: '100%', 
              padding: '14px', 
              marginTop: '4px',
              borderRadius: '20px',
              background: 'var(--color-primary)',
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(94, 107, 92, 0.2)'
          }}
        >
          {t('pwa.install_btn') || 'Install Now'}
        </button>
      )}
      <style>{`
        @keyframes slideUpFade { 
           from { opacity: 0; transform: translateY(40px) scale(0.95); } 
           to { opacity: 1; transform: translateY(0) scale(1); } 
        }
      `}</style>
    </div>
  );
};

export default PWAInstallPrompt;

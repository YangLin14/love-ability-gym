import React, { createContext, useState, useContext, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { UserProvider, useUser } from './UserContext';
import { AuthProvider, useAuth } from './AuthContext';

const AppContext = createContext();

const AppStateProvider = ({ children }) => {
  const [isCrisisMode, setIsCrisisMode] = useState(false);
  
  // PWA State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIosInstall, setShowIosInstall] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check Platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIpad = /macintosh/.test(userAgent) && 'ontouchend' in document;
    const ios = /iphone|ipad|ipod/.test(userAgent) || isIpad;
    setIsIos(ios);

    const standalone = ('standalone' in window.navigator) && (window.navigator.standalone) || window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Capture event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('PWA prompt captured');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIos && !isStandalone) {
      setShowIosInstall(true);
    }
  };

  const toggleCrisisMode = () => {
    setIsCrisisMode(prev => !prev);
  };

  return (
    <AppContext.Provider value={{ 
      isCrisisMode, 
      setIsCrisisMode, 
      toggleCrisisMode,
      deferredPrompt,
      isIos,
      isStandalone,
      installPWA,
      showIosInstall,
      setShowIosInstall 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const AppProvider = ({ children }) => {
  return (
    <LanguageProvider>
        <AuthProvider>
          <UserProvider>
            <AppStateProvider>
              {children}
            </AppStateProvider>
          </UserProvider>
        </AuthProvider>
    </LanguageProvider>
  );
};

export const useApp = () => {
  const appContext = useContext(AppContext);
  const languageContext = useLanguage();
  const userContext = useUser();
  const authContext = useAuth();

  if (!appContext) {
    throw new Error('useApp must be used within an AppProvider');
  }

  // Combine all contexts to maintain backward compatibility
  return {
    ...appContext,
    ...languageContext,
    ...userContext,
  };
};

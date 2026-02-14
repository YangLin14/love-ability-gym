import React, { createContext, useState, useContext } from 'react';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { UserProvider, useUser } from './UserContext';

const AppContext = createContext();

const AppStateProvider = ({ children }) => {
  const [isCrisisMode, setIsCrisisMode] = useState(false);

  const toggleCrisisMode = () => {
    setIsCrisisMode(prev => !prev);
  };

  return (
    <AppContext.Provider value={{ 
      isCrisisMode, 
      setIsCrisisMode, 
      toggleCrisisMode 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const AppProvider = ({ children }) => {
  return (
    <LanguageProvider>
      <UserProvider>
        <AppStateProvider>
          {children}
        </AppStateProvider>
      </UserProvider>
    </LanguageProvider>
  );
};

export const useApp = () => {
  const appContext = useContext(AppContext);
  const languageContext = useLanguage();
  const userContext = useUser();

  if (!appContext) {
    throw new Error('useApp must be used within an AppProvider');
  }

  // Combine all contexts to maintain backward compatibility
  return {
    ...appContext,
    ...languageContext,
    ...userContext
  };
};

import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../i18n/translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isCrisisMode, setIsCrisisMode] = useState(false);
  
  // Load initial state from localStorage
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('love_ability_stats');
    return saved ? JSON.parse(saved) : {
      level: 1,
      xp: 0,
      streak: 0,
      lqScore: 0,
    };
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('love_ability_lang') || 'en';
  });

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('love_ability_profile');
    return saved ? JSON.parse(saved) : {
      name: 'User',
      age: '',
      avatar: '😊'
    };
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('love_ability_stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('love_ability_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('love_ability_lang', language);
  }, [language]);

  const toggleCrisisMode = () => {
    setIsCrisisMode(prev => !prev);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key; // Fallback to key if missing
      }
    }

    // Simple parameter interpolation
    if (typeof value === 'string') {
      Object.keys(params).forEach(param => {
        value = value.replace(`{${param}}`, params[param]);
      });
    }

    return value;
  };

  const addXp = (amount) => {
    setUserStats(prev => {
      const newXp = prev.xp + amount;
      // Simple leveling: Level * 100 XP to level up
      const nextLevelXp = prev.level * 100;
      let newLevel = prev.level;
      let remainingXp = newXp;

      if (remainingXp >= nextLevelXp) {
        newLevel += 1;
        remainingXp -= nextLevelXp;
      }
      
      return {
        ...prev,
        level: newLevel,
        xp: newXp // Total XP
      };
    });
  };

  return (
    <AppContext.Provider value={{ 
      isCrisisMode, 
      setIsCrisisMode, 
      toggleCrisisMode, 
      userStats, 
      setUserStats, 
      addXp,
      language,
      toggleLanguage,
      t,
      userProfile,
      setUserProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

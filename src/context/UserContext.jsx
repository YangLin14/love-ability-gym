import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Load initial state from localStorage
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('love_ability_stats');
    return saved ? JSON.parse(saved) : {
      level: 1,
      xp: 0,
      streak: 0,
      lqScore: 0,
      lastActivityDate: null,
    };
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

  const addXp = (amount) => {
    setUserStats(prev => {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const lastActive = prev.lastActivityDate;
      
      let newStreak = prev.streak;

      if (lastActive !== today) {
        if (lastActive) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          if (lastActive === yesterdayStr) {
            // Consecutive day
            newStreak += 1;
          } else {
            // Missed a day or more
            newStreak = 1;
          }
        } else {
          // First ever activity
          newStreak = 1;
        }
      }
      
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
        xp: newXp,
        streak: newStreak,
        lastActivityDate: today
      };
    });
  };

  return (
    <UserContext.Provider value={{ 
      userStats, 
      setUserStats, 
      addXp, 
      userProfile, 
      setUserProfile 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

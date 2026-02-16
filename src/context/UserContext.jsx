import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UserContext = createContext();

import StorageService from '../services/StorageService';
 
export const UserProvider = ({ children }) => {
  // Load initial state from localStorage
  const [userStats, setUserStats] = useState(() => {
    try {
      const saved = localStorage.getItem('love_ability_stats');
      return saved ? JSON.parse(saved) : {
        level: 1,
        xp: 0,
        streak: 0,
        lqScore: 0,
        lastActivityDate: null,
      };
    } catch (e) {
      console.error("Failed to parse user stats", e);
      return {
        level: 1,
        xp: 0,
        streak: 0,
        lqScore: 0,
        lastActivityDate: null,
      };
    }
  });

  const { user } = useAuth();

  // Sync Logic: Check cloud when user is available
  useEffect(() => {
    const sync = async () => {
      if (user) {
        // Sync Global Data (Profile, Stats)
        const cloudData = await StorageService.syncGlobalData();
        if (cloudData) {
          if (cloudData.profile) setUserProfile(cloudData.profile);
          if (cloudData.stats) setUserStats(cloudData.stats);
        }
        
        // Sync All Logs
        await StorageService.syncWithCloud();
      }
    };
    sync();
  }, [user]);
 
   const [userProfile, setUserProfile] = useState(() => {
     try {
       const saved = localStorage.getItem('love_ability_profile');
       return saved ? JSON.parse(saved) : {
         name: 'Love Practitioner',
         age: '',
         avatar: '😊'
       };
     } catch (e) {
       console.error("Failed to parse user profile", e);
       return {
         name: 'Love Practitioner',
         age: '',
         avatar: '😊'
       };
     }
   });

  // Save changes to localStorage
  // Save changes to localStorage AND Cloud via StorageService
   useEffect(() => {
     StorageService.saveStats(userStats);
   }, [userStats]);
 
   useEffect(() => {
     StorageService.saveProfile(userProfile);
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

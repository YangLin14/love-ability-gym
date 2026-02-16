import { useState, useEffect } from 'react';
import StorageService from '@/services/StorageService';
import { emotionTaxonomy, getEmotionById } from '@/data/emotionTaxonomy';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Hook to analyze user emotion data
 * @param {number} period - Number of days to analyze
 * @returns {Object} { insights, loading }
 */
export const useEmotionAnalysis = (period = 14) => {
  const { language } = useLanguage();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzeAllData();
    
    // Subscribe to storage changes for real-time updates
    const unsubscribe = StorageService.subscribe(() => {
      analyzeAllData();
    });

    return () => {
      unsubscribe();
    };
  }, [period, language]); // Re-analyze when period or language changes

  const analyzeAllData = () => {
    setLoading(true);
    
    // Get ALL logs from ALL modules
    const allLogs = StorageService.getAllLogs() || [];
    
    // Filter by date range
    const now = new Date();
    const startDate = new Date(now.getTime() - period * 24 * 60 * 60 * 1000);
    startDate.setHours(0, 0, 0, 0); // Start of day
    
    const recentLogs = allLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= startDate;
    });

    // Initialize counters
    const emotionCounts = {};
    const categoryCounts = {};
    const needCounts = {};
    const toolCounts = {};
    const intensityData = [];
    
    recentLogs.forEach(log => {
      // Count by tool/type
      const toolName = log.tool || log.type || 'Unknown';
      toolCounts[toolName] = (toolCounts[toolName] || 0) + 1;

      // Process emotion data (from EmotionScan, DraftBuilder, AngerDecoder, etc.)
      if (log.emotionId) {
        const emotion = getEmotionById(log.emotionId);
        if (emotion) {
          const label = language === 'zh' ? emotion.name_zh : emotion.name_en;
          emotionCounts[label] = (emotionCounts[label] || 0) + 1;
          
          const catLabel = language === 'zh' ? emotion.category_zh : emotion.category;
          categoryCounts[catLabel] = (categoryCounts[catLabel] || 0) + 1;
          
          const needStr = language === 'zh' ? emotion.need : (emotion.need_en || emotion.need);
          if (needStr) {
            const needs = needStr.split(/[、,]/);
            needs.forEach(need => {
              const trimmed = need.trim();
              if (trimmed) needCounts[trimmed] = (needCounts[trimmed] || 0) + 1;
            });
          }
        }
      } else if (log.emotion) {
        // Fallback for logs without emotionId
        emotionCounts[log.emotion] = (emotionCounts[log.emotion] || 0) + 1;
      }

      // Process needs from DraftBuilder
      if (log.need && !log.emotionId) {
        const needs = log.need.split(/[、,]/);
        needs.forEach(need => {
          const trimmed = need.trim();
          if (trimmed) needCounts[trimmed] = (needCounts[trimmed] || 0) + 1;
        });
      }

      // Collect intensity data
      // Unified logic for ANY tool that records emotion + intensity/score
      let score = 0;
      let hasScore = false;

      // 1. Direct Score (e.g. Rapid Awareness: -10 to 10)
      if (log.score !== undefined && log.score !== null) {
         score = Number(log.score);
         hasScore = true;
      } 
      // 2. Intensity + Category (e.g. Emotion Scan: 1 to 10, needs sign)
      else if (log.intensity !== undefined && log.intensity !== null) {
         const intensityVal = Number(log.intensity);
         
         // Determine polarity
         // Joy/Peace are positive. All others (Anger, Sadness, Fear, Disgust, Shame) are negative.
         // We check english and chinese category names just in case
         const positiveCategories = ['Joy', '喜悅', 'Peace', '平靜'];
         const category = log.category || log.category_zh || '';
         
         const isPositive = positiveCategories.some(c => category.includes(c));
         
         score = isPositive ? intensityVal : -intensityVal;
         hasScore = true;
      }

      if (hasScore && !isNaN(score)) {
        intensityData.push({
          date: new Date(log.timestamp),
          intensity: score, // We keep 'intensity' key for backward compat but it stores signed score now? 
                            // Actually existing code below used 'intensity' as absolute value for avg calculation
                            // Let's split usage.
          score: score,     // Signed value
          emotion: log.emotion || 'Check-in'
        });
      }
    });

    // Sort and get top items
    const topEmotions = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    const topNeeds = Object.entries(needCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topTools = Object.entries(toolCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Calculate averages (Use absolute intensity for "average intensity" stat)
    const avgIntensity = intensityData.length > 0 
      ? (intensityData.reduce((sum, d) => sum + Math.abs(d.score), 0) / intensityData.length).toFixed(1)
      : null;

    // Find dominant category
    const dominantCategory = topCategories[0];
    const categoryInfo = emotionTaxonomy.find(cat => 
      cat.category === dominantCategory?.[0] || cat.category_zh === dominantCategory?.[0]
    );

    // 1. Calculate Daily Averages (Last 14 days)
    const dailyAverages = [];
    for (let i = period - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString();
      
      const dayLogs = intensityData.filter(l => l.date.toLocaleDateString() === dateStr);
      
      let avgScore = 0;
      let dominantEmotionForDay = '';

      if (dayLogs.length > 0) {
          // Calculate average score for the day
          const sum = dayLogs.reduce((acc, curr) => acc + curr.score, 0);
          avgScore = Number((sum / dayLogs.length).toFixed(1));
          
          // Find dominant emotion (by frequency for simplicity, or max intensity)
          // Let's use the emotion with highest absolute intensity just like before
          const maxAbs = Math.max(...dayLogs.map(s => Math.abs(s.score)));
          const maxEntry = dayLogs.find(s => Math.abs(s.score) === maxAbs);
          if (maxEntry) dominantEmotionForDay = maxEntry.emotion;
      }

      dailyAverages.push({
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        score: avgScore,
        emotion: dominantEmotionForDay,
        fullDate: dateStr
      });
    }

    // 2. Calculate Today's Intraday Data
    const todayStr = new Date().toLocaleDateString();
    const todayLogs = intensityData
      .filter(l => l.date.toLocaleDateString() === todayStr)
      .sort((a, b) => a.date - b.date); // Sort by time ascending

    const todayIntraday = todayLogs.map(l => ({
      label: l.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      score: l.score,
      emotion: l.emotion,
      fullDate: l.date.toISOString()
    }));

    setInsights({
      totalRecords: recentLogs.length,
      topEmotions,
      topCategories,
      topNeeds,
      topTools,
      dominantCategory: categoryInfo,
      dominantCategoryCount: dominantCategory?.[1] || 0,
      avgIntensity,
      dailyAverages,
      todayIntraday,
      period
    });
    
    setLoading(false);
  };

  return { insights, loading };
};

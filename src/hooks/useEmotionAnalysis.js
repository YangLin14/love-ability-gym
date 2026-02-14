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
  }, [period, language]); // Re-analyze when period or language changes

  const analyzeAllData = () => {
    setLoading(true);
    
    // Get ALL logs from ALL modules
    const allLogs = StorageService.getAllLogs() || [];
    
    // Filter by date range
    const now = new Date();
    const startDate = new Date(now.getTime() - period * 24 * 60 * 60 * 1000);
    
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
          
          if (emotion.need) {
            const needs = emotion.need.split(/[、,]/);
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
      if (log.intensity !== undefined) {
        intensityData.push({
          date: new Date(log.timestamp),
          intensity: log.intensity,
          emotion: log.emotion
        });
      }

      // Process Rapid Awareness scores
      if (log.score !== undefined && log.tool === 'Rapid Awareness') {
        intensityData.push({
          date: new Date(log.timestamp),
          intensity: Math.abs(log.score),
          emotion: log.emotion || 'Rapid Check'
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

    // Calculate averages
    const avgIntensity = intensityData.length > 0 
      ? (intensityData.reduce((sum, d) => sum + d.intensity, 0) / intensityData.length).toFixed(1)
      : null;

    // Find dominant category
    const dominantCategory = topCategories[0];
    const categoryInfo = emotionTaxonomy.find(cat => 
      cat.category === dominantCategory?.[0] || cat.category_zh === dominantCategory?.[0]
    );

    setInsights({
      totalRecords: recentLogs.length,
      topEmotions,
      topCategories,
      topNeeds,
      topTools,
      dominantCategory: categoryInfo,
      dominantCategoryCount: dominantCategory?.[1] || 0,
      avgIntensity,
      period
    });
    
    setLoading(false);
  };

  return { insights, loading };
};

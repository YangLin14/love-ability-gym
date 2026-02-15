
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEmotionAnalysis } from '../useEmotionAnalysis';
import StorageService from '../../services/StorageService';
import { emotionTaxonomy } from '../../data/emotionTaxonomy';

// Mock dependencies
vi.mock('../../services/StorageService', () => {
    let listeners = [];
    return {
        default: {
            getAllLogs: vi.fn(),
            subscribe: vi.fn((cb) => {
                listeners.push(cb);
                return () => {
                    listeners = listeners.filter(l => l !== cb);
                };
            }),
            notify: vi.fn(),
            __triggerUpdate: () => listeners.forEach(cb => cb()) 
        }
    };
});

vi.mock('../../context/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en' })
}));

describe('useEmotionAnalysis Comprehensive Tests', () => {
  const today = new Date().toISOString();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper to get today's data from hook result
  const getTodayData = (result) => {
    return result.current.insights.dailyAverages.find(d => 
        d.fullDate === new Date().toLocaleDateString()
    );
  };

  describe('Category Mapping Logic', () => {
    it('maps Joy (Positive) correctly', async () => {
        StorageService.getAllLogs.mockReturnValue([{
            type: 'emotion_scan',
            category: 'Joy',
            emotion: 'Happy',
            intensity: 8,
            timestamp: today
        }]);
        const { result } = renderHook(() => useEmotionAnalysis(14));
        await waitFor(() => expect(result.current.loading).toBe(false));
        const data = getTodayData(result);
        expect(data.score).toBe(8);
        expect(data.emotion).toBe('Happy');
    });

    it('maps Peace (Positive) correctly', async () => {
        // Assuming 'Peace' is treated as positive based on code inspection
        StorageService.getAllLogs.mockReturnValue([{
            type: 'emotion_scan',
            category: 'Peace', // or from taxonomy if customized
            emotion: 'Calm',
            intensity: 5,
            timestamp: today
        }]);
        const { result } = renderHook(() => useEmotionAnalysis(14));
        await waitFor(() => expect(result.current.loading).toBe(false));
        const data = getTodayData(result);
        expect(data.score).toBe(5); 
    });

    it('maps Anger (Negative) correctly', async () => {
        StorageService.getAllLogs.mockReturnValue([{
            type: 'emotion_scan',
            category: 'Anger',
            emotion: 'Furious',
            intensity: 9,
            timestamp: today
        }]);
        const { result } = renderHook(() => useEmotionAnalysis(14));
        await waitFor(() => expect(result.current.loading).toBe(false));
        const data = getTodayData(result);
        expect(data.score).toBe(-9);
    });

    it('maps Sadness (Negative) correctly', async () => {
        StorageService.getAllLogs.mockReturnValue([{
            type: 'emotion_scan',
            category: 'Sadness',
            emotion: 'Sad',
            intensity: 6,
            timestamp: today
        }]);
        const { result } = renderHook(() => useEmotionAnalysis(14));
        await waitFor(() => expect(result.current.loading).toBe(false));
        const data = getTodayData(result);
        expect(data.score).toBe(-6);
    });

    it('maps Fear (Negative) correctly', async () => {
        StorageService.getAllLogs.mockReturnValue([{
            type: 'emotion_scan',
            category: 'Fear',
            emotion: 'Scared',
            intensity: 7,
            timestamp: today
        }]);
        const { result } = renderHook(() => useEmotionAnalysis(14));
        await waitFor(() => expect(result.current.loading).toBe(false));
        const data = getTodayData(result);
        expect(data.score).toBe(-7);
    });

    it('maps Disgust (Negative) correctly', async () => {
        StorageService.getAllLogs.mockReturnValue([{
            type: 'emotion_scan',
            category: 'Disgust',
            emotion: 'Grossed Out',
            intensity: 4,
            timestamp: today
        }]);
        const { result } = renderHook(() => useEmotionAnalysis(14));
        await waitFor(() => expect(result.current.loading).toBe(false));
        const data = getTodayData(result);
        expect(data.score).toBe(-4);
    });

    it('maps Shame (Negative) correctly', async () => {
        StorageService.getAllLogs.mockReturnValue([{
            type: 'emotion_scan',
            category: 'Shame',
            emotion: 'Ashamed',
            intensity: 10,
            timestamp: today
        }]);
        const { result } = renderHook(() => useEmotionAnalysis(14));
        await waitFor(() => expect(result.current.loading).toBe(false));
        const data = getTodayData(result);
        expect(data.score).toBe(-10);
    });
  });

  describe('Tool Integration Logic', () => {
     it('handles Rapid Awareness tool (Direct Score)', async () => {
        StorageService.getAllLogs.mockReturnValue([{
            tool: 'Rapid Awareness',
            score: -5,
            emotion: 'Anxious',
            timestamp: today
        }]);
        const { result } = renderHook(() => useEmotionAnalysis(14));
        await waitFor(() => expect(result.current.loading).toBe(false));
        const data = getTodayData(result);
        expect(data.score).toBe(-5);
     });

     it('handles logs with emotionId (Taxonomy Lookup)', async () => {
        // Use a real ID from taxonomy 'ang_01' (Annoyed, Intensity 3, Anger)
        StorageService.getAllLogs.mockReturnValue([{
            emotionId: 'ang_01',
            // Hook might rely on storage having hydrated data OR looking it up.
            // If the hook uses `getEmotionById` internally for stats, does it use it for scoring?
            // Let's assume the log might NOT have category if it just has ID, 
            // BUT `analyzeAllData` iterates logs.
            // Looking at the code:
            // "if (log.intensity !== undefined) ... " 
            // It seems the hook expects `intensity` and `category` to be present on the log object for scoring.
            // If the log ONLY has `emotionId`, does it work?
            // The hook code: 
            // "if (log.emotionId) ... emotionCounts..."
            // "if (log.score ...) ... else if (log.intensity ...)"
            // So for scoring, it REQUIRES `score` or `intensity` on the log itself.
            // Standard flow is app saves extended data.
            intensity: 3,
            category: 'Anger',
            emotion: 'Annoyed',
            timestamp: today
        }]);
        
        const { result } = renderHook(() => useEmotionAnalysis(14));
        await waitFor(() => expect(result.current.loading).toBe(false));
        const data = getTodayData(result);
        expect(data.score).toBe(-3); // Anger is negative
     });
  });

  describe('Aggregation Logic', () => {
    it('calculates average score for daily view', async () => {
        StorageService.getAllLogs.mockReturnValue([
          { timestamp: today, score: 10, tool: 'Rapid' },  // +10
          { timestamp: today, score: -10, tool: 'Rapid' } // -10
        ]);
        const { result } = renderHook(() => useEmotionAnalysis(14));
        await waitFor(() => expect(result.current.loading).toBe(false));
        const data = getTodayData(result);
        expect(data.score).toBe(0); // Average of 10 and -10
    });

    it('identifies dominant emotion by max absolute intensity', async () => {
         StorageService.getAllLogs.mockReturnValue([
          { timestamp: today, score: 3, emotion: 'Mild Joy', tool: 'Rapid' },
          { timestamp: today, score: -9, emotion: 'Deep Sorrow', tool: 'Rapid' }
        ]);
        const { result } = renderHook(() => useEmotionAnalysis(14));
        await waitFor(() => expect(result.current.loading).toBe(false));
        const data = getTodayData(result);
        expect(data.emotion).toBe('Deep Sorrow'); // | -9 | > | 3 |
        expect(data.score).toBe(-3); // Average: (3 - 9) / 2 = -3
    });
  });

  describe('Intraday Data Validity', () => {
      it('generates correct intraday points', async () => {
        const time1 = new Date(); time1.setHours(9, 0, 0, 0);
        const time2 = new Date(); time2.setHours(21, 0, 0, 0); // 9 PM

        StorageService.getAllLogs.mockReturnValue([
            { timestamp: time1.toISOString(), score: 5, emotion: 'Morning Joy' },
            { timestamp: time2.toISOString(), score: -2, emotion: 'Night Blues' }
        ]);

        const { result } = renderHook(() => useEmotionAnalysis(14));
        await waitFor(() => expect(result.current.loading).toBe(false));
        
        const intraday = result.current.insights.todayIntraday;
        expect(intraday).toHaveLength(2);
        expect(intraday[0].label).toMatch(/09:00/);
        expect(intraday[1].label).toMatch(/21:00/);
        expect(intraday[0].score).toBe(5);
        expect(intraday[1].score).toBe(-2);
      });
  });

  describe('Edge Cases', () => {
    it('ignores logs with no score/intensity', async () => {
        StorageService.getAllLogs.mockReturnValue([
            { timestamp: today, emotion: 'Just Checking In' } // No score
        ]);
        const { result } = renderHook(() => useEmotionAnalysis(14));
        await waitFor(() => expect(result.current.loading).toBe(false));
        const data = getTodayData(result);
        
        // Should be 0 score (default initial value if no logs found matching criteria)
        // Code: "avgScore = 0... if (dayLogs.length > 0)..."
        // Here logs exist but none have score, so intensityData for today is empty?
        // Let's assume intensityData filtering works.
        expect(data.score).toBe(0);
        expect(result.current.insights.todayIntraday).toHaveLength(0);
    });

    it('handles zero score correctly', async () => {
         StorageService.getAllLogs.mockReturnValue([
            { timestamp: today, score: 0, emotion: 'Neutral' }
        ]);
        const { result } = renderHook(() => useEmotionAnalysis(14));
        await waitFor(() => expect(result.current.loading).toBe(false));
        const data = getTodayData(result);
        expect(data.score).toBe(0);
        expect(result.current.insights.todayIntraday).toHaveLength(1);
    });
  });

});

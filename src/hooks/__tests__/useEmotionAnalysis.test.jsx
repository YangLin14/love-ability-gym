import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEmotionAnalysis } from '../useEmotionAnalysis';
import StorageService from '../../services/StorageService';

// Mock dependencies
vi.mock('../../services/StorageService', () => ({
  default: {
    getAllLogs: vi.fn(),
  }
}));

vi.mock('../../context/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en' })
}));

describe('useEmotionAnalysis Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('correctly maps Joy category to positive score', async () => {
    const today = new Date().toISOString();
    StorageService.getAllLogs.mockReturnValue([
      {
        type: 'emotion_scan',
        category: 'Joy',
        emotion: 'Happy',
        intensity: 8,
        timestamp: today
      }
    ]);

    const { result } = renderHook(() => useEmotionAnalysis(14));

    // Wait for analysis to finish
    await waitFor(() => expect(result.current.loading).toBe(false));

    const todayData = result.current.insights.dailyFluctuations.find(d => 
        d.fullDate === new Date().toLocaleDateString()
    );

    expect(todayData).toBeDefined();
    expect(todayData.score).toBe(8); // +8
    expect(todayData.emotion).toBe('Happy');
  });

  it('correctly maps Anger category to negative score', async () => {
    const today = new Date().toISOString();
    StorageService.getAllLogs.mockReturnValue([
      {
        type: 'emotion_scan',
        category: 'Anger',
        emotion: 'Furious',
        intensity: 9,
        timestamp: today
      }
    ]);

    const { result } = renderHook(() => useEmotionAnalysis(14));
    await waitFor(() => expect(result.current.loading).toBe(false));

    const todayData = result.current.insights.dailyFluctuations.find(d => 
        d.fullDate === new Date().toLocaleDateString()
    );

    expect(todayData.score).toBe(-9); // -9
    expect(todayData.emotion).toBe('Furious');
  });

  it('correctly uses Rapid Awareness score directly', async () => {
    const today = new Date().toISOString();
    StorageService.getAllLogs.mockReturnValue([
      {
        tool: 'Rapid Awareness',
        score: -5,
        emotion: 'Anxious',
        timestamp: today
      }
    ]);

    const { result } = renderHook(() => useEmotionAnalysis(14));
    await waitFor(() => expect(result.current.loading).toBe(false));

    const todayData = result.current.insights.dailyFluctuations.find(d => 
        d.fullDate === new Date().toLocaleDateString()
    );

    expect(todayData.score).toBe(-5);
  });

  it('prioritizes max absolute intensity when multiple logs exist', async () => {
    const today = new Date().toISOString();
    StorageService.getAllLogs.mockReturnValue([
      {
        tool: 'Rapid Awareness',
        score: 3, // +3
        timestamp: today
      },
      {
        type: 'emotion_scan',
        category: 'Fear',
        intensity: 7, // -7
        timestamp: today
      }
    ]);

    const { result } = renderHook(() => useEmotionAnalysis(14));
    await waitFor(() => expect(result.current.loading).toBe(false));

    const todayData = result.current.insights.dailyFluctuations.find(d => 
        d.fullDate === new Date().toLocaleDateString()
    );

    // Should pick -7 because abs(-7) > abs(3)
    expect(todayData.score).toBe(-7);
  });
});

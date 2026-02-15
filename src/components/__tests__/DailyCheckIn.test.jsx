import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DailyCheckIn from '../DailyCheckIn';
import StorageService from '../../services/StorageService';

// Mock StorageService
vi.mock('../../services/StorageService', () => ({
  default: {
    getAllLogs: vi.fn(), // Changed from getLogs to getAllLogs matching component
  }
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

// Mock useApp
const mockUseApp = vi.fn();
vi.mock('../../context/AppProvider', () => ({
  useApp: () => mockUseApp()
}));

// Helper to render
const renderWithContext = (component, contextOverrides = {}) => {
  const defaultContext = {
    addXp: vi.fn(),
    t: (key) => key,
    userStats: { xp: 0 },
    ...contextOverrides
  };
  mockUseApp.mockReturnValue(defaultContext);
  
  return render(component);
};

describe('DailyCheckIn Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    StorageService.getAllLogs.mockReturnValue([]); // Default: no logs today
  });

  it('renders call-to-action when not checked in', () => {
    renderWithContext(<DailyCheckIn />);
    expect(screen.getByText('dashboard.checkin_title')).toBeInTheDocument();
    expect(screen.getByText('dashboard.checkin_cta')).toBeInTheDocument();
  });

  it('navigates to Emotion Scan on click', () => {
    renderWithContext(<DailyCheckIn />);
    
    fireEvent.click(screen.getByText('dashboard.checkin_cta'));

    expect(mockNavigate).toHaveBeenCalledWith('/module1/emotion-scan');
  });

  it('hides CTA and shows success if already checked in today', () => {
    // Mock that we have a log from today
    const today = new Date().toISOString().split('T')[0];
    StorageService.getAllLogs.mockReturnValue([
      { tool: 'Emotion Scan', timestamp: `${today}T10:00:00.000Z` }
    ]);

    renderWithContext(<DailyCheckIn />);
    
    expect(screen.queryByText('dashboard.checkin_cta')).not.toBeInTheDocument();
    expect(screen.getByText('dashboard.checkin_complete')).toBeInTheDocument();
  });
});

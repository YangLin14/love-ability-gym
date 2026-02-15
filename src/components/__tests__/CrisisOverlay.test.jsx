import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CrisisOverlay from '../CrisisOverlay';
import * as AppContext from '../../context/AppProvider';

// Mock framer-motion to avoid unnecessary animation complexity in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props} data-testid="motion-div">{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('CrisisOverlay', () => {
  const mockToggleCrisisMode = vi.fn();
  const mockT = vi.fn((key) => {
    const translations = {
      'crisis.active': 'Crisis Mode Active',
      'crisis.inhale': 'Inhale...',
      'crisis.hold': 'Hold',
      'crisis.exhale': 'Exhale...',
      'crisis.nose': 'Nose',
      'crisis.still': 'Still',
      'crisis.mouth': 'Mouth',
      'crisis.seconds': 'seconds',
      'crisis.focus_text': 'Focus logic',
      'common.crisis_button': "I'm feeling grounded"
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderComponent = (isCrisisMode = true) => {
    vi.spyOn(AppContext, 'useApp').mockReturnValue({
      isCrisisMode,
      toggleCrisisMode: mockToggleCrisisMode,
      t: mockT,
    });
    return render(<CrisisOverlay />);
  };

  it('does not render when isCrisisMode is false', () => {
    renderComponent(false);
    expect(screen.queryByText('Crisis Mode Active')).not.toBeInTheDocument();
  });

  it('renders correctly when isCrisisMode is true', () => {
    renderComponent(true);
    expect(screen.getByText('Crisis Mode Active')).toBeInTheDocument();
    expect(screen.getByText("I'm feeling grounded")).toBeInTheDocument();
  });

  it('starts with Inhale phase (8s)', () => {
    renderComponent(true);
    // Initial state: Inhale
    expect(screen.getByText('Inhale...')).toBeInTheDocument();
    expect(screen.getByText('Nose')).toBeInTheDocument();
    // Verify 8 seconds remaining
    expect(screen.getByText(/8\s+seconds/)).toBeInTheDocument();
  });

  it('transitions to Hold phase after 8 seconds', () => {
    renderComponent(true);

    // Fast-forward 8 seconds
    act(() => {
      vi.advanceTimersByTime(8000);
    });

    // Should now be Hold
    expect(screen.getByText('Hold')).toBeInTheDocument();
    expect(screen.getByText('Still')).toBeInTheDocument();
    // Hold is 3 seconds
    expect(screen.getByText(/3\s+seconds/)).toBeInTheDocument();
  });

  it('transitions to Exhale phase after Hold (8s + 3s = 11s total)', () => {
    renderComponent(true);

    // Fast-forward 11 seconds (8 Inhale + 3 Hold)
    act(() => {
      vi.advanceTimersByTime(11000);
    });

    // Should now be Exhale
    expect(screen.getByText('Exhale...')).toBeInTheDocument();
    expect(screen.getByText('Mouth')).toBeInTheDocument();
    // Exhale is 8 seconds
    expect(screen.getByText(/8\s+seconds/)).toBeInTheDocument();
  });

  it('calls toggleCrisisMode when exit button is clicked', () => {
    renderComponent(true);
    
    const exitButton = screen.getByText("I'm feeling grounded");
    fireEvent.click(exitButton);

    expect(mockToggleCrisisMode).toHaveBeenCalledTimes(1);
  });
});

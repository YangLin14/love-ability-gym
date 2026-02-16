import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../test-utils';
import Dashboard from '../Dashboard';
import '@testing-library/jest-dom';

// Mock useNavigate
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Frontend Elements', () => {
    it('renders basic elements', async () => {
      await render(<Dashboard />);

      // Title
      expect(screen.getByText(/Gym Dashboard/i)).toBeInTheDocument();

      // Focus Quote
      expect(screen.getByText(/Today's Focus/i)).toBeInTheDocument();

      // "The Garden"
      expect(screen.getByText(/The Garden/i)).toBeInTheDocument();
    });

    it('shows user level', async () => {
      await render(<Dashboard />);
      expect(screen.getByText(/Lv\. 1/i)).toBeInTheDocument();
    });
  });

  describe('Function Logic', () => {
    it('shows 5 module cards', async () => {
      await render(<Dashboard />);

      expect(screen.getByText(/Awareness/i)).toBeInTheDocument();
      expect(screen.getByText(/Expression/i)).toBeInTheDocument();
      expect(screen.getByText(/Empathy/i)).toBeInTheDocument();
      expect(screen.getByText(/Allowing/i)).toBeInTheDocument();
      expect(screen.getByText(/Influence/i)).toBeInTheDocument();
    });

    it('navigates to module when card is clicked', async () => {
      await render(<Dashboard />);
      
      const awarenessCard = screen.getByText(/Awareness/i).closest('button');
      fireEvent.click(awarenessCard);
      
      expect(mockNavigate).toHaveBeenCalledWith('/gym?module=module1');
    });

    it('shows Assessment card when no data is saved', async () => {
      await render(<Dashboard />);

      expect(screen.getByText(/Start Here/i)).toBeInTheDocument();
      expect(screen.getByText(/Love Ability Assessment/i)).toBeInTheDocument();
    });

    it('navigates to onboarding when Assessment card is clicked', async () => {
        await render(<Dashboard />);
        
        const assessmentCard = screen.getByText(/Start Here/i).closest('.glass-panel');
        fireEvent.click(assessmentCard);
        
        expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });

    it('hides Assessment card when data exists in localStorage', async () => {
      localStorage.setItem('user_assessment', JSON.stringify({ completed: true }));
      await render(<Dashboard />);

      expect(screen.queryByText(/Start Here/i)).not.toBeInTheDocument();
    });

    it('toggles language', async () => {
      await render(<Dashboard />);

      const toggleBtn = screen.getByText('CN');
      expect(toggleBtn).toBeInTheDocument();

      fireEvent.click(toggleBtn);

      expect(screen.getByText('EN')).toBeInTheDocument();
    });
  });
});

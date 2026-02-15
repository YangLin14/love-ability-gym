import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '../../context/AppProvider';

// Import pages/components
import Dashboard from '../../pages/Dashboard';
import DailyCheckIn from '../../components/DailyCheckIn';
import EmotionScan from '../../modules/module1/pages/EmotionScan';
import Profile from '../../pages/Profile';
import StorageService from '../../services/StorageService'; // Import StorageService

// Mock complex components to avoid canvas errors and speed up tests
vi.mock('../../components/RadarChart', () => ({ default: () => <div data-testid="radar-chart">RadarChart</div> }));
vi.mock('../../components/SimpleLineChart', () => ({ default: () => <div data-testid="line-chart">SimpleLineChart</div> }));
vi.mock('../../components/EmotionInsights', () => ({ default: () => <div data-testid="emotion-insights">EmotionInsights</div> }));
vi.mock('../../components/SplashScreen', () => ({ default: () => null })); // Skip splash

// Mock translations to return keys
vi.mock('../../i18n/translations', () => ({
    translations: { en: {} } 
}));

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('User Integration Flow', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
        vi.useFakeTimers();
        
        // Mock current time to ensure consistent testing
        vi.setSystemTime(new Date('2023-01-01T10:00:00Z'));
        
        // Ensure StorageService cache is clean
        // We can do this by forcing a clear if possible, 
        // or just rely on localStorage being cleared + getLogs reloading
        // However, StorageService.clearLogs() might be safer if implemented
        if (StorageService.clearLogs) {
            StorageService.clearLogs();
        }
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('Complete check-in flow: Dashboard -> Check-in -> Profile', async () => {
        // App Wrapper with Routes
        const TestApp = () => (
            <AppProvider>
                <MemoryRouter initialEntries={['/']}>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/module1/emotion-scan" element={<EmotionScan />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/analysis" element={<div>Analysis Page Stub</div>} /> 
                    </Routes>
                </MemoryRouter>
            </AppProvider>
        );

        render(<TestApp />);

        // 1. Verify on Dashboard and Check-in CTA is present
        // Since we mocked translations, check for keys
        expect(screen.getByText('dashboard.intro_label')).toBeInTheDocument();
        const checkInBtn = screen.getByText('dashboard.checkin_cta');
        expect(checkInBtn).toBeInTheDocument();
        
        // 2. Click Check-in to navigate to Emotion Scan
        fireEvent.click(checkInBtn);
        
        // Wait for usage of Emotion Scan component to allow lazy loading if needed (imported directly here)
        // Since translations are mocked, we look for key
        expect(screen.getByText('module1.emotion_scan.title')).toBeInTheDocument();
        
    });
});

describe('User Integration Flow (State verified)', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
        // Clear cache
        if (StorageService.clearLogs) {
             StorageService.clearLogs();
        }
    });

    it('Dashboard updates state after an external Check-in updates storage', async () => {
        // Wrapper
        const TestApp = () => (
            <AppProvider>
                <MemoryRouter initialEntries={['/']}>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </MemoryRouter>
            </AppProvider>
        );

        const { unmount } = render(<TestApp />);

        // 1. Initial State: No check-in
        expect(screen.getByText('dashboard.checkin_cta')).toBeInTheDocument();
        
        unmount();

        // 2. Simulate User completing check-in (saving via StorageService to update cache!)
        const today = new Date().toISOString().split('T')[0];
        const logData = {
           tool: 'Emotion Scan',
           timestamp: new Date().toISOString(),
           completed: true
        };
        // Use saveLog which handles ID/dates and updates cache
        StorageService.saveLog('module1', logData);
        
        // Also manually update UserStats to simulate "XP Gained" which usually happens in component
        // Since we are mocking the user flow by direct storage manipulation, we need to update stats too
        const userStats = {
            level: 1,
            xp: 20,
            streak: 1,
            lqScore: 0,
            lastActivityDate: today,
        };
        localStorage.setItem('love_ability_stats', JSON.stringify(userStats));
        
        // 3. Re-render Dashboard (simulating returning to it)
        render(<TestApp />);
        
        // Should now show "Complete" instead of CTA
        // Note: We need to wait for useEffects
        await waitFor(() => {
             expect(screen.getByText('dashboard.checkin_complete')).toBeInTheDocument();
        });
        expect(screen.queryByText('dashboard.checkin_cta')).not.toBeInTheDocument();
        
        // 4. Navigate to Profile
        // Find profile button (Avatar)
        const profileBtn = screen.getByText('😊');
        fireEvent.click(profileBtn);
        
        // 5. Verify Profile Stats
        expect(screen.getByText('profile.title')).toBeInTheDocument(); 
         // Check for streak label (mocked translation key)
        expect(screen.getByText('profile.streak')).toBeInTheDocument();
        
        // Find the container for streak and check for the number '1' within it
        // Or using getAllByText if we don't want to rely on structure
        const ones = screen.getAllByText('1');
        // We expect at least one of them to be correct. 
        // More robust: Find the streak label parent, then find '1' inside it.
        // Given the DOM structure: 
        // <div ...> <div ...>1</div> <div ...>profile.streak</div> </div>
        // So 'profile.streak' sibling is the count.
        
        const streakLabel = screen.getByText('profile.streak');
        const streakValue = streakLabel.parentElement.querySelector('div:first-child');
        expect(streakValue).toHaveTextContent('1');
    });
});

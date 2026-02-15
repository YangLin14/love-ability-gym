import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Profile from '../Profile';
import * as AppProviderModule from '../../context/AppProvider';

// Mock Modules
vi.mock('../../context/AppProvider', () => ({
    useApp: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
}));

// Mock heavy components
vi.mock('../../components/RadarChart', () => ({ default: () => <div>RadarChart</div> }));
vi.mock('../../components/SimpleLineChart', () => ({ default: () => <div>LineChart</div> }));
vi.mock('../../components/EmotionInsights', () => ({ default: () => <div>Insights</div> }));
vi.mock('../../services/StorageService', () => ({
    default: { 
        clearAllData: vi.fn(),
        getAllLogs: () => [],
        getStats: () => ({})
    }
}));

describe('Profile PWA Features', () => {
    // defaults matching Profile requirements
    const defaultContext = {
        t: (k) => k,
        userProfile: { name: 'User', level: 1, xp: 0 },
        userStats: { streak: 0 },
        setUserProfile: vi.fn(),
        deferredPrompt: null,
        isIos: false,
        isStandalone: false,
        installPWA: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        AppProviderModule.useApp.mockReturnValue(defaultContext);
    });

    it('renders install button when deferredPrompt exists', () => {
        const installMock = vi.fn();
        AppProviderModule.useApp.mockReturnValue({
            ...defaultContext,
            deferredPrompt: { prompt: vi.fn() },
            installPWA: installMock
        });

        render(<Profile />);
        const title = screen.getByText('pwa.install_title');
        expect(title).toBeInTheDocument();
        expect(screen.getByText('Install')).toBeInTheDocument();
        
        // Click triggered on container
        fireEvent.click(title);
        expect(installMock).toHaveBeenCalled();
    });

    it('renders show guide button when isIos is true', () => {
        const installMock = vi.fn();
        AppProviderModule.useApp.mockReturnValue({
            ...defaultContext,
            isIos: true,
            installPWA: installMock
        });

        render(<Profile />);
        expect(screen.getByText('pwa.install_title')).toBeInTheDocument();
        expect(screen.getByText('Show Guide')).toBeInTheDocument();
        
        fireEvent.click(screen.getByText('Show Guide'));
        expect(installMock).toHaveBeenCalled();
    });

    it('does not render button if already installed (standalone)', () => {
        AppProviderModule.useApp.mockReturnValue({
            ...defaultContext,
            isIos: true,
            isStandalone: true
        });

        render(<Profile />);
        expect(screen.queryByText('pwa.install_title')).not.toBeInTheDocument();
    });
    
    it('does not render button if neither deferredPrompt nor ios', () => {
        AppProviderModule.useApp.mockReturnValue({
            ...defaultContext,
            deferredPrompt: null,
            isIos: false,
            isStandalone: false
        });

        render(<Profile />);
        expect(screen.queryByText('pwa.install_title')).not.toBeInTheDocument();
    });
});

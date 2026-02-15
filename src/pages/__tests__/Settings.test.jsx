
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../test-utils';
import Settings from '../Settings';
import * as AppProviderModule from '../../context/AppProvider';
import * as AuthContextModule from '../../context/AuthContext';

// Mock dependencies
vi.mock('../../context/AppProvider', () => ({
    useApp: vi.fn(),
    AppProvider: ({ children }) => <div>{children}</div>
}));

vi.mock('../../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

// Mock StorageService
vi.mock('../../services/StorageService', () => ({
    default: { 
        syncWithCloud: vi.fn(),
        syncGlobalData: vi.fn().mockResolvedValue({}),
        saveProfile: vi.fn(),
        saveStats: vi.fn(),
        subscribe: vi.fn(() => vi.fn()),
        notify: vi.fn()
    }
}));

describe('Settings Page', () => {
    const defaultAppContext = {
        t: (k) => k,
        deferredPrompt: null,
        isIos: false,
        isStandalone: false,
        installPWA: vi.fn(),
    };

    const defaultAuthContext = {
        user: null,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        AppProviderModule.useApp.mockReturnValue(defaultAppContext);
        AuthContextModule.useAuth.mockReturnValue(defaultAuthContext);
    });

    it('renders basic elements', () => {
        render(<Settings />);
        expect(screen.getByText('settings.title')).toBeInTheDocument();
        expect(screen.getByText('settings.cloud_sync')).toBeInTheDocument();
        expect(screen.getByText('settings.danger_zone')).toBeInTheDocument();
    });

    it('renders Reset All Data button', () => {
        render(<Settings />);
        // The button text might be from translation 'profile.reset_btn' or fallback
        // The mock t returns the key, so we look for 'profile.reset_btn'
        expect(screen.getByText('profile.reset_btn')).toBeInTheDocument();
    });

    describe('PWA Install Features', () => {
        it('renders install button when deferredPrompt exists', () => {
            const installMock = vi.fn();
            AppProviderModule.useApp.mockReturnValue({
                ...defaultAppContext,
                deferredPrompt: { prompt: vi.fn() },
                installPWA: installMock
            });

            render(<Settings />);
            expect(screen.getByText('pwa.install_title')).toBeInTheDocument();
            expect(screen.getByText('Install')).toBeInTheDocument();
            
            // Click to install
            fireEvent.click(screen.getByText('pwa.install_title').closest('div').parentElement);
            expect(installMock).toHaveBeenCalled();
        });

        it('renders show guide button when isIos is true', () => {
            const installMock = vi.fn();
            AppProviderModule.useApp.mockReturnValue({
                ...defaultAppContext,
                isIos: true,
                installPWA: installMock
            });

            render(<Settings />);
            expect(screen.getByText('pwa.install_title')).toBeInTheDocument();
            expect(screen.getByText('Show Guide')).toBeInTheDocument();
        });

        it('does not render button if already installed (standalone)', () => {
            AppProviderModule.useApp.mockReturnValue({
                ...defaultAppContext,
                isIos: true,
                isStandalone: true
            });

            render(<Settings />);
            expect(screen.queryByText('pwa.install_title')).not.toBeInTheDocument();
        });
    });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import PWAInstallPrompt from '../PWAInstallPrompt';
import * as AppProviderModule from '../../context/AppProvider';

// Mock useApp
vi.mock('../../context/AppProvider', () => ({
    useApp: vi.fn()
}));

describe('PWAInstallPrompt Component', () => {
    const mockInstallPWA = vi.fn();
    const mockSetShowIosInstall = vi.fn();
    const mockT = (key) => key;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        
        // Default mock return
        AppProviderModule.useApp.mockReturnValue({
            t: mockT,
            deferredPrompt: null,
            isIos: false,
            isStandalone: false,
            installPWA: mockInstallPWA,
            showIosInstall: false,
            setShowIosInstall: mockSetShowIosInstall
        });
    });

    it('renders nothing by default', () => {
        render(<PWAInstallPrompt />);
        expect(screen.queryByText('pwa.install_title')).not.toBeInTheDocument();
    });

    it('renders install button when deferredPrompt is present (Android)', async () => {
        AppProviderModule.useApp.mockReturnValue({
            t: mockT,
            deferredPrompt: { prompt: vi.fn() },
            isIos: false,
            isStandalone: false,
            installPWA: mockInstallPWA,
            showIosInstall: false,
            setShowIosInstall: mockSetShowIosInstall
        });

        render(<PWAInstallPrompt />);
        
        // Wait for timer (2000ms)
        // We generally use fake timers for this, but simplistic approach verify null first
        // If we want to test visibility we need vitest fake timers
        // Let's rely on standard testing logic or just bypass timer for unit test if possible?
        // Logic: setTimeout(() => setIsVisible(true), 2000);
        // We will use vi.useFakeTimers();
    });
});

describe('PWAInstallPrompt with Timers', () => {
    const mockInstallPWA = vi.fn();
    const mockSetShowIosInstall = vi.fn();
    const mockT = (key) => key;

    beforeEach(() => {
        vi.useFakeTimers();
        localStorage.clear();
        AppProviderModule.useApp.mockReturnValue({
            t: mockT,
            deferredPrompt: null,
            isIos: false,
            isStandalone: false,
            installPWA: mockInstallPWA,
            showIosInstall: false,
            setShowIosInstall: mockSetShowIosInstall
        });
    });
    
    afterEach(() => {
        vi.useRealTimers();
    });

    it('shows after delay when deferredPrompt exists', async () => {
        AppProviderModule.useApp.mockReturnValue({
            t: mockT,
            deferredPrompt: { prompt: vi.fn() },
            isIos: false,
            isStandalone: false,
            installPWA: mockInstallPWA,
            showIosInstall: false,
            setShowIosInstall: mockSetShowIosInstall
        });

        render(<PWAInstallPrompt />);
        expect(screen.queryByText('pwa.install_title')).not.toBeInTheDocument();

        // Fast forward
        await act(async () => {
            await vi.advanceTimersByTimeAsync(2500);
        });
        
        expect(screen.getByText('pwa.install_title')).toBeInTheDocument();
        expect(screen.getByText('pwa.install_btn')).toBeInTheDocument();

        // Click install
        fireEvent.click(screen.getByText('pwa.install_btn'));
        expect(mockInstallPWA).toHaveBeenCalled();
    });

    it('shows iOS guide when showIosInstall is true', () => {
        AppProviderModule.useApp.mockReturnValue({
            t: mockT,
            deferredPrompt: null,
            isIos: true,
            isStandalone: false,
            installPWA: mockInstallPWA,
            showIosInstall: true, // Triggered manually or by timer
            setShowIosInstall: mockSetShowIosInstall
        });

        render(<PWAInstallPrompt />);
        // Should be visible immediately (no timer for manual trigger sync)
        expect(screen.getByText('pwa.install_title')).toBeInTheDocument();
        expect(screen.getByText('pwa.ios_step1')).toBeInTheDocument();
    });

    it('handles auto-show for iOS', async () => {
        AppProviderModule.useApp.mockReturnValue({
            t: mockT,
            deferredPrompt: null,
            isIos: true,
            isStandalone: false,
            installPWA: mockInstallPWA,
            showIosInstall: false,
            setShowIosInstall: mockSetShowIosInstall
        });

        render(<PWAInstallPrompt />);
        
        await act(async () => {
            await vi.advanceTimersByTimeAsync(3500);
        });
        
        expect(mockSetShowIosInstall).toHaveBeenCalledWith(true);
    });

    it('hides when dismissed', async () => {
        AppProviderModule.useApp.mockReturnValue({
            t: mockT,
            deferredPrompt: { prompt: vi.fn() },
            isIos: false,
            isStandalone: false,
            installPWA: mockInstallPWA,
            showIosInstall: false,
            setShowIosInstall: mockSetShowIosInstall
        });

        render(<PWAInstallPrompt />);
        
        await act(async () => {
            await vi.advanceTimersByTimeAsync(2500);
        });
        
        const closeBtn = screen.getByText(/×/);
        fireEvent.click(closeBtn);
        
        // Should hide
        expect(screen.queryByText('pwa.install_title')).not.toBeInTheDocument();
        // Should save to localStorage
        expect(localStorage.getItem('pwa_prompt_dismissed')).toBeTruthy();
    });
});

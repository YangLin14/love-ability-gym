import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useApp } from '../AppProvider';
import React from 'react';

// Wrapper for renderHook
const wrapper = ({ children }) => (
  <AppProvider>
      {children}
  </AppProvider>
);

// Mock AuthContext if not already mocked by AppProvider's internal structure
// Since AppProvider internally renders AuthProvider, we might need to mock supabase or the context hook if it's used directly.
// But wait, AppProvider IMPORTS AuthProvider.
// If we want to test AppProvider, we should probably mock the AuthProvider module or the supabase client it uses.
// Let's mock the AuthContext module to avoid real supabase calls during these tests.
vi.mock('../AuthContext', async () => {
    const actual = await vi.importActual('../AuthContext');
    return {
        ...actual,
        AuthProvider: ({ children }) => <div>{children}</div>,
        useAuth: () => ({ user: { id: 'test-user' }, loading: false })
    };
});

describe('AppProvider PWA Logic', () => {
  let originalUserAgent;

  beforeEach(() => {
    originalUserAgent = window.navigator.userAgent;
    vi.clearAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true
    });
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    expect(result.current.deferredPrompt).toBeNull();
    expect(result.current.isIos).toBe(false); // Default mock usually non-iOS
    expect(result.current.showIosInstall).toBe(false);
  });

  it('detects iOS platform', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      configurable: true
    });

    const { result } = renderHook(() => useApp(), { wrapper });
    expect(result.current.isIos).toBe(true);
  });

  it('captures beforeinstallprompt event', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    
    const event = new Event('beforeinstallprompt');
    event.preventDefault = vi.fn();
    event.prompt = vi.fn(); // Mock prompt method
    
    act(() => {
      window.dispatchEvent(event);
    });

    expect(result.current.deferredPrompt).toBe(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('installPWA calls prompt on Android', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    
    // Simulate event capture
    const event = new Event('beforeinstallprompt');
    event.preventDefault = vi.fn();
    event.prompt = vi.fn();
    event.userChoice = Promise.resolve({ outcome: 'accepted' });
    
    act(() => {
      window.dispatchEvent(event);
    });

    // Verify state matches
    expect(result.current.deferredPrompt).toBe(event);

    // Call install
    await act(async () => {
        await result.current.installPWA();
    });

    expect(event.prompt).toHaveBeenCalled();
    // Should clear deferredPrompt after acceptance
    expect(result.current.deferredPrompt).toBeNull();
  });

  it('installPWA shows iOS guide on iOS', () => {
    // Mock iOS
    Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)...',
        configurable: true
    });

    const { result } = renderHook(() => useApp(), { wrapper });
    
    act(() => {
        result.current.installPWA();
    });

    expect(result.current.showIosInstall).toBe(true);
  });
});

import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React, { useEffect } from 'react';
import { UserProvider, useUser } from '../UserContext';

// Test component to consume the context
const TestComponent = ({ onMount }) => {
  const user = useUser();
  useEffect(() => {
    if (onMount) onMount(user);
  }, [onMount, user]);

  return (
    <div>
      <div data-testid="streak">{user.userStats.streak}</div>
      <div data-testid="xp">{user.userStats.xp}</div>
      <button onClick={() => user.addXp(10)}>Add XP</button>
    </div>
  );
};

describe('UserContext Streak Logic', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with streak 0', () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );
    expect(screen.getByTestId('streak').textContent).toBe('0');
  });

  it('sets streak to 1 on first activity', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const btn = screen.getByText('Add XP');
    await act(async () => {
      btn.click();
    });

    expect(screen.getByTestId('streak').textContent).toBe('1');
  });

  it('keeps streak at 1 for multiple activities on same day', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const btn = screen.getByText('Add XP');
    await act(async () => {
      btn.click();
    });
    expect(screen.getByTestId('streak').textContent).toBe('1');

    await act(async () => {
      btn.click();
    });
    expect(screen.getByTestId('streak').textContent).toBe('1');
  });

  it('increments streak to 2 on consecutive day', async () => {
    // 1. Simluate activity "Yesterday"
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    vi.setSystemTime(yesterday);

    const { unmount } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const btn = screen.getByText('Add XP');
    await act(async () => {
      btn.click();
    });
    expect(screen.getByTestId('streak').textContent).toBe('1');
    
    // Unmount to simulate app close
    unmount();

    // 2. Simulate "Today"
    vi.setSystemTime(new Date()); // Reset to real today (or strict tomorrow relative to yesterday)
    // Actually, strictly move forward 24 hours from "yesterday"
    const today = new Date(yesterday);
    today.setDate(today.getDate() + 1);
    vi.setSystemTime(today);

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const btn2 = screen.getByText('Add XP');
    // Before click, streak should be 1 (persisted)
    expect(screen.getByTestId('streak').textContent).toBe('1');

    await act(async () => {
      btn2.click();
    });

    // After click, should be 2
    expect(screen.getByTestId('streak').textContent).toBe('2');
  });

  it('resets streak to 1 if a day is missed', async () => {
    // 1. Simulate activity "2 Days Ago"
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    vi.setSystemTime(twoDaysAgo);

    const { unmount } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await act(async () => {
      screen.getByText('Add XP').click();
    });
    expect(screen.getByTestId('streak').textContent).toBe('1');
    unmount();

    // 2. Simulate "Today"
    vi.setSystemTime(new Date());

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await act(async () => {
      screen.getByText('Add XP').click();
    });

    // Should reset to 1, not 2
    expect(screen.getByTestId('streak').textContent).toBe('1');
  });
});

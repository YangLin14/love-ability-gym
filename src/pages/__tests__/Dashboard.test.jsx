import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '../../test-utils';
import Dashboard from '../Dashboard';
import '@testing-library/jest-dom';

describe('Frontend Elements', () => {
  it('渲染基本元素', () => {
    render(<Dashboard />);

    // 顯示標題 "Gym Dashboard"
    expect(screen.getByText(/Gym Dashboard/i)).toBeInTheDocument();

    // 顯示 Focus Quote 標題
    expect(screen.getByText(/Today's Focus/i)).toBeInTheDocument();

    // 顯示 "The Garden" 標題
    expect(screen.getByText(/The Garden/i)).toBeInTheDocument();
  });

  it('顯示使用者等級', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Lv\. 1/i)).toBeInTheDocument();
  });
});

describe('Function Logic', () => {
  it('顯示 5 個模組卡片', () => {
    render(<Dashboard />);

    // 4 module cards in grid + 1 full-width
    expect(screen.getByText(/Awareness/i)).toBeInTheDocument();
    expect(screen.getByText(/Expression/i)).toBeInTheDocument();
    expect(screen.getByText(/Empathy/i)).toBeInTheDocument();
    expect(screen.getByText(/Allowing/i)).toBeInTheDocument();
    expect(screen.getByText(/Influence/i)).toBeInTheDocument();
  });

  it('顯示 Assessment 卡片 (無評估資料時)', () => {
    render(<Dashboard />);

    expect(screen.getByText(/Start Here/i)).toBeInTheDocument();
    expect(screen.getByText(/Love Ability Assessment/i)).toBeInTheDocument();
  });

  it('切換語言', () => {
    render(<Dashboard />);

    const toggleBtn = screen.getByText('CN');
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);

    expect(screen.getByText('EN')).toBeInTheDocument();
  });
});

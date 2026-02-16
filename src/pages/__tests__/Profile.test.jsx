import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../test-utils';
import Profile from '../Profile';
import '@testing-library/jest-dom';

// Mock child components that are complex / canvas-based
vi.mock('../../components/RadarChart', () => ({
  default: (props) => <div data-testid="radar-chart" data-props={JSON.stringify(props)}>RadarChart</div>,
}));
vi.mock('../../components/SimpleLineChart', () => ({
  default: (props) => <div data-testid="line-chart" data-props={JSON.stringify(props)}>SimpleLineChart</div>,
}));
vi.mock('../../components/EmotionInsights', () => ({
  default: (props) => <div data-testid="emotion-insights" data-props={JSON.stringify(props)}>EmotionInsights</div>,
}));

// Mock StorageService
vi.mock('../../services/StorageService', () => ({
  default: {
    getAllLogs: () => [],
    getStats: () => ({}),
    saveProfile: vi.fn(),
    saveStats: vi.fn(),
    syncGlobalData: vi.fn().mockResolvedValue({}),
    init: vi.fn(),
    clearAllData: vi.fn(),
  },
}));

describe('Frontend Elements', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('渲染基本元素', async () => {
    await render(<Profile />);

    // 顯示標題 "Profile & History"
    expect(screen.getByText(/Profile & History/i)).toBeInTheDocument();

    // 顯示返回按鈕
    expect(screen.getByText('←')).toBeInTheDocument();

    // 顯示使用者名稱 (default: "User")
    expect(screen.getByText(/User/)).toBeInTheDocument();

    // 顯示等級
    expect(screen.getByText(/Lv\. 1/)).toBeInTheDocument();

    // 顯示 "Day Streak" 和 "Activities"
    expect(screen.getByText(/Day Streak/i)).toBeInTheDocument();
    expect(screen.getByText(/Activities/i)).toBeInTheDocument();

    // 無歷史資料
    expect(screen.getByText(/No training history yet/i)).toBeInTheDocument();
  });

  it('顯示 Profile 卡片（預設資料）', async () => {
    await render(<Profile />);

    // 頭像
    expect(screen.getByText('😊')).toBeInTheDocument();

    // 名稱
    expect(screen.getByText(/User/)).toBeInTheDocument();

    // XP
    expect(screen.getByText(/0 XP/)).toBeInTheDocument();
  });
});

describe('Function Logic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('進入編輯模式', async () => {
    await render(<Profile />);

    // 點擊頭像觸發編輯
    fireEvent.click(screen.getByText('😊'));

    // 顯示輸入欄位 labels
    expect(screen.getByText('Avatar')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();

    // 顯示 Save 按鈕
    expect(screen.getByText(/Save Changes/i)).toBeInTheDocument();
  });

  it('點擊鉛筆圖示進入編輯模式', async () => {
    await render(<Profile />);
    
    // 點擊鉛筆
    fireEvent.click(screen.getByText('✏️'));

    // 驗證進入編輯模式
    expect(screen.getByText(/Save Changes/i)).toBeInTheDocument();
  });

  it('編輯 Profile 並儲存', async () => {
    await render(<Profile />);

    // 進入編輯模式
    fireEvent.click(screen.getByText('😊'));

    // 修改 Name
    const nameInput = screen.getByDisplayValue('User');
    fireEvent.change(nameInput, { target: { value: 'TestUser' } });

    // 儲存
    fireEvent.click(screen.getByText(/Save Changes/i));

    // 回到顯示模式，顯示新名稱
    expect(screen.getByText(/TestUser/)).toBeInTheDocument();
  });


});

export type ScreenType = 'home' | 'gym' | 'stats' | 'settings' | 'crisis' | 'log';

export interface NavigationProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export interface MetricData {
  subject: string;
  A: number;
  fullMark: number;
}

import React from 'react';
import { NavigationProps, ScreenType } from '../types';

const Navigation: React.FC<NavigationProps> = ({ currentScreen, onNavigate }) => {
  const navItems: { id: ScreenType; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'grid_view' },
    { id: 'gym', label: 'Gym', icon: 'fitness_center' },
    { id: 'stats', label: 'Stats', icon: 'bar_chart' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 bg-white/80 backdrop-blur-xl border-t border-gray-100 pb-8 pt-4 px-8 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
      <ul className="flex justify-between items-center max-w-sm mx-auto">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-1 group w-full"
            >
              <span
                className={`material-symbols-outlined text-2xl transition-all ${
                  currentScreen === item.id
                    ? 'text-moss-dark scale-110'
                    : 'text-gray-400 group-hover:text-moss-dark'
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  currentScreen === item.id
                    ? 'text-moss-dark'
                    : 'text-gray-400 group-hover:text-moss-dark'
                }`}
              >
                {item.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
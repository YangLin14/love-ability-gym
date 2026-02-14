import React, { useState } from 'react';
import Home from './screens/Home';
import CrisisMode from './screens/CrisisMode';
import DataCenter from './screens/DataCenter';
import QuickLog from './screens/QuickLog';
import Navigation from './components/Navigation';
import { ScreenType } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home onNavigate={setCurrentScreen} />;
      case 'crisis':
        return <CrisisMode onExit={() => setCurrentScreen('home')} />;
      case 'stats':
        return <DataCenter onNavigate={setCurrentScreen} />;
      case 'log':
        return <QuickLog onNavigate={setCurrentScreen} />;
      case 'gym':
        // Reuse home or specific placeholder for gym if needed, sticking to design provided
        return <Home onNavigate={setCurrentScreen} />; 
      default:
        return <Home onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {renderScreen()}
      
      {/* Navigation is hidden on Crisis mode */}
      {currentScreen !== 'crisis' && (
        <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      )}
    </div>
  );
}
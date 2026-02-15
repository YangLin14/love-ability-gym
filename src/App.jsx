import React, { Suspense, lazy, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppProvider';
import CrisisButton from './components/CrisisButton';
import CrisisOverlay from './components/CrisisOverlay';
import BottomNav from './components/BottomNav';
import LoadingFallback from './components/LoadingFallback';
import SplashScreen from './components/SplashScreen';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Gym = lazy(() => import('./pages/Gym'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

import { module1Routes } from './modules/module1/routes';
import { module2Routes } from './modules/module2/routes';
import { module3Routes } from './modules/module3/routes';
import { module4Routes } from './modules/module4/routes';
import { module5Routes } from './modules/module5/routes';

const NAV_PATHS = ['/', '/gym', '/profile'];

function AppContent() {
  const location = useLocation();
  const showNav = NAV_PATHS.includes(location.pathname);

  return (
    <div className="app-container">
      <CrisisOverlay />
      
      {/* Persistent Background Blobs */}
      <div className="background-blobs">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="blob-3"></div>
      </div>

      <Suspense fallback={<LoadingFallback />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            } />
            <Route path="/gym" element={
              <PageTransition>
                <Gym />
              </PageTransition>
            } />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/profile" element={
              <PageTransition>
                <Profile />
              </PageTransition>
            } />
            <Route path="/settings" element={<Settings />} />
            
            {/* Module 1 Routes */}
            {module1Routes.map(route => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}

            {/* Module 2 Routes */}
            {module2Routes.map(route => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            
            {/* Module 3 Routes */}
            {module3Routes.map(route => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            {/* Module 4 Routes */}
            {module4Routes.map(route => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            {/* Module 5 Routes */}
            {module5Routes.map(route => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </AnimatePresence>
      </Suspense>
      <CrisisButton />
      {showNav && <BottomNav />}
      <PWAInstallPrompt />
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashFinished = useCallback(() => setShowSplash(false), []);

  return (
    <AppProvider>
      {showSplash && <SplashScreen onFinished={handleSplashFinished} />}
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;

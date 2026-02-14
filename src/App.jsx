import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppProvider';
import Dashboard from './pages/Dashboard';
import Gym from './pages/Gym';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import CrisisButton from './components/CrisisButton';
import CrisisOverlay from './components/CrisisOverlay';
import BottomNav from './components/BottomNav';

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
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/gym" element={<Gym />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/profile" element={<Profile />} />
        
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
      <CrisisButton />
      {showNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;

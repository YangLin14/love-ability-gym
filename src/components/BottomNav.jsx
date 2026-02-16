import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './BottomNav.module.css';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: '/', label: 'Home', icon: 'grid_view' },
    { id: '/gym', label: 'Gym', icon: 'fitness_center' },
    { id: '/profile', label: 'Stats', icon: 'bar_chart' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={styles.nav} role="navigation" aria-label="Main navigation">
      <ul className={styles.list}>
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => navigate(item.id)}
              className={`${styles.button} ${isActive(item.id) ? styles.active : ''}`}
              aria-label={item.label}
              aria-current={isActive(item.id) ? 'page' : undefined}
            >
              <span className={`material-symbols-outlined ${styles.icon}`} aria-hidden="true">
                {item.icon}
              </span>
              <span className={styles.label}>
                {item.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNav;

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      zIndex: 40,
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(240, 242, 239, 0.8)',
      paddingBottom: 'calc(env(safe-area-inset-bottom, 20px) + 12px)',
      paddingTop: '12px',
      paddingLeft: '32px',
      paddingRight: '32px',
      boxShadow: '0 -10px 40px rgba(0,0,0,0.02)'
    }}>
      <ul style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '320px',
        margin: '0 auto',
        padding: 0,
        listStyle: 'none'
      }}>
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => navigate(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 16px',
                transition: 'all 0.2s ease'
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '24px',
                  transition: 'all 0.2s ease',
                  color: isActive(item.id) ? 'var(--color-moss-dark)' : '#bbb',
                  transform: isActive(item.id) ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                {item.icon}
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 500,
                color: isActive(item.id) ? 'var(--color-moss-dark)' : '#bbb',
                transition: 'color 0.2s ease'
              }}>
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

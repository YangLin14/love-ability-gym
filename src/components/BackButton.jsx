import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BackButton = ({ defaultPath = '/', className = '', style = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Check if there is a previous entry in the history stack
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(defaultPath);
    }
  };

  return (
    <button 
      onClick={handleBack} 
      className={`back-btn ${className}`}
      style={{
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        padding: '0 10px 0 0',
        color: 'var(--color-ink-black)',
        display: 'flex',
        alignItems: 'center',
        ...style
      }}
      aria-label="Go back"
    >
      ←
    </button>
  );
};

export default BackButton;

import React from 'react';
import { useApp } from '../context/AppProvider';

const CrisisButton = () => {
  const { toggleCrisisMode, t } = useApp();

  return (
    <button
      onClick={toggleCrisisMode}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-crisis-red)',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      {t('common.crisis')}
    </button>
  );
};

export default CrisisButton;

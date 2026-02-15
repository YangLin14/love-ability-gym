import React from 'react';
import { useApp } from '../context/AppProvider';
import { motion, AnimatePresence } from 'framer-motion';

const CrisisButton = () => {
  const { isCrisisMode, toggleCrisisMode } = useApp();

  return (
    <AnimatePresence>
      {!isCrisisMode && (
        <motion.button
          layoutId="crisis-orb"
          onClick={toggleCrisisMode}
          className="breathe-animation-button"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-soft-coral)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.4)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(224, 159, 159, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 30
          }}
        >
          {/* Icon (Doesn't share layoutId to avoid distortion, just fades) */}
          <motion.span 
            className="material-symbols-outlined" 
            style={{
              fontSize: '28px',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            self_improvement
          </motion.span>
          
          {/* Status Dot */}
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.8)',
            boxShadow: '0 0 6px rgba(255,255,255,0.6)'
          }}></span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default CrisisButton;

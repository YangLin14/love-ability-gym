import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppProvider';

// CUSTOM 8-3-8 BREATHING CYCLE
// Total cycle = 19 seconds
const BREATHING_CYCLE = [
  { key: 'inhale', label: 'Inhale...', method: 'Nose', duration: 8 },
  { key: 'hold',   label: 'Hold',      method: 'Still', duration: 3 },
  { key: 'exhale', label: 'Exhale...', method: 'Mouth', duration: 8 },
];

const CrisisOverlay = () => {
  const { isCrisisMode, toggleCrisisMode, t } = useApp();
  
  // MERGED STATE: Guarantees phase and timer never get out of sync
  const [breathState, setBreathState] = useState({
    phaseIndex: 0,
    secondsLeft: BREATHING_CYCLE[0].duration,
    cycleCount: 0
  });

  const intervalRef = useRef(null);

  // Reset state on open
  useEffect(() => {
    if (isCrisisMode) {
      setBreathState({
        phaseIndex: 0,
        secondsLeft: BREATHING_CYCLE[0].duration,
        cycleCount: 0
      });
    }
    return () => clearInterval(intervalRef.current);
  }, [isCrisisMode]);

  // Robust timer effect
  useEffect(() => {
    if (!isCrisisMode) return;

    intervalRef.current = setInterval(() => {
      setBreathState(current => {
        // If time remains, just tick down
        if (current.secondsLeft > 1) {
          return { ...current, secondsLeft: current.secondsLeft - 1 };
        }

        // Time is up: Move to next phase
        const nextPhaseIndex = (current.phaseIndex + 1) % BREATHING_CYCLE.length;
        const nextCycleCount = nextPhaseIndex === 0 ? current.cycleCount + 1 : current.cycleCount;
        
        return {
          phaseIndex: nextPhaseIndex,
          secondsLeft: BREATHING_CYCLE[nextPhaseIndex].duration,
          cycleCount: nextCycleCount
        };
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isCrisisMode]);

  if (!isCrisisMode) return null;

  const phase = BREATHING_CYCLE[breathState.phaseIndex];
  const totalCycles = 4;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(160deg, #ece4f4 0%, #e5ddf0 30%, #e8dfe8 60%, #efe7ef 100%)',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden',
      fontFamily: 'var(--font-body)'
    }}>
      {/* Top Bar */}
      <div style={{
        position: 'relative',
        zIndex: 20,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        paddingTop: 'max(20px, env(safe-area-inset-top))'
      }}>
        <button
          onClick={toggleCrisisMode}
          aria-label="Back"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            borderRadius: '50%',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#a78bbc',
            transition: 'background 0.2s'
          }}
        >
          <span className="material-symbols-outlined" style={{fontSize: '24px'}}>arrow_back</span>
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '50px',
          background: 'rgba(255,255,255,0.4)',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <span className="material-symbols-outlined" style={{
            fontSize: '16px',
            color: '#a78bbc',
            animation: 'crisis-pulse 2s ease-in-out infinite'
          }}>spa</span>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: '#7a6b9d'
          }}>Crisis Mode Active</span>
        </div>

        <button
          aria-label="Haptics"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            borderRadius: '50%',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#a78bbc',
            transition: 'background 0.2s'
          }}
        >
          <span className="material-symbols-outlined" style={{fontSize: '24px'}}>vibration</span>
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '-20px'
      }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '320px',
          height: '320px'
        }}>
          {/* Rings */}
          <div className="crisis-ring-1" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(167, 139, 188, 0.15)' }}></div>
          <div className="crisis-ring-2" style={{ position: 'absolute', inset: '16px', borderRadius: '50%', border: '1px solid rgba(167, 139, 188, 0.08)' }}></div>

          {/* Orb */}
          <div className="crisis-breathe-orb" style={{
            position: 'relative',
            zIndex: 10,
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(230, 220, 240, 0.9) 0%, rgba(238, 218, 240, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 0 60px -10px rgba(167, 139, 188, 0.3), inset 0 0 30px rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ position: 'absolute', inset: '10%', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', filter: 'blur(12px)' }}></div>
          </div>

          {/* Text Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 15
          }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '42px',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#6a5a8a',
              textShadow: '0 1px 4px rgba(0,0,0,0.05)',
              letterSpacing: '1px',
              margin: '0 0 8px 0',
              transition: 'all 0.5s ease'
            }}>
              {phase.label}
            </h1>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: 0.8}}>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2.5px', fontWeight: 600, color: '#a78bbc' }}>
                {phase.method}
              </span>
              <span style={{ fontSize: '13px', fontFamily: 'var(--font-display)', fontStyle: 'italic', color: '#a49abe' }}>
                {breathState.secondsLeft} seconds
              </span>
            </div>
          </div>
        </div>

        {/* Motivational Text */}
        <div className="crisis-text-pulse" style={{ marginTop: '48px', textAlign: 'center', padding: '0 32px', maxWidth: '400px' }}>
          <p style={{ fontSize: '18px', color: 'rgba(106, 90, 138, 0.7)', lineHeight: 1.6, margin: 0, fontWeight: 400 }}>
            Focus only on the circle.<br/>
            <span style={{ fontStyle: 'italic', color: '#8b9bc3' }}>Let your anxiety dissolve with each breath.</span>
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div style={{
        position: 'relative',
        zIndex: 20,
        width: '100%',
        padding: '24px 32px',
        paddingBottom: 'max(32px, env(safe-area-inset-bottom))',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        {/* Progress dots */}
        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px'}}>
          {Array.from({length: totalCycles}).map((_, i) => (
            <div key={i} style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: i <= breathState.cycleCount ? '#a78bbc' : 'rgba(106, 90, 138, 0.15)',
              transition: 'background 0.5s ease'
            }}></div>
          ))}
        </div>

        {/* Grounded button */}
        <button
          onClick={toggleCrisisMode}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px 32px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.4)',
            border: '1px solid rgba(255,255,255,0.4)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            cursor: 'pointer',
            width: '100%',
            maxWidth: '280px',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(6px)'
          }}
        >
          <span className="material-symbols-outlined" style={{fontSize: '22px', color: '#a78bbc'}}>check_circle</span>
          <span style={{ fontSize: '15px', fontWeight: 500, color: '#6a5a8a', letterSpacing: '0.3px' }}>
            {t('common.crisis_button') || "I'm feeling grounded"}
          </span>
        </button>
        <p style={{ fontSize: '11px', color: 'rgba(106, 90, 138, 0.4)', fontWeight: 300, margin: 0 }}>The Love Ability Gym</p>
      </div>

      <style>{`
        /* 8-3-8 TIMING (Total 19s)
           Inhale 8s: 0% -> 42% (8/19 ≈ 42.1%)
           Hold 3s:   42% -> 58% ((8+3)/19 ≈ 57.9%)
           Exhale 8s: 58% -> 100%
        */
        @keyframes crisis-breathe {
          0% { transform: scale(0.7); opacity: 0.6; }    /* Start Inhale */
          42% { transform: scale(1.35); opacity: 1; }    /* End Inhale (8s) */
          58% { transform: scale(1.35); opacity: 1; }    /* End Hold (11s) */
          100% { transform: scale(0.7); opacity: 0.6; }  /* End Exhale (19s) */
        }
        @keyframes crisis-ring-ping {
          0% { transform: scale(1); opacity: 0.18; }
          75%, 100% { transform: scale(1.15); opacity: 0; }
        }
        @keyframes crisis-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes crisis-text-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .crisis-breathe-orb {
          animation: crisis-breathe 19s infinite ease-in-out;
        }
        .crisis-ring-1 {
          animation: crisis-ring-ping 4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .crisis-ring-2 {
          animation: crisis-ring-ping 4s cubic-bezier(0, 0, 0.2, 1) infinite 1s;
        }
        .crisis-text-pulse {
          animation: crisis-text-pulse 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CrisisOverlay;
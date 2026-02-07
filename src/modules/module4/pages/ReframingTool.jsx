import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppProvider';
import StorageService from '../../../services/StorageService';

const ReframingTool = () => {
  const navigate = useNavigate();
  const { t, addXp } = useApp();
  const [step, setStep] = useState(1);
  const [weakness, setWeakness] = useState('');
  const [strength, setStrength] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    if (step === 2 && strength) {
      setIsFlipped(true);
      addXp(30);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <button onClick={() => navigate('/')}>←</button>
        <h2>{t('module4.reframe.title')}</h2>
      </header>

      {step === 1 && (
        <div className="fade-in">
           <h3>{t('module4.reframe.step1_title')}</h3>
           <p>{t('module4.reframe.step1_desc')}</p>
           <input 
             value={weakness}
             onChange={e => setWeakness(e.target.value)}
             placeholder="e.g., Stubborn, Boring..."
             style={inputStyle}
           />
           <button 
             className="primary-btn"
             onClick={() => setStep(2)}
             disabled={!weakness}
           >
             {t('common.next')}
           </button>
        </div>
      )}

      {step === 2 && (
        <div className="fade-in center-content">
           <div className={`flip-card ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
              <div className="flip-card-inner">
                 <div className="flip-card-front">
                    <h3>{t('module4.reframe.weakness_label')}</h3>
                    <div style={{fontSize: '32px', marginTop: '20px'}}>{weakness}</div>
                    <p style={{marginTop: '40px', color: '#666'}}>(Click to Reframe)</p>
                 </div>
                 <div className="flip-card-back">
                    <h3>{t('module4.reframe.strength_label')}</h3>
                    <div style={{fontSize: '32px', marginTop: '20px', color: 'var(--color-ink-black)'}}>{strength}</div>
                 </div>
              </div>
           </div>

           {!isFlipped ? (
             <div style={{marginTop: '30px', width: '100%'}}>
               <p>{t('module4.reframe.step2_desc')}</p>
               <input 
                 value={strength}
                 onChange={e => setStrength(e.target.value)}
                 placeholder={t('module4.reframe.strength_example_safe')}
                 style={inputStyle}
               />
               <p>{t('module4.reframe.template_prefix')} <strong>{weakness}</strong> {t('module4.reframe.template_middle')} <strong>{strength}</strong>.</p>
             </div>
           ) : (
             <button className="primary-btn" onClick={() => {
                StorageService.saveLog('module4', {
                  tool: 'Reframing Tool',
                  weakness: weakness,
                  strength: strength
                });
                navigate('/');
             }}>{t('common.done')}</button>
           )}
        </div>
      )}

      <style>{`
        .primary-btn { width: 100%; padding: 15px; background: var(--color-ink-black); color: white; border: none; border-radius: 50px; margin-top: 20px; cursor: pointer; font-size: 16px; }
        .fade-in { animation: fadeIn 0.5s ease; }
        .center-content { display: flex; flexDirection: column; alignItems: center; }
        
        .flip-card {
          background-color: transparent;
          width: 300px;
          height: 200px;
          perspective: 1000px;
          cursor: pointer;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s;
          transform-style: preserve-3d;
          box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
          border-radius: 12px;
        }
        .flip-card.flipped .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .flip-card-front {
          background-color: #333;
          color: white;
        }
        .flip-card-back {
          background-color: var(--color-sage-green);
          color: white;
          transform: rotateY(180deg);
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ccc', marginBottom: '15px', fontSize: '16px' };

export default ReframingTool;

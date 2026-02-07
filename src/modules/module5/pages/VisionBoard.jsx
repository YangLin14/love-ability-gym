import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppProvider';
import StorageService from '../../../services/StorageService';

const VisionBoard = () => {
  const navigate = useNavigate();
  const { t, addXp } = useApp();
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [myAction, setMyAction] = useState('');

  const handleFinish = () => {
    StorageService.saveLog('module5', {
      tool: 'Vision Board',
      goal: goal,
      action: myAction,
      completed: true
    });
    addXp(50);
    navigate('/');
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <button onClick={() => navigate('/')}>←</button>
        <h2>{t('module5.vision.title')}</h2>
      </header>

      {step === 1 && (
        <div className="fade-in">
           <h3>{t('module5.vision.step1_title')}</h3>
           <p>{t('module5.vision.step1_hint')}</p>
           <input 
             value={goal}
             onChange={e => setGoal(e.target.value)}
             placeholder="e.g., Be more patient with the kids"
             style={inputStyle}
           />
           <button className="primary-btn" onClick={() => setStep(2)} disabled={!goal}>
             {t('common.next')}
           </button>
        </div>
      )}

      {step === 2 && (
        <div className="fade-in">
           <h3>{t('module5.vision.step2_title')}</h3>
           <p>To influence <strong>"{goal}"</strong>...</p>
           <p>{t('module5.vision.step2_hint')}</p>
           <textarea 
             value={myAction}
             onChange={e => setMyAction(e.target.value)}
             placeholder="e.g., I will clear the table without being asked."
             style={textareaStyle}
           />
           <button className="primary-btn" onClick={() => setStep(3)} disabled={!myAction}>
             {t('module5.vision.start_mission')}
           </button>
        </div>
      )}

      {step === 3 && (
        <div className="fade-in center-content">
           <div className="mission-card">
              <h3>DAILY MISSION</h3>
              <p>To see: <strong>{goal}</strong></p>
              <p>I must first: <strong>{myAction}</strong></p>
           </div>
           
           <div style={{marginTop: '40px'}}>
              <p>Did you do it?</p>
              <button className="checkin-btn" onClick={handleFinish}>
                {t('module5.vision.checkin_btn')}
              </button>
              <p style={{marginTop: '20px', fontSize: '14px', color: '#666'}}>
                "{t('module5.vision.advice')}"
              </p>
           </div>
        </div>
      )}

      <style>{`
        .primary-btn { width: 100%; padding: 15px; background: var(--color-ink-black); color: white; border: none; border-radius: 50px; margin-top: 20px; cursor: pointer; font-size: 16px; }
        .checkin-btn { padding: 20px 40px; background: var(--color-sage-green); color: white; border: none; border-radius: 50px; cursor: pointer; font-size: 18px; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.2); transition: transform 0.2s; }
        .checkin-btn:active { transform: scale(0.95); }
        .mission-card { background: #fff3e0; padding: 30px; border-radius: 12px; border: 2px dashed #ff9800; text-align: center; }
        .fade-in { animation: fadeIn 0.5s ease; }
        .center-content { text-align: center; margin-top: 20px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ccc', marginBottom: '15px', fontSize: '16px' };
const textareaStyle = { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ccc', minHeight: '100px', fontSize: '16px', fontFamily: 'inherit' };

export default VisionBoard;

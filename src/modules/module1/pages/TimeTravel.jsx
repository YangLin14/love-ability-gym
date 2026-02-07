import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppProvider';
import StorageService from '../../../services/StorageService';

const TimeTravel = () => {
  const navigate = useNavigate();
  const { t, addXp } = useApp();
  const [step, setStep] = useState(1);
  const [age, setAge] = useState(5);

  const nextStep = () => setStep(s => s + 1);

  const handleFinish = () => {
    StorageService.saveLog('module1', {
      tool: 'Time Travel',
      age: age,
      completed: true
    });
    addXp(50);
    navigate('/');
  };

  return (
    <div className="page-container" style={{backgroundColor: step === 1 ? 'black' : 'var(--color-ink-black)', color: 'white'}}>
      <header className="page-header" style={{position: 'absolute', top: '20px', left: '20px', zIndex: 10}}>
        <button onClick={() => navigate('/')} style={{color: 'white'}}>←</button>
      </header>

      {step === 1 && (
        <div className="center-content fade-in">
          <div className="breathing-circle"></div>
          <h2 style={{marginTop: '40px'}}>{t('module1.time_travel.guide_step1')}</h2>
          <p style={{opacity: 0.7}}>Press to continue...</p>
          <div 
             onClick={nextStep}
             style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 5}}
          ></div>
        </div>
      )}

      {step === 2 && (
        <div className="center-content fade-in">
          <h2>{t('module1.time_travel.guide_step2')}</h2>
          <div style={{margin: '40px 0'}}>
             <span style={{fontSize: '48px', fontWeight: 'bold'}}>{age}</span> <span style={{fontSize: '24px'}}>years old</span>
          </div>
          <input 
            type="range" min="3" max="25" value={age} 
            onChange={e => setAge(e.target.value)}
            style={{width: '80%', accentColor: 'var(--color-sage-light)'}}
          />
          <button className="primary-btn" style={{borderColor: 'white', background: 'transparent'}} onClick={nextStep}>
            {t('common.next')}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="center-content fade-in">
          <h2>{t('module1.time_travel.guide_step3')}</h2>
          <div style={{width: '200px', height: '200px', borderRadius: '50%', border: '4px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '40px auto'}}>
             <div style={{width: '180px', height: '180px', borderRadius: '50%', backgroundColor: 'white', opacity: 0.1}}></div>
          </div>
          <button className="primary-btn" style={{backgroundColor: 'white', color: 'black'}} onClick={handleFinish}>
            {t('module1.time_travel.btn_im_safe')}
          </button>
        </div>
      )}

      <style>{`
        .page-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; z-index: 1000; }
        .center-content { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 20px; }
        .primary-btn { padding: 15px 40px; border: 2px solid white; border-radius: 50px; font-size: 18px; cursor: pointer; margin-top: 20px; }
        .breathing-circle { width: 150px; height: 150px; background-color: var(--color-sage-light); border-radius: 50%; opacity: 0.5; animation: breathe 8s infinite ease-in-out; }
        @keyframes breathe { 
          0%, 100% { transform: scale(1); opacity: 0.3; } 
          50% { transform: scale(1.5); opacity: 0.8; } 
        }
        .fade-in { animation: fadeIn 1s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default TimeTravel;

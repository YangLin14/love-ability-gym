import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppProvider';
import MoodSelector from '../../../components/MoodSelector';
import BodyMap from '../../module1/components/BodyMap';
import StorageService from '../../../services/StorageService';

const EmotionScan = () => {
  const navigate = useNavigate();
  const { t, addXp } = useApp();
  const [step, setStep] = useState(1);
  const [emotion, setEmotion] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [bodyPart, setBodyPart] = useState(null);

  const handleNext = () => setStep(s => s + 1);
  
  const handleSave = () => {
    StorageService.saveLog('module1', {
      type: 'emotion_scan',
      emotion: emotion?.label || emotion?.name,
      category: emotion?.category,
      intensity,
      bodyPart
    });
    addXp(30);
    navigate('/');
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <button onClick={() => navigate('/')}>←</button>
        <h2>{t('module1.emotion_scan.title')}</h2>
      </header>

      {step === 1 && (
        <div className="fade-in">
          <h3>{t('module1.emotion_scan.wheel_center')}</h3>
          <MoodSelector onSelect={(emo) => { setEmotion(emo); handleNext(); }} />
        </div>
      )}

      {step === 2 && (
        <div className="fade-in" style={{textAlign: 'center'}}>
          <h3>{t('module1.emotion_scan.intensity_title')}</h3>
          <div style={{fontSize: '48px', fontWeight: 'bold', color: emotion?.color, margin: '20px 0'}}>
            {intensity}
          </div>
          <input 
            type="range" min="1" max="10" value={intensity} 
            onChange={e => setIntensity(Number(e.target.value))}
            style={{width: '100%', marginBottom: '20px'}}
          />
          {intensity > 8 && (
            <div style={{backgroundColor: 'var(--color-crisis-red)', color: 'white', padding: '10px', borderRadius: '8px', marginBottom: '20px'}}>
              ⚠️ {t('module1.emotion_scan.alert_high_intensity')}
            </div>
          )}
          <button className="primary-btn" onClick={handleNext}>{t('common.next')}</button>
        </div>
      )}

      {step === 3 && (
        <div className="fade-in" style={{textAlign: 'center'}}>
           <h3>{t('module1.emotion_scan.body_map_title')}</h3>
           <BodyMap onSelect={setBodyPart} />
           <button className="primary-btn" onClick={handleSave} disabled={!bodyPart}>{t('module1.emotion_scan.save_btn')}</button>
        </div>
      )}

      <style>{`
        .primary-btn { width: 100%; padding: 15px; background: var(--color-ink-black); color: white; border: none; border-radius: 50px; margin-top: 20px; cursor: pointer; font-size: 16px; }
        .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default EmotionScan;

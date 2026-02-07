import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppProvider';

const ApologyBuilder = () => {
  const navigate = useNavigate();
  const { t, addXp } = useApp();
  const [step, setStep] = useState(1);
  const [action, setAction] = useState('');
  const [empathy, setEmpathy] = useState('');
  const [regret, setRegret] = useState('');
  const [blockerError, setBlockerError] = useState('');

  const handleNext = () => setStep(s => s + 1);

  const checkButBlocker = (text, setter) => {
    // Basic regex for Chinese "but", "because you", "if you" equivalents
    // "但是", "因為你", "如果你"
    const tabooPatterns = [
        { regex: /但是|but/i, msg: t('module2.apology.blocker_but') },
        { regex: /因為你|because you/i, msg: t('module2.apology.blocker_because') },
        { regex: /如果你|if you/i, msg: t('module2.apology.blocker_if') }
    ];

    let foundError = '';
    for (let p of tabooPatterns) {
        if (p.regex.test(text)) {
            foundError = p.msg;
            break;
        }
    }
    
    setter(text);
    setBlockerError(foundError);
  };

  const handleFinish = () => {
    addXp(80);
    navigate('/');
  };

  const empathyList = ["Hurt", "Disrespected", "Scared", "Ignored", "Small"];
  const regretList = ["Guilty", "Sorry", "Regretful", "Sad"];

  return (
    <div className="page-container">
      <header className="page-header">
        <button onClick={() => navigate('/')}>←</button>
        <h2>{t('module2.apology.title')}</h2>
      </header>

      {/* Step 1: My Action */}
      {step === 1 && (
        <div className="fade-in">
          <h3>{t('module2.apology.step1_title')}</h3>
          <p>{t('module2.apology.step1_q')}</p>
          <textarea 
            value={action}
            onChange={e => checkButBlocker(e.target.value, setAction)}
            placeholder="e.g., I yelled at you."
            className="input-area"
          />
          {blockerError && (
             <div className="blocker-alert">
                🛑 {blockerError}
             </div>
          )}
          <button className="primary-btn" onClick={handleNext} disabled={!action || blockerError}>{t('common.next')}</button>
        </div>
      )}

      {/* Step 2: Empathy */}
      {step === 2 && (
        <div className="fade-in">
          <h3>{t('module2.apology.step2_title')}</h3>
          <p>{t('module2.apology.step2_q')}</p>
          <div className="tag-cloud">
             {empathyList.map(item => (
                 <button key={item} onClick={() => { setEmpathy(item); handleNext(); }} className="tag-btn">
                     {item}
                 </button>
             ))}
          </div>
        </div>
      )}

      {/* Step 3: Regret */}
      {step === 3 && (
        <div className="fade-in">
          <h3>{t('module2.apology.step3_title')}</h3>
          <p>{t('module2.apology.step3_q')}</p>
          <div className="tag-cloud">
             {regretList.map(item => (
                 <button key={item} onClick={() => { setRegret(item); handleNext(); }} className="tag-btn">
                     {item}
                 </button>
             ))}
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="fade-in">
           <h3>{t('module2.apology.review_title')}</h3>
           <div className="card">
              <p className="final-text">
                 "I know I {action}, and that probably made you feel {empathy}. I feel {regret} about it because that is not how I want to treat you."
              </p>
           </div>
           <button className="primary-btn" onClick={handleFinish}>{t('common.done')}</button>
        </div>
      )}

      <style>{`
        .input-area { width: 100%; height: 120px; padding: 15px; border-radius: 12px; border: 1px solid #ccc; fontSize: 16px; margin-bottom: 20px; font-family: inherit; }
        .blocker-alert { background: #ffebee; color: #c62828; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-weight: bold; border-left: 5px solid #c62828; }
        .primary-btn { width: 100%; padding: 15px; background: var(--color-ink-black); color: white; border: none; border-radius: 50px; cursor: pointer; font-size: 16px; transition: background 0.3s; }
        .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .tag-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
        .tag-btn { padding: 10px 20px; border-radius: 20px; border: 1px solid #ccc; background: white; cursor: pointer; font-size: 16px; }
        .tag-btn:hover { background: var(--color-sage-light); border-color: var(--color-sage-green); }
        .card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 30px; }
        .final-text { font-size: 18px; font-style: italic; color: var(--color-text-primary); line-height: 1.6; }
        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default ApologyBuilder;

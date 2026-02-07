import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppProvider';
import MoodSelector from '../../../components/MoodSelector';
import StorageService from '../../../services/StorageService';

const DraftBuilder = () => {
  const navigate = useNavigate();
  const { t, addXp } = useApp();
  const [step, setStep] = useState(1);
  const [fact, setFact] = useState('');
  const [emotion, setEmotion] = useState(null);
  const [need, setNeed] = useState('');
  const [request, setRequest] = useState('');
  const [showError, setShowError] = useState(false);
  const [toast, setToast] = useState(null);

  const handleNext = () => setStep(s => s + 1);

  const checkFact = () => {
    // Basic AI check simulation (keyword blocking)
    const badWords = ['always', 'never', 'lazy', 'stupid', 'hate', 'bad'];
    const hasBadWord = badWords.some(word => fact.toLowerCase().includes(word));
    
    if (hasBadWord) {
      setShowError(true);
    } else {
      setShowError(false);
      handleNext();
    }
  };

  const getFinalText = () => {
    return `"When I see ${fact}, I feel ${emotion?.label}, because I really need ${need}. Could we agree to ${request}?"`;
  };

  const handleCopy = async () => {
    const text = getFinalText();
    try {
      await navigator.clipboard.writeText(text);
      setToast({ type: 'success', msg: t('common.copied_to_clipboard') || 'Copied!' });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', msg: 'Failed to copy.' });
    }
  };

  const handleFinish = () => {
    const text = getFinalText();
    StorageService.saveLog('module2', {
      type: 'draft',
      fact,
      emotion: emotion?.label,
      need,
      request,
      finalText: text
    });
    
    addXp(60);
    navigate('/');
  };

  const needsList = ["Support", "Rest", "Fairness", "Order", "Affection", "Understood", "Safety"];

  return (
    <div className="page-container">
      <header className="page-header">
        <button onClick={() => navigate('/')}>←</button>
        <h2>{t('module2.draft_builder.title')}</h2>
      </header>

      {/* Step 1: Fact Check */}
      {step === 1 && (
        <div className="fade-in">
          <h3>{t('module2.draft_builder.step1_title')}</h3>
          <p>{t('module2.draft_builder.step1_desc')}</p>
          <textarea 
            value={fact}
            onChange={e => setFact(e.target.value)}
            placeholder="e.g., The dishes are in the sink."
            className="input-area"
          />
          {showError && (
             <div className="error-box">
                ⚠️ {t('module2.draft_builder.fact_error')}
             </div>
          )}
          <button className="primary-btn" onClick={checkFact} disabled={!fact}>{t('common.next')}</button>
        </div>
      )}

      {/* Step 2: Emotion Tag */}
      {step === 2 && (
        <div className="fade-in">
          <h3>{t('module2.draft_builder.step2_title')}</h3>
          <div style={{marginBottom: '20px'}}>
             <MoodSelector onSelect={(e) => { setEmotion(e); handleNext(); }} />
          </div>
        </div>
      )}

      {/* Step 3: Deep Need */}
      {step === 3 && (
        <div className="fade-in">
          <h3>{t('module2.draft_builder.step3_title')}</h3>
          <p>"{emotion?.label}" because I need...</p>
          <div className="tag-cloud">
             {needsList.map(n => (
               <button key={n} onClick={() => { setNeed(n); handleNext(); }} className="tag-btn">
                 {n}
               </button>
             ))}
          </div>
        </div>
      )}

      {/* Step 4: SMART Request */}
      {step === 4 && (
        <div className="fade-in">
          <h3>{t('module2.draft_builder.step4_title')}</h3>
          <p>{t('module2.draft_builder.step4_desc')}</p>
          <textarea 
            value={request}
            onChange={e => setRequest(e.target.value)}
            placeholder="e.g., clean them within 30 mins after dinner."
            className="input-area"
          />
          <button className="primary-btn" onClick={handleNext} disabled={!request}>{t('module2.draft_builder.generate_btn')}</button>
        </div>
      )}

      {/* Final Preview */}
      {step === 5 && (
        <div className="fade-in">
           <h3>{t('module2.draft_builder.preview_title')}</h3>
           <div className="card">
              <p>
                 <strong>Context:</strong> {fact}<br/>
                 <strong>I feel:</strong> {emotion?.label}<br/>
                 <strong>Because I need:</strong> {need}<br/>
                 <strong>I request:</strong> {request}
              </p>
              <hr/>
              <p className="final-text">
                 {getFinalText()}
              </p>
           </div>
           <div className="button-group">
             <button className="secondary-btn" onClick={handleCopy}>
               📋 {t('common.copy') || 'Copy'}
             </button>
             <button className="primary-btn" onClick={handleFinish}>{t('common.done')}</button>
           </div>
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.msg}
        </div>
      )}

      <style>{`
        .input-area { width: 100%; height: 120px; padding: 15px; border-radius: 12px; border: 1px solid #ccc; fontSize: 16px; margin-bottom: 20px; font-family: inherit; }
        .primary-btn { width: 100%; padding: 15px; background: var(--color-ink-black); color: white; border: none; border-radius: 50px; cursor: pointer; font-size: 16px; transition: background 0.3s; }
        .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .secondary-btn { width: 100%; padding: 15px; background: white; color: var(--color-ink-black); border: 2px solid var(--color-ink-black); border-radius: 50px; cursor: pointer; font-size: 16px; transition: background 0.3s; }
        .button-group { display: flex; gap: 15px; }
        .error-box { background: #ffebee; color: #c62828; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-weight: bold; }
        .tag-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
        .tag-btn { padding: 10px 20px; border-radius: 20px; border: 1px solid #ccc; background: white; cursor: pointer; font-size: 16px; }
        .tag-btn:hover { background: var(--color-sage-light); border-color: var(--color-sage-green); }
        .card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 30px; }
        .final-text { font-size: 18px; font-style: italic; color: var(--color-text-primary); margin-top: 15px; line-height: 1.5; }
        .fade-in { animation: fadeIn 0.5s ease; }
        .toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); padding: 10px 20px; border-radius: 30px; color: white; font-weight: bold; animation: popUp 0.3s ease; z-index: 1000; }
        .toast.success { background: var(--color-sage-dark, #2e7d32); }
        .toast.error { background: #c62828; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default DraftBuilder;

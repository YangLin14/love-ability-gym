import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppProvider';
import StorageService from '../../../services/StorageService';

const AttributionShift = () => {
  const navigate = useNavigate();
  const { t, addXp } = useApp();
  const [step, setStep] = useState(1);
  const [event, setEvent] = useState('');
  const [ownership, setOwnership] = useState('');
  const [actionPlan, setActionPlan] = useState('');

  const nextStep = () => setStep(s => s + 1);

  const handleFinish = () => {
    StorageService.saveLog('module1', {
      tool: 'Attribution Shift',
      event,
      ownership,
      actionPlan
    });
    addXp(50);
    navigate('/');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="fade-in">
            <h3>{t('module1.attribution.step1_title')}</h3>
            <p className="question">{t('module1.attribution.step1_q')}</p>
            <textarea 
              value={event}
              onChange={e => setEvent(e.target.value)}
              placeholder="e.g., He didn't text back."
              style={textareaStyle}
            />
            <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
               <button className="option-btn" onClick={nextStep}>{t('module1.attribution.step1_opt_me')}</button>
               <button className="option-btn" onClick={nextStep}>{t('module1.attribution.step1_opt_them')}</button>
               <button className="option-btn" onClick={nextStep}>{t('module1.attribution.step1_opt_both')}</button>
            </div>
            {event && <p style={{marginTop: '20px', fontStyle: 'italic', color: 'var(--color-sage-green)'}}>{t('module1.attribution.logic_msg')}</p>}
          </div>
        );
      case 2:
        return (
          <div className="fade-in">
            <h3>{t('module1.attribution.step2_title')}</h3>
            <p className="question">{t('module1.attribution.step2_q')}</p>
            <textarea 
              value={ownership}
              onChange={e => setOwnership(e.target.value)}
              placeholder={t('module1.attribution.step2_placeholder')}
              style={textareaStyle}
            />
            <button className="primary-btn" onClick={nextStep} disabled={!ownership}>{t('common.next')}</button>
          </div>
        );
      case 3:
        return (
          <div className="fade-in">
            <h3>{t('module1.attribution.step3_title')}</h3>
            <p className="question">{t('module1.attribution.step3_q')}</p>
            <textarea 
              value={actionPlan}
              onChange={e => setActionPlan(e.target.value)}
              placeholder={t('module1.attribution.step3_placeholder')}
              style={textareaStyle}
            />
            <button className="primary-btn" onClick={nextStep} disabled={!actionPlan}>{t('common.next')}</button>
          </div>
        );
      case 4:
        return (
          <div className="fade-in" style={{textAlign: 'center'}}>
            <h3>{t('module1.attribution.card_title')}</h3>
            <div className="card-display">
              <p><strong>Event:</strong> {event}</p>
              <p><strong>My Part:</strong> {ownership}</p>
              <p><strong>Action:</strong> {actionPlan}</p>
              <br/>
              <p style={{fontStyle: 'italic'}}>"{t('module1.attribution.card_content')}"</p>
            </div>
            <button className="primary-btn" onClick={handleFinish}>{t('module1.attribution.save_btn')}</button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <button onClick={() => navigate('/')}>←</button>
        <h2>{t('module1.attribution.title')}</h2>
      </header>
      {renderStep()}
      <style>{`
        .question { font-size: 18px; font-weight: bold; margin-bottom: 15px; }
        .option-btn { flex: 1; padding: 15px; background: white; border: 1px solid var(--color-border); border-radius: 8px; cursor: pointer; }
        .card-display { background: var(--color-sage-light); padding: 20px; border-radius: 12px; text-align: left; margin-top: 20px; }
      `}</style>
    </div>
  );
};

const textareaStyle = {
  width: '100%', height: '100px', padding: '15px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px'
};

export default AttributionShift;

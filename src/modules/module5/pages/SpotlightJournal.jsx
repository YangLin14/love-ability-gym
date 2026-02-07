import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppProvider';
import StorageService from '../../../services/StorageService';

const SpotlightJournal = () => {
  const navigate = useNavigate();
  const { t, addXp } = useApp();
  const [step, setStep] = useState(1);
  const [highlight, setHighlight] = useState('');
  const [attribution, setAttribution] = useState(''); // 'internal' | 'external'
  const [insight, setInsight] = useState('');

  const handleSave = () => {
    StorageService.saveLog('module5', {
      type: 'journal',
      highlight,
      attribution,
      timestamp: new Date().toISOString()
    });
    addXp(40);
    navigate('/');
  };

  const getInsight = (type) => {
    setAttribution(type);
    setInsight(t(`module5.journal.insights.${type}_good`)); // simplified for MVP - assuming 'good' action
    setStep(3);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <button onClick={() => navigate('/')}>←</button>
        <h2>{t('module5.journal.title')}</h2>
      </header>

      {step === 1 && (
        <div className="fade-in">
           <h3>{t('module5.journal.step1_title')}</h3>
           <p>{t('module5.journal.step1_prompt')}</p>
           <textarea 
             value={highlight}
             onChange={e => setHighlight(e.target.value)}
             placeholder={t('module5.journal.placeholder')}
             style={textareaStyle}
           />
           <button 
             className="primary-btn" 
             onClick={() => setStep(2)}
             disabled={!highlight}
           >
             {t('common.next')}
           </button>
        </div>
      )}

      {step === 2 && (
        <div className="fade-in">
           <h3>{t('module5.journal.step2_title')}</h3>
           <p>"{highlight}"</p>
           <h4>{t('module5.journal.why_q')}</h4>
           
           <button className="option-btn" onClick={() => getInsight('internal')}>
             {t('module5.journal.internal_good')}
           </button>
           <button className="option-btn" onClick={() => getInsight('external')}>
             {t('module5.journal.external_good')}
           </button>
        </div>
      )}

      {step === 3 && (
        <div className="fade-in">
           <h3>{t('module5.journal.insight_title')}</h3>
           <div className="insight-card">
              {insight}
           </div>
           
           <div style={{marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px'}}>
             <h4>{t('module5.journal.action_title')}</h4>
             <p>{t('module5.journal.action_desc').replace('[action]', highlight)}</p>
             <button className="primary-btn" onClick={handleSave}>
               {t('module5.journal.send_msg')}
             </button>
           </div>
        </div>
      )}

      <style>{`
        .textareaStyle { width: 100%; padding: 15px; border-radius: 12px; border: 1px solid #ccc; min-height: 120px; font-size: 16px; font-family: inherit; margin-bottom: 20px; }
        .primary-btn { width: 100%; padding: 15px; background: var(--color-ink-black); color: white; border: none; border-radius: 50px; cursor: pointer; font-size: 16px; }
        .option-btn { width: 100%; padding: 20px; margin-bottom: 10px; background: white; border: 1px solid #ccc; border-radius: 12px; cursor: pointer; text-align: left; font-size: 16px; transition: all 0.2s; }
        .option-btn:hover { background: var(--color-sage-light); border-color: var(--color-sage-green); }
        .insight-card { background: var(--color-sage-light); padding: 20px; border-radius: 12px; border-left: 4px solid var(--color-sage-green); font-size: 18px; }
        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

const textareaStyle = { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ccc', minHeight: '120px', fontSize: '16px', fontFamily: 'inherit', marginBottom: '20px' };

export default SpotlightJournal;

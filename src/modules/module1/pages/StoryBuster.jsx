import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppProvider';
import StorageService from '../../../services/StorageService';

const StoryBuster = () => {
  const navigate = useNavigate();
  const { t, addXp } = useApp();
  const [phase, setPhase] = useState('input'); // input, judge, rewrite, result
  const [thought, setThought] = useState('');
  const [fact, setFact] = useState('');
  const [showError, setShowError] = useState(false);

  // Phase 1: Input
  const handleInputSubmit = () => {
    if (thought.trim()) setPhase('judge');
  };

  // Phase 2: Judge
  const handleJudge = (isFact) => {
    // Logic: Most user inputs in this context are "Stories" or mix.
    // The "Camera Test" is to show them it's likely a story.
    // If they say it's a Fact (isFact=true), we challenge them.
    if (isFact) {
      setShowError(true);
      // Double tap vibration pattern could go here
    } else {
      // Correctly identified as story
      // Heavy impact vibration
      addXp(10);
      setPhase('rewrite');
    }
  };

  // Phase 3: Rewrite
  const handleRewriteSubmit = () => {
    if (fact.trim()) {
      addXp(30);
      setPhase('result');
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <button onClick={() => navigate('/')}>←</button>
        <h2>{t('module1.story_buster.title')}</h2>
      </header>
      
      {phase === 'input' && (
        <div className="fade-in">
          <h3>Input a painful thought</h3>
          <textarea 
            value={thought} 
            onChange={e => setThought(e.target.value)}
            placeholder="e.g., He doesn't love me anymore..."
            style={textareaStyle}
          />
          <button className="primary-btn" onClick={handleInputSubmit} disabled={!thought}>
            {t('common.next')}
          </button>
        </div>
      )}

      {phase === 'judge' && (
        <div className="fade-in" style={{textAlign: 'center'}}>
          <div className="card">
            <h3>"{thought}"</h3>
          </div>
          
          <div style={{margin: '30px 0'}}>
            <p style={{fontSize: '20px', fontWeight: 'bold'}}>{t('module1.story_buster.cameraman')}</p>
            <p>{t('module1.story_buster.camera_prompt')}</p>
          </div>

          {!showError ? (
            <div style={{display: 'flex', gap: '20px'}}>
              <button className="action-btn deny" onClick={() => handleJudge(false)}>
                {t('module1.story_buster.swipe_left')}
              </button>
              <button className="action-btn confirm" onClick={() => handleJudge(true)}>
                {t('module1.story_buster.swipe_right')}
              </button>
            </div>
          ) : (
             <div className="error-box fade-in">
               <p>{t('module1.story_buster.error_msg')}</p>
               <button className="primary-btn" onClick={() => setShowError(false)}>{t('common.back')}</button>
             </div>
          )}
        </div>
      )}

      {phase === 'rewrite' && (
        <div className="fade-in">
          <h3>{t('module1.story_buster.rewrite_prompt')}</h3>
          <div style={{opacity: 0.6, marginBottom: '20px'}}>"{thought}"</div>
          <textarea 
            value={fact} 
            onChange={e => setFact(e.target.value)}
            placeholder="e.g., He came home at 11pm."
            style={textareaStyle}
          />
          <button className="primary-btn" onClick={handleRewriteSubmit} disabled={!fact}>
            {t('common.done')}
          </button>
        </div>
      )}

      {phase === 'result' && (
        <div className="fade-in" style={{textAlign: 'center'}}>
          <h3>Fact Stored!</h3>
          <div className="card" style={{borderColor: 'var(--color-sage-green)'}}>
            <p><strong>Fact:</strong> {fact}</p>
          </div>
          <br/>
          <p>You separated the story from the fact. Great job!</p>
          <button className="primary-btn" onClick={() => {
            StorageService.saveLog('module1', {
              tool: 'Story Buster',
              original_thought: thought,
              fact: fact
            });
            navigate('/');
          }}>Complete</button>
        </div>
      )}

      <style>{`
        .primary-btn { width: 100%; padding: 15px; background: var(--color-ink-black); color: white; border: none; border-radius: 50px; margin-top: 20px; cursor: pointer; font-size: 16px; }
        .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .card { background: white; padding: 40px 20px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 2px solid #eee; margin-top: 20px; }
        .action-btn { flex: 1; padding: 20px; border-radius: 12px; border: none; color: white; font-weight: bold; cursor: pointer; font-size: 16px; }
        .deny { background-color: var(--color-crisis-red); }
        .confirm { background-color: var(--color-sage-green); }
        .error-box { background: #ffebee; padding: 20px; border-radius: 12px; border: 1px solid red; color: #c62828; }
        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

const textareaStyle = {
    width: '100%', height: '120px', padding: '15px', borderRadius: '12px', border: '1px solid #ccc', fontSize: '18px', fontFamily: 'inherit'
};

export default StoryBuster;

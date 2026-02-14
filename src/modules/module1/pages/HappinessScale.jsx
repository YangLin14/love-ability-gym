import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppProvider';
import BackButton from '../../../components/BackButton';

const HappinessScale = () => {
  const navigate = useNavigate();
  const { t, addXp } = useApp();
  const [step, setStep] = useState(1);
  const [issue, setIssue] = useState('');
  const [partnerName, setPartnerName] = useState('Partner');
  const [balance, setBalance] = useState(0); // -5 (Left/Right) to +5 (Right/Happy)

  const nextStep = () => setStep(s => s + 1);

  const handleDragEnd = () => {
     // Simulating drag end -> set balance to max happy
     setBalance(5);
     setTimeout(() => setStep(3), 1000);
  };

  const handleFinish = () => {
    addXp(50);
    navigate('/');
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <BackButton />
        <h2>{t('module1.happiness_scale.title')}</h2>
      </header>

      {step === 1 && (
        <div className="fade-in">
          <h3>What are you arguing about?</h3>
           <input 
              type="text" 
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder="Partner's Name"
              style={{...inputStyle, marginBottom: '10px'}}
            />
           <textarea 
            value={issue} 
            onChange={e => setIssue(e.target.value)}
            placeholder="e.g., Leaving socks on the floor..."
            style={textareaStyle}
          />
          <div style={{marginTop: '20px'}}>
             <p>{t('module1.happiness_scale.question_principle')}</p>
             <button className="option-btn" onClick={() => alert("If it's a principle issue, please use the Anger Decoder.")}>Yes</button>
             <button className="option-btn primary" onClick={nextStep}>No, it's a habit</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="fade-in" style={{textAlign: 'center'}}>
          <p>{t('module1.happiness_scale.prompt_habit')}</p>
          <div className="scale-container">
             <div className="pan left-pan" style={{transform: `translateY(${balance * -10}px)`}}>
                <div className="label">{t('module1.happiness_scale.left_pan')}</div>
                <div className="icon">🪨</div>
             </div>
             <div className="fulcrum">▲</div>
             <div className="pan right-pan" style={{transform: `translateY(${balance * 10}px)`}}>
                <div className="label">{t('module1.happiness_scale.right_pan')}</div>
                <div className="icon">🪶</div>
                {balance > 0 && <div className="coin">🪙</div>}
             </div>
          </div>
          
          <div className="coin-source" onClick={handleDragEnd} style={{cursor: 'pointer', marginTop: '40px', padding: '20px', border: '2px dashed #ccc', borderRadius: '12px'}}>
             <span style={{fontSize: '32px'}}>🪙</span>
             <p>{t('module1.happiness_scale.drag_hint')}</p> 
             <small>(Click to place coin)</small>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="fade-in" style={{textAlign: 'center'}}>
           <div style={{border: '8px double var(--color-sage-green)', padding: '30px', margin: '20px 0', borderRadius: '12px'}}>
              <h3>Permission Slip</h3>
              <p style={{fontSize: '20px', lineHeight: '1.6'}}>
                I allow <strong>{partnerName}</strong> to <strong>{issue}</strong>.
                <br/>
                I choose today's happiness.
              </p>
              <div style={{fontSize: '64px', color: 'var(--color-crisis-red)', transform: 'rotate(-15deg)', marginTop: '20px', fontWeight: 'bold'}}>
                 HAPPY
              </div>
           </div>
           <button className="primary-btn" onClick={handleFinish}>{t('common.done')}</button>
        </div>
      )}

      <style>{`
        .primary-btn { width: 100%; padding: 15px; background: var(--color-ink-black); color: white; border: none; border-radius: 50px; margin-top: 20px; cursor: pointer; font-size: 16px; }
        .option-btn { padding: 10px 20px; margin: 5px; border-radius: 8px; border: 1px solid #ccc; background: white; cursor: pointer; }
        .option-btn.primary { background: var(--color-sage-green); color: white; border: none; }
        .scale-container { display: flex; justify-content: space-between; align-items: flex-end; height: 200px; padding: 0 40px; border-bottom: 4px solid #333; position: relative; margin-top: 40px; }
        .pan { width: 100px; height: 100px; border-bottom: 4px solid #333; border-left: 2px solid #333; border-right: 2px solid #333; border-radius: 0 0 50px 50px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; transition: transform 0.5s ease; }
        .fulcrum { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); font-size: 40px; }
        .coin { font-size: 32px; animation: drop 0.5s ease; }
        .coin-source:active { transform: scale(0.95); }
        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

const textareaStyle = {
    width: '100%', height: '80px', padding: '15px', borderRadius: '12px', border: '1px solid #ccc', fontSize: '18px', fontFamily: 'inherit'
};
const inputStyle = {
    width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px'
};

export default HappinessScale;

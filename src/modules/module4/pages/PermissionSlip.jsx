import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppProvider';

const PermissionSlip = () => {
  const navigate = useNavigate();
  const { t, addXp } = useApp();
  const [step, setStep] = useState(1);
  const [issue, setIssue] = useState('');
  const [partnerName, setPartnerName] = useState('Partner');
  const [approved, setApproved] = useState(false);

  // Long press logic
  const [pressing, setPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const pressRef = React.useRef(null);

  const startPress = () => {
    setPressing(true);
    let p = 0;
    pressRef.current = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(pressRef.current);
        setApproved(true);
        addXp(40);
      }
    }, 20); // 100% in ~1s
  };

  const endPress = () => {
    if (progress < 100) {
      clearInterval(pressRef.current);
      setPressing(false);
      setProgress(0);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <button onClick={() => navigate('/')}>←</button>
        <h2>{t('module4.permission.title')}</h2>
      </header>

      {!approved ? (
        <div className="fade-in">
          {step === 1 && (
            <div>
              <h3>{t('module4.permission.step1_title')}</h3>
              <p>{t('module4.permission.step1_desc')}</p>
              <input 
                value={partnerName}
                onChange={e => setPartnerName(e.target.value)}
                placeholder="Partner Name"
                style={inputStyle}
              />
              <textarea 
                value={issue}
                onChange={e => setIssue(e.target.value)}
                placeholder={t('module4.permission.placeholder_issue')}
                style={textareaStyle}
              />
              <button 
                className="primary-btn" 
                onClick={() => setStep(2)}
                disabled={!issue}
              >
                {t('common.next')}
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
               <h3>{t('module4.permission.step2_title')}</h3>
               <p>{t('module4.permission.step2_q')}</p>
               <div className="alert-box">
                 {t('module4.permission.principle_alert')}
               </div>
               <div style={{marginTop: '20px'}}>
                 <button className="secondary-btn" onClick={() => navigate('/')}>Yes, it's serious</button>
                 <button className="primary-btn" onClick={() => setStep(3)}>No, it's just annoying</button>
               </div>
            </div>
          )}

          {step === 3 && (
            <div style={{textAlign: 'center'}}>
               <div className="permission-card">
                  <h4>{t('module4.permission.card_title')}</h4>
                  <p>
                    {t('module4.permission.allow_prefix')} <strong>{partnerName}</strong> {t('module4.permission.allow_middle')} <br/>
                    <span style={{textDecoration: 'underline', fontWeight: 'bold'}}>{issue}</span>
                    <br/>{t('module4.permission.allow_suffix')}
                  </p>
                  <small>{t('module4.permission.mantra')}</small>
               </div>

               <div style={{marginTop: '40px', position: 'relative'}}>
                  <p>{t('module4.permission.long_press')}</p>
                  <button 
                    className="stamp-btn"
                    onMouseDown={startPress}
                    onMouseUp={endPress}
                    onTouchStart={startPress}
                    onTouchEnd={endPress}
                    style={{
                      transform: `scale(${1 + progress/200})`,
                      background: `conic-gradient(var(--color-sage-green) ${progress}%, #ccc ${progress}%)`
                    }}
                  >
                    🆗
                  </button>
               </div>
            </div>
          )}
        </div>
      ) : (
        <div className="fade-in center-content">
           <div className="approved-stamp">{t('module4.permission.approved')}</div>
           <h3>Permission Granted</h3>
           <p>You chose peace. (+40 XP)</p>
           <button className="primary-btn" onClick={() => navigate('/')}>{t('common.done')}</button>
        </div>
      )}

      <style>{`
        .inputStyle { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ccc; margin-bottom: 10px; font-size: 16px; }
        .textareaStyle { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ccc; min-height: 80px; font-size: 16px; font-family: inherit; }
        .primary-btn { width: 100%; padding: 15px; background: var(--color-ink-black); color: white; border: none; border-radius: 50px; margin-top: 20px; cursor: pointer; font-size: 16px; }
        .secondary-btn { width: 100%; padding: 15px; background: white; color: var(--color-ink-black); border: 2px solid var(--color-ink-black); border-radius: 50px; margin-top: 20px; cursor: pointer; font-size: 16px; margin-right: 10px; }
        .permission-card { border: 4px double var(--color-sage-green); padding: 30px; background: #fffdf0; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .stamp-btn { width: 100px; height: 100px; border-radius: 50%; border: none; font-size: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center; margin: 0 auto; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
        .approved-stamp { font-size: 48px; color: var(--color-crisis-red); border: 5px solid var(--color-crisis-red); padding: 10px 20px; transform: rotate(-15deg); display: inline-block; margin-bottom: 30px; font-weight: bold; opacity: 0.8; }
        .alert-box { background: #ffebee; color: #c62828; padding: 15px; border-radius: 8px; margin-top: 20px; }
        .fade-in { animation: fadeIn 0.5s ease; }
        .center-content { text-align: center; margin-top: 50px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ccc', marginBottom: '15px', fontSize: '16px' };
const textareaStyle = { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ccc', minHeight: '100px', fontSize: '16px', fontFamily: 'inherit' };

export default PermissionSlip;

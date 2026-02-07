import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppProvider';
import StorageService from '../../../services/StorageService';

const AngerDecoder = () => {
  const navigate = useNavigate();
  const { addXp, t } = useApp();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    scenario: '',
    surfaceEmotion: '',
    deepFear: '',
    powerlessness: null 
  });

  const surfaceEmotions = ['Anger', 'Apathy', 'Sarcasm', 'Despair']; // These should ideally map to translation keys
  const deepFears = ['Connection', 'Control', 'Being Ignored', 'Order']; // These too

  const nextStep = () => setStep(prev => prev + 1);

  const containerStyle = {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'var(--font-sans, sans-serif)'
  };

  const headerStyle = {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center'
  };

  const backButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    marginRight: '10px'
  };

  const stepContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  };

  const textareaStyle = {
    width: '100%',
    height: '100px',
    padding: '15px',
    fontSize: '16px',
    borderRadius: '12px',
    border: '1px solid #ddd',
    marginBottom: '20px',
    fontFamily: 'inherit'
  };

  const buttonStyle = {
    backgroundColor: '#333',
    color: 'white',
    padding: '15px',
    borderRadius: '25px',
    border: 'none',
    fontSize: '16px',
    width: '100%',
    cursor: 'pointer',
    marginTop: '20px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px'
  };

  const optionButtonStyle = (isSelected) => ({
    padding: '15px',
    borderRadius: '12px',
    border: '1px solid #ddd',
    backgroundColor: isSelected ? '#e0f2f1' : 'white', // Sage green tint
    color: isSelected ? '#00695c' : 'black',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.2s'
  });

  const cardStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    marginBottom: '20px',
    lineHeight: '1.6'
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div style={stepContentStyle}>
            <h3>{t('module3.anger_decoder.scenario_input')}</h3>
            <textarea
              value={data.scenario}
              onChange={(e) => setData({ ...data, scenario: e.target.value })}
              placeholder={t('module3.anger_decoder.scenario_placeholder')}
              style={textareaStyle}
            />
            {data.scenario && (
              <>
                <h4>{t('module3.anger_decoder.step1_title')}</h4>
                <p>{t('module3.anger_decoder.step1_q')}</p>
                 <div style={gridStyle}>
                  {surfaceEmotions.map((emotion, index) => (
                    <button
                      key={emotion}
                      onClick={() => setData({ ...data, surfaceEmotion: index })} // Using index to map to translation array if needed, or just emotion string. 
                      // Actually translations use array for options? No, options are hardcoded in translation file under step1_opts?
                      // Let's check translation structure again. 
                      // step1_opts: ["Anger", "Apathy", "Sarcasm", "Despair"]
                      // So I can use the index to get the localized string.
                      style={optionButtonStyle(data.surfaceEmotion === index)}
                    >
                      {t(`module3.anger_decoder.step1_opts.${index}`, { defaultValue: emotion })}
                    </button>
                  ))}
                 </div>
              </>
            )}
             <button 
                onClick={nextStep} 
                style={buttonStyle} 
                disabled={!data.scenario || data.surfaceEmotion === ''}
             >
                {t('common.next')}
             </button>
          </div>
        );

      case 2:
        return (
          <div style={stepContentStyle}>
            <h3>{t('module3.anger_decoder.step2_title')}</h3>
             <p>{t('module3.anger_decoder.step2_q')}</p>
             <div style={gridStyle}>
               {deepFears.map((fear, index) => (
                 <button
                   key={fear}
                   onClick={() => setData({ ...data, deepFear: index })}
                   style={optionButtonStyle(data.deepFear === index)}
                 >
                   {t(`module3.anger_decoder.step2_opts.${index}`, { defaultValue: fear })}
                 </button>
               ))}
             </div>
             <button onClick={nextStep} style={buttonStyle} disabled={data.deepFear === ''}>
               {t('common.next')}
             </button>
          </div>
        );

      case 3:
        return (
          <div style={stepContentStyle}>
             <h3>{t('module3.anger_decoder.step3_title')}</h3>
             <p>{t('module3.anger_decoder.step3_q')}</p>
             <div style={gridStyle}>
                <button
                  onClick={() => setData({ ...data, powerlessness: true })}
                  style={optionButtonStyle(data.powerlessness === true)}
                >
                  {t('module3.anger_decoder.step3_opts.0', { defaultValue: 'Yes' })}
                </button>
                <button
                   onClick={() => setData({ ...data, powerlessness: false })}
                   style={optionButtonStyle(data.powerlessness === false)}
                >
                   {t('module3.anger_decoder.step3_opts.1', { defaultValue: 'No' })}
                </button>
             </div>
             <button onClick={nextStep} style={buttonStyle} disabled={data.powerlessness === null}>
               {t('common.next')}
             </button>
          </div>
        );

      case 4:
         return (
           <div style={stepContentStyle}>
             <h3>{t('module3.anger_decoder.response_title')}</h3>
             <div style={cardStyle}>
                <p><strong>{t('module3.anger_decoder.insight_prefix')}</strong></p>
                <p>"{data.scenario}"</p>
                <hr style={{margin: '15px 0', borderTop: '1px solid #eee'}} />
                
                {/* Constructing insight dynamically around the choices would be better, but for now using the template from PDD */}
                <p>{t('module3.anger_decoder.response_template', {
                   emotion: t(`module3.anger_decoder.step1_opts.${data.surfaceEmotion}`),
                   fear: t(`module3.anger_decoder.step2_opts.${data.deepFear}`)
                })}</p>
             </div>
             
             <button onClick={() => { addXp(50); navigate('/'); }} style={buttonStyle}>
               {t('module3.anger_decoder.save_mental_model')}
             </button>
           </div>
         );

      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <button onClick={() => navigate('/')}>←</button>
        <h2>{t('module3.anger_decoder.title')}</h2>
      </header>
      {renderStep()}
    </div>
  );
};

export default AngerDecoder;

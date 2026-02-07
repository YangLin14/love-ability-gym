import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppProvider';
import StorageService from '../services/StorageService'; // Ensure this exists or use local storage directly
import RadarChart from '../components/RadarChart';

const Onboarding = () => {
  const navigate = useNavigate();
  const { t, addXp } = useApp();
  const [step, setStep] = useState('intro'); // intro, questions, result
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({}); // { qIndex: score }

  const questions = [
    // Module 1: Awareness
    { id: 1, key: 'q1', module: 'Awareness' },
    { id: 2, key: 'q2', module: 'Awareness' },
    { id: 3, key: 'q3', module: 'Awareness' },
    // Module 2: Expression
    { id: 4, key: 'q4', module: 'Expression' },
    { id: 5, key: 'q5', module: 'Expression' },
    { id: 6, key: 'q6', module: 'Expression' },
    // Module 3: Empathy
    { id: 7, key: 'q7', module: 'Empathy' },
    { id: 8, key: 'q8', module: 'Empathy' },
    { id: 9, key: 'q9', module: 'Empathy' },
    // Module 4: Allowing
    { id: 10, key: 'q10', module: 'Allowing' },
    { id: 11, key: 'q11', module: 'Allowing' },
    { id: 12, key: 'q12', module: 'Allowing' },
    // Module 5: Influence
    { id: 13, key: 'q13', module: 'Influence' },
    { id: 14, key: 'q14', module: 'Influence' },
    { id: 15, key: 'q15', module: 'Influence' },
  ];

  // Helper to get module number from name
  const getModuleNumber = (moduleName) => {
    const mapping = {
      'Awareness': 1,
      'Expression': 2,
      'Empathy': 3,
      'Allowing': 4,
      'Influence': 5
    };
    return mapping[moduleName];
  };

  const handleAnswer = (score) => {
    setAnswers({ ...answers, [currentQ]: score });
    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 200); // Small delay for UX
    } else {
      calculateResults();
    }
  };

  const [results, setResults] = useState([]);
  const [totalScore, setTotalScore] = useState(0);

  const calculateResults = () => {
    const scores = {
      Awareness: 0,
      Expression: 0,
      Empathy: 0,
      Allowing: 0,
      Influence: 0
    };

    // Calculate sums
    questions.forEach((q, index) => {
       const score = answers[index] || 3; // Default to middle if missing
       scores[q.module] += score;
    });

    // Average per module (max 5)
    // Each module has 3 questions. Max raw score = 15. Average = raw / 3.
    const radarData = Object.keys(scores).map(key => ({
      labelKey: `module${getModuleNumber(key)}.short`, // Translation key
      value: (scores[key] / 3).toFixed(1)
    }));

    setResults(radarData);
    setTotalScore(Object.values(scores).reduce((a, b) => a + b, 0));
    setStep('result');
    
    // Save to storage
    localStorage.setItem('user_assessment', JSON.stringify({
       date: new Date().toISOString(),
       scores: radarData,
       total: Object.values(scores).reduce((a, b) => a + b, 0)
    }));
    
    addXp(100);
  };

  const getButtonColor = (val) => {
     // Gradient from red to green
     const colors = ['#e57373', '#ffb74d', '#fff176', '#aed581', '#4db6ac'];
     return colors[val-1];
  };

  return (
    <div className="page-container" style={{justifyContent: 'center', display: 'flex', flexDirection: 'column'}}>
      {step === 'intro' && (
        <div className="fade-in" style={{
          backgroundColor: 'white',
          padding: '40px 30px',
          borderRadius: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
          margin: '0 auto'
        }}>
           <div style={{fontSize: '72px', marginBottom: '20px', animation: 'bounce 2s infinite'}}>🏋️‍♀️</div>
           <h1 style={{fontSize: '28px', color: 'var(--color-ink-black)', marginBottom: '10px'}}>{t('onboarding.title')}</h1>
           <h3 style={{fontSize: '18px', color: 'var(--color-sage-dark)', fontWeight: 'normal', marginBottom: '30px'}}>{t('onboarding.intro_title')}</h3>
           
           <div style={{textAlign: 'left', backgroundColor: 'var(--color-sage-light)', padding: '20px', borderRadius: '12px', marginBottom: '40px'}}>
             <p style={{lineHeight: '1.6', color: '#555', margin: 0, fontSize: '15px'}}>
               {t('onboarding.intro_desc')}
             </p>
           </div>
           
           <button className="primary-btn" onClick={() => setStep('questions')} style={{width: '100%', padding: '18px', fontSize: '18px'}}>
             {t('onboarding.start_btn')}
           </button>
        </div>
      )}

      {step === 'questions' && (
        <div className="fade-in" style={{
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          width: '100%', 
          maxWidth: '500px', 
          margin: '0 auto'
        }}>
           <header style={{
             display: 'flex', 
             justifyContent: 'space-between', 
             alignItems: 'center', 
             marginBottom: '30px',
             paddingTop: '20px'
           }}>
              <span style={{
                fontSize: '14px', 
                color: '#999', 
                background: '#eee', 
                padding: '5px 10px', 
                borderRadius: '12px'
              }}>
                {currentQ + 1} / {questions.length}
              </span>
              <span style={{
                fontSize: '14px', 
                color: 'var(--color-sage-dark)', 
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {questions[currentQ].module}
              </span>
           </header>

           {/* Progress Bar */}
           <div style={{width: '100%', height: '6px', background: '#eee', borderRadius: '3px', marginBottom: '40px'}}>
             <div style={{
               width: `${((currentQ + 1) / questions.length) * 100}%`, 
               height: '100%', 
               background: 'var(--color-sage-green)', 
               borderRadius: '3px',
               transition: 'width 0.3s ease'
             }}></div>
           </div>

           <div style={{
             flex: 1,
             display: 'flex', 
             flexDirection: 'column',
             justifyContent: 'center',
             marginBottom: '40px'
           }}>
             <h3 style={{
               textAlign: 'center', 
               fontSize: '26px', 
               lineHeight: '1.5', 
               color: 'var(--color-ink-black)',
               fontWeight: '600'
             }}>
               {t(`onboarding.${questions[currentQ].key}`)}
             </h3>
           </div>

           <div className="options-grid">
              {[1, 2, 3, 4, 5].map(val => (
                 <button 
                   key={val}
                   className="score-btn"
                   style={{
                     backgroundColor: getButtonColor(val),
                     transform: `scale(${answers[currentQ] === val ? 1.1 : 1})`,
                     boxShadow: answers[currentQ] === val ? '0 5px 15px rgba(0,0,0,0.2)' : 'none',
                     border: answers[currentQ] === val ? '3px solid white' : 'none'
                   }}
                   onClick={() => handleAnswer(val)}
                 >
                   {val}
                 </button>
              ))}
           </div>
           
           <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '15px', padding: '0 15px', color: '#aaa', fontSize: '13px', fontWeight: '500'}}>
              <span>No / Never</span>
              <span>Yes / Always</span>
           </div>
        </div>
      )}

      {step === 'result' && (
        <div className="fade-in center-content" style={{maxWidth: '500px', margin: '0 auto'}}>
           <h2 style={{fontSize: '28px', marginBottom: '10px'}}>{t('onboarding.result_title')}</h2>
           <p style={{color: '#666', marginBottom: '30px'}}>Here is your emotional muscle map</p>
           
           <div style={{
             margin: '0 auto', 
             background: 'white', 
             padding: '20px', 
             borderRadius: '24px', 
             boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
           }}>
              <RadarChart data={results} size={320} />
           </div>

           <div style={{
             fontSize: '32px', 
             fontWeight: '800', 
             margin: '30px 0 10px',
             color: 'var(--color-ink-black)'
           }}>
             <span style={{fontSize: '16px', color: '#999', fontWeight: 'normal'}}>{t('onboarding.score_prefix')}</span><br/>
             <span style={{color: 'var(--color-sage-green)'}}>{totalScore}</span> <span style={{fontSize: '20px', color: '#ccc'}}>/ 75</span>
           </div>
           
           <button className="primary-btn" onClick={() => navigate('/')} style={{marginTop: '20px', width: '100%', padding: '18px'}}>
             {t('onboarding.btn_dashboard')}
           </button>
        </div>
      )}

      <style>{`
        .options-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-top: auto; }
        .score-btn { 
          aspect-ratio: 1; 
          border-radius: 50%; 
          border: none; 
          font-size: 22px; 
          font-weight: bold; 
          color: white; 
          cursor: pointer; 
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .score-btn:hover { transform: scale(1.1); }
        .score-btn:active { transform: scale(0.9); }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default Onboarding;

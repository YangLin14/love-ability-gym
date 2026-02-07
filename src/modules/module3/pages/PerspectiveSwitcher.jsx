import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppProvider';
import StorageService from '../../../services/StorageService';

const PerspectiveSwitcher = () => {
  const navigate = useNavigate();
  const { t, addXp } = useApp();
  const [step, setStep] = useState(1);
  const [scenario, setScenario] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [userBlanks, setUserBlanks] = useState({ fact: '', feeling: '', logic: '' });

  const scenarios = [
    {
       id: 1,
       trigger: t('module3.perspective.s1_trigger'),
       cards: [
          { id: 'a', text: t('module3.perspective.s1_card_a'), type: 'defense' },
          { id: 'b', text: t('module3.perspective.s1_card_b'), type: 'validation' },
          { id: 'c', text: t('module3.perspective.s1_card_c'), type: 'attack' }
       ],
       template: {
          fact_hint: t('module3.perspective.s1_hint_fact'),
          feeling_hint: t('module3.perspective.s1_hint_feeling'),
          logic_hint: t('module3.perspective.s1_hint_logic')
       }
    },
    {
       id: 2,
       trigger: t('module3.perspective.s2_trigger'),
       cards: [
          { id: 'a', text: t('module3.perspective.s2_card_a'), type: 'defense' },
          { id: 'b', text: t('module3.perspective.s2_card_b'), type: 'validation' },
          { id: 'c', text: t('module3.perspective.s2_card_c'), type: 'attack' }
       ],
       template: {
          fact_hint: t('module3.perspective.s2_hint_fact'),
          feeling_hint: t('module3.perspective.s2_hint_feeling'),
          logic_hint: t('module3.perspective.s2_hint_logic')
       }
    }
  ];

  const handleCardSelect = (card) => {
      if (card.type === 'validation') {
          setFeedback({ type: 'success', msg: "✅ Correct! You validated their feeling." });
          setTimeout(() => {
              setFeedback(null);
              setStep(3);
          }, 1500);
      } else {
          setFeedback({ type: 'error', msg: card.type === 'defense' ? "❌ That's defending facts." : "❌ That's fighting back." });
      }
  };

  const handleFinish = () => {
      StorageService.saveLog('module3', {
        tool: 'Perspective Switcher',
        scenario: scenario?.trigger,
        notes: `Fact: ${userBlanks.fact}, Feeling: ${userBlanks.feeling}`
      });
      addXp(50);
      navigate('/');
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <button onClick={() => navigate('/')}>←</button>
        <h2>{t('module3.perspective.title')}</h2>
      </header>

      {step === 1 && (
          <div className="fade-in">
              <h3>{t('module3.perspective.choose_scenario')}</h3>
              {scenarios.map(s => (
                  <button key={s.id} className="scenario-btn" onClick={() => { setScenario(s); setStep(2); }}>
                      "{s.trigger}"
                  </button>
              ))}
          </div>
      )}

      {step === 2 && scenario && (
          <div className="fade-in">
              <h3>{t('module3.perspective.task_sort')}</h3>
              <div className="trigger-box">"{scenario.trigger}"</div>
              <p>{t('module3.perspective.task_instruction')}</p>
              
              <div className="cards-container">
                  {scenario.cards.map(card => (
                      <button key={card.id} className="option-card" onClick={() => handleCardSelect(card)}>
                          {card.text}
                      </button>
                  ))}
              </div>
          </div>
      )}

      {step === 3 && scenario && (
           <div className="fade-in">
               <h3>{t('module3.perspective.fill_blanks')}</h3>
               <div className="template-box">
                   <p style={{lineHeight: '2.5'}}>
                       {t('module3.perspective.template_part1')} <input className="inline-input" placeholder={scenario.template.fact_hint} onChange={e => setUserBlanks({...userBlanks, fact: e.target.value})} />
                       {t('module3.perspective.template_part2')} <input className="inline-input" placeholder={scenario.template.feeling_hint} onChange={e => setUserBlanks({...userBlanks, feeling: e.target.value})} /> 
                       {t('module3.perspective.template_part3')} <input className="inline-input" placeholder={scenario.template.logic_hint} onChange={e => setUserBlanks({...userBlanks, logic: e.target.value})} />
                       {t('module3.perspective.template_part4')}
                   </p>
               </div>
               <button 
                  className="primary-btn" 
                  onClick={handleFinish}
                  disabled={!userBlanks.fact || !userBlanks.feeling || !userBlanks.logic}
               >
                   {t('common.done')}
               </button>
           </div>
      )}

      {feedback && (
        <div className={`feedback ${feedback.type}`}>
          {feedback.msg}
        </div>
      )}

      <style>{`
        .scenario-btn { width: 100%; padding: 20px; text-align: left; background: white; border: 1px solid #ccc; border-radius: 12px; margin-bottom: 15px; cursor: pointer; font-size: 18px; transition: transform 0.2s; }
        .scenario-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .trigger-box { background: #fee; color: #b71c1c; padding: 20px; border-radius: 12px; font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 20px; }
        .cards-container { display: flex; flexDirection: column; gap: 15px; }
        .option-card { padding: 20px; background: white; border: 2px solid #eee; border-radius: 12px; font-size: 16px; cursor: pointer; text-align: left; transition: all 0.2s; }
        .option-card:hover { border-color: var(--color-sage-green); background: var(--color-sage-light); }
        .template-box { background: white; padding: 25px; border-radius: 12px; line-height: 2; font-size: 18px; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .inline-input { border: none; border-bottom: 2px solid #ccc; font-size: 16px; padding: 5px; width: 150px; outline: none; transition: border-color 0.3s; background: transparent; }
        .inline-input:focus { border-color: var(--color-ink-black); }
        .primary-btn { width: 100%; padding: 15px; background: var(--color-ink-black); color: white; border: none; border-radius: 50px; cursor: pointer; font-size: 16px; transition: opacity 0.3s; }
        .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .feedback { position: fixed; bottom: 50px; left: 50%; transform: translateX(-50%); padding: 15px 30px; border-radius: 50px; color: white; font-weight: bold; animation: popUp 0.3s ease; z-index: 100; }
        .feedback.success { background: var(--color-sage-dark, #2e7d32); }
        .feedback.error { background: #c62828; }
        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default PerspectiveSwitcher;

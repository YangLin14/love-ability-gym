import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppProvider';
import StorageService from '../../../services/StorageService';
import { vocabularyData } from '../data/vocabulary';
import BackButton from '../../../components/BackButton';

const VocabularySwap = () => {
  const navigate = useNavigate();
  const { t, addXp } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const currentItem = vocabularyData[currentIndex];

  const handleTrashDrop = (e) => {
    e.preventDefault();
    setShowOptions(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleOptionSelect = (option) => {
    if (option.isCorrect) {
      setFeedback({ type: 'success', msg: `✅ ${option.reason}` });
      addXp(20);
      setTimeout(() => {
        setFeedback(null);
        setShowOptions(false);
        if (currentIndex < vocabularyData.length - 1) {
            setCurrentIndex(c => c + 1);
        } else {
            alert(t('module2.vocab.all_done'));
            StorageService.saveLog('module2', {
              tool: 'Vocabulary Swap',
              completed: true,
              total_items: vocabularyData.length
            });
            navigate('/');
        }
      }, 2000);
    } else {
      setFeedback({ type: 'error', msg: `❌ ${option.reason}` });
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <BackButton />
        <h2>{t('module2.vocab.title')}</h2>
      </header>
      
      <div className="game-area">
        {!showOptions ? (
           <div 
             className="bad-phrase-card" 
             draggable 
             onDragStart={(e) => e.dataTransfer.setData("text", "trash")}
           >
             "{currentItem.bad_phrase}"
             <div className="hint">👇 {t('module2.vocab.drag_hint')}</div>
           </div>
        ) : (
           <div className="options-area fade-in">
              <h3>{t('module2.vocab.choose_better')}</h3>
              {currentItem.alternatives.map((opt, idx) => (
                 <button 
                   key={idx} 
                   className="option-btn"
                   onClick={() => handleOptionSelect(opt)}
                 >
                   {opt.text}
                 </button>
              ))}
           </div>
        )}

        <div 
          className={`trash-can ${showOptions ? 'active' : ''}`}
          onDragOver={handleDragOver}
          onDrop={handleTrashDrop}
        >
           🗑️
        </div>

        {feedback && (
           <div className={`feedback ${feedback.type}`}>
              {feedback.msg}
           </div>
        )}
      </div>

      <style>{`
        .game-area { flex: 1; display: flex; flexDirection: column; alignItems: center; justify-content: center; gap: 40px; }
        .bad-phrase-card { background: #ffebee; padding: 30px; border-radius: 12px; font-size: 24px; font-weight: bold; color: #c62828; cursor: grab; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1); width: 100%; }
        .hint { font-size: 14px; color: #666; margin-top: 10px; font-weight: normal; }
        .trash-can { font-size: 60px; padding: 20px; border: 3px dashed #ccc; border-radius: 50%; transition: all 0.3s; }
        .trash-can.active { border-color: var(--color-ink-black); opacity: 0.5; transform: scale(0.9); }
        .options-area { display: flex; flexDirection: column; gap: 15px; width: 100%; }
        .option-btn { padding: 15px; border: 1px solid #ccc; background: white; border-radius: 8px; font-size: 16px; cursor: pointer; transition: background 0.2s; text-align: left; }
        .option-btn:hover { background: var(--color-sage-light); border-color: var(--color-sage-green); }
        .feedback { position: fixed; bottom: 50px; left: 50%; transform: translateX(-50%); padding: 15px 30px; border-radius: 50px; color: white; font-weight: bold; animation: popUp 0.3s ease; }
        .feedback.success { background: var(--color-sage-dark); }
        .feedback.error { background: #c62828; }
        @keyframes popUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
        .fade-in { animation: fadeIn 0.5s ease; }
      `}</style>
    </div>
  );
};

export default VocabularySwap;

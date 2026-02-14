import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppProvider';
import StorageService from '../../../services/StorageService';
import { emotionTaxonomy, getEmotionById } from '../../../data/emotionTaxonomy';
import BackButton from '../../../components/BackButton';

const AngerDecoder = () => {
  const navigate = useNavigate();
  const { addXp, t, language } = useApp();
  const [step, setStep] = useState(1);
  const [scenario, setScenario] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [powerlessness, setPowerlessness] = useState(null);

  const nextStep = () => setStep(prev => prev + 1);

  const getEmotionLabel = (emo) => {
    return language === 'zh' ? emo.name_zh : emo.name_en;
  };

  const getCategoryLabel = (cat) => {
    return language === 'zh' ? cat.category_zh : cat.category;
  };

  const handleFinish = () => {
    StorageService.saveLog('module3', {
      type: 'anger_decoder',
      scenario,
      emotion: selectedEmotion ? getEmotionLabel(selectedEmotion) : '',
      emotionId: selectedEmotion?.id,
      need: selectedEmotion?.need,
      powerlessness
    });
    addXp(50);
    navigate('/');
  };

  // Only show negative emotion categories for decoding
  const negativeCategories = emotionTaxonomy.filter(cat => cat.category !== 'Joy');

  return (
    <div className="page-container">
      <header className="page-header">
        <BackButton />
        <h2>{t('module3.anger_decoder.title')}</h2>
      </header>

      {/* Step 1: Describe the scenario */}
      {step === 1 && (
        <div className="fade-in" style={styles.stepContent}>
          <h3>{language === 'zh' ? '對方現在是什麼情況？' : 'What is happening?'}</h3>
          <textarea
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder={language === 'zh' ? '例如：他剛才對我大吼大叫...' : 'e.g., They just yelled at me...'}
            style={styles.textarea}
          />
          <button onClick={nextStep} style={styles.primaryBtn} disabled={!scenario}>
            {t('common.next')}
          </button>
        </div>
      )}

      {/* Step 2: What category of emotion is the other person showing? */}
      {step === 2 && (
        <div className="fade-in" style={styles.stepContent}>
          <h3>{language === 'zh' ? '對方看起來主要是什麼情緒？' : 'What emotion does the other person seem to be showing?'}</h3>
          <div style={styles.categoryGrid}>
            {negativeCategories.map(category => (
              <button 
                key={category.category}
                onClick={() => { setSelectedCategory(category); nextStep(); }}
                style={{
                  ...styles.categoryBtn,
                  borderColor: category.color,
                  backgroundColor: `${category.color}15`
                }}
              >
                <span style={{ fontSize: '28px' }}>{category.icon}</span>
                <span style={{ fontWeight: 'bold' }}>{getCategoryLabel(category)}</span>
                <span style={{ fontSize: '12px', color: '#666' }}>{category.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Specific emotion selection */}
      {step === 3 && selectedCategory && (
        <div className="fade-in" style={styles.stepContent}>
          <h3>{language === 'zh' ? '更具體來說，對方表現出...' : 'More specifically, they seem...'}</h3>
          <div style={styles.emotionGrid}>
            {selectedCategory.emotions.map(emo => (
              <button 
                key={emo.id}
                onClick={() => { setSelectedEmotion(emo); nextStep(); }}
                style={{
                  ...styles.emotionBtn,
                  borderColor: selectedCategory.color
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{getEmotionLabel(emo)}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{emo.definition}</div>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(2)} style={styles.secondaryBtn}>
            ← {language === 'zh' ? '返回類別' : 'Back'}
          </button>
        </div>
      )}

      {/* Step 4: The Insight - Reveal the need behind the emotion */}
      {step === 4 && selectedEmotion && (
        <div className="fade-in" style={styles.stepContent}>
          <h3>{language === 'zh' ? '💡 解碼結果' : '💡 Decoded Insight'}</h3>
          
          <div style={styles.insightCard}>
            <div style={styles.scenarioQuote}>"{scenario}"</div>
            
            <div style={styles.arrowDown}>↓</div>
            
            <div style={styles.emotionReveal}>
              <span style={{ fontSize: '32px' }}>{selectedCategory.icon}</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 10px' }}>
                {getEmotionLabel(selectedEmotion)}
              </span>
            </div>

            <div style={styles.arrowDown}>↓</div>

            <div style={styles.needSection}>
              <p style={{ color: '#666', marginBottom: '10px' }}>
                {language === 'zh' ? '對方內心深處渴望的是：' : 'What they really need is:'}
              </p>
              <div style={styles.needHighlight}>
                {selectedEmotion.need}
              </div>
            </div>
          </div>

          <div style={styles.suggestionCard}>
            <h4 style={{ margin: '0 0 10px 0' }}>
              {language === 'zh' ? '🗣️ 建議回應' : '🗣️ Suggested Response'}
            </h4>
            <p style={{ fontStyle: 'italic', lineHeight: '1.6' }}>
              {language === 'zh' 
                ? `「我感覺到你現在很${getEmotionLabel(selectedEmotion)}。你是不是很需要${selectedEmotion.need}？」`
                : `"I can sense that you're feeling ${getEmotionLabel(selectedEmotion).toLowerCase()}. Do you need ${selectedEmotion.need.toLowerCase()}?"`
              }
            </p>
          </div>

          <button onClick={handleFinish} style={styles.primaryBtn}>
            {language === 'zh' ? '✓ 保存這個理解' : '✓ Save this insight'}
          </button>
        </div>
      )}

      <style>{`
        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

const styles = {
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '15px',
    fontSize: '16px',
    borderRadius: '12px',
    border: '1px solid #ddd',
    fontFamily: 'inherit'
  },
  primaryBtn: {
    backgroundColor: '#333',
    color: 'white',
    padding: '15px',
    borderRadius: '25px',
    border: 'none',
    fontSize: '16px',
    width: '100%',
    cursor: 'pointer'
  },
  secondaryBtn: {
    backgroundColor: 'white',
    color: '#333',
    padding: '15px',
    borderRadius: '25px',
    border: '2px solid #333',
    fontSize: '16px',
    width: '100%',
    cursor: 'pointer',
    marginTop: '10px'
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  },
  categoryBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '20px 15px',
    borderRadius: '16px',
    border: '2px solid',
    background: 'white',
    cursor: 'pointer',
    textAlign: 'center'
  },
  emotionGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '350px',
    overflowY: 'auto'
  },
  emotionBtn: {
    padding: '15px',
    borderRadius: '12px',
    border: '1px solid #ddd',
    background: 'white',
    cursor: 'pointer',
    textAlign: 'left'
  },
  insightCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  scenarioQuote: {
    fontStyle: 'italic',
    color: '#666',
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '12px'
  },
  arrowDown: {
    fontSize: '24px',
    color: '#ccc',
    margin: '15px 0'
  },
  emotionReveal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '15px',
    backgroundColor: '#fff3e0',
    borderRadius: '12px'
  },
  needSection: {
    marginTop: '10px'
  },
  needHighlight: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'var(--color-sage-dark)',
    padding: '15px',
    backgroundColor: 'var(--color-sage-light)',
    borderRadius: '12px'
  },
  suggestionCard: {
    backgroundColor: '#e3f2fd',
    padding: '20px',
    borderRadius: '16px',
    marginTop: '15px'
  }
};

export default AngerDecoder;

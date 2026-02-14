import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppProvider';
import StorageService from '../../../services/StorageService';
import { emotionTaxonomy } from '../../../data/emotionTaxonomy';
import BackButton from '../../../components/BackButton';

const DraftBuilder = () => {
  const navigate = useNavigate();
  const { t, addXp, language } = useApp();
  const [step, setStep] = useState(1);
  const [fact, setFact] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [need, setNeed] = useState('');
  const [request, setRequest] = useState('');
  const [showError, setShowError] = useState(false);
  const [toast, setToast] = useState(null);

  const handleNext = () => setStep(s => s + 1);

  const checkFact = () => {
    const badWords = ['always', 'never', 'lazy', 'stupid', 'hate', 'bad', '總是', '從不', '懶', '笨', '恨'];
    const hasBadWord = badWords.some(word => fact.toLowerCase().includes(word));
    
    if (hasBadWord) {
      setShowError(true);
    } else {
      setShowError(false);
      handleNext();
    }
  };

  const handleEmotionSelect = (emo) => {
    setEmotion(emo);
    setNeed(emo.need);
    handleNext();
  };

  const getEmotionLabel = (emo) => {
    return language === 'zh' ? emo.name_zh : emo.name_en;
  };

  const getCategoryLabel = (cat) => {
    return language === 'zh' ? cat.category_zh : cat.category;
  };

  const getFinalText = () => {
    const emotionLabel = emotion ? getEmotionLabel(emotion) : '';
    if (language === 'zh') {
      return `「當我看到 ${fact} 的時候，我感到 ${emotionLabel}，因為我很需要 ${need}。我們可以約定 ${request} 嗎？」`;
    }
    return `"When I see ${fact}, I feel ${emotionLabel}, because I really need ${need}. Could we agree to ${request}?"`;
  };

  const handleCopy = async () => {
    const text = getFinalText();
    try {
      await navigator.clipboard.writeText(text);
      setToast({ type: 'success', msg: t('common.copied_to_clipboard') || 'Copied!' });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', msg: 'Failed to copy.' });
    }
  };

  const handleFinish = () => {
    const text = getFinalText();
    StorageService.saveLog('module2', {
      type: 'draft',
      fact,
      emotion: emotion ? getEmotionLabel(emotion) : '',
      emotionId: emotion?.id,
      need,
      request,
      finalText: text
    });
    
    addXp(60);
    navigate('/');
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <BackButton />
        <h2>{t('module2.draft_builder.title')}</h2>
      </header>

      {/* Step 1: Fact Check */}
      {step === 1 && (
        <div className="fade-in">
          <h3>{t('module2.draft_builder.step1_title')}</h3>
          <p>{t('module2.draft_builder.step1_desc')}</p>
          <textarea 
            value={fact}
            onChange={e => setFact(e.target.value)}
            placeholder={language === 'zh' ? '例如：碗盤放在水槽裡。' : 'e.g., The dishes are in the sink.'}
            className="input-area"
          />
          {showError && (
             <div className="error-box">
                ⚠️ {t('module2.draft_builder.fact_error')}
             </div>
          )}
          <button className="primary-btn" onClick={checkFact} disabled={!fact}>{t('common.next')}</button>
        </div>
      )}

      {/* Step 2: Category Selection */}
      {step === 2 && (
        <div className="fade-in">
          <h3>{language === 'zh' ? '你現在主要的情緒類型是？' : 'What emotion category are you feeling?'}</h3>
          <div className="category-grid">
            {emotionTaxonomy.filter(cat => cat.category !== 'Joy').map(category => (
              <button 
                key={category.category}
                onClick={() => { setSelectedCategory(category); handleNext(); }}
                className="category-btn"
                style={{ borderColor: category.color, backgroundColor: `${category.color}15` }}
              >
                <span style={{ fontSize: '24px' }}>{category.icon}</span>
                <span>{getCategoryLabel(category)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Specific Emotion Selection */}
      {step === 3 && selectedCategory && (
        <div className="fade-in">
          <h3>{language === 'zh' ? '更具體來說，你感受到...' : 'More specifically, you feel...'}</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>
            {language === 'zh' ? '選擇一個最接近的情緒詞' : 'Choose the closest emotion word'}
          </p>
          <div className="emotion-grid">
            {selectedCategory.emotions.map(emo => (
              <button 
                key={emo.id}
                onClick={() => handleEmotionSelect(emo)}
                className="emotion-btn"
                style={{ borderColor: selectedCategory.color }}
              >
                <div style={{ fontWeight: 'bold' }}>{getEmotionLabel(emo)}</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                  {emo.definition.slice(0, 20)}...
                </div>
              </button>
            ))}
          </div>
          <button className="secondary-btn" onClick={() => setStep(2)} style={{ marginTop: '15px' }}>
            ← {language === 'zh' ? '返回類別' : 'Back to categories'}
          </button>
        </div>
      )}

      {/* Step 4: Show Auto-populated Need */}
      {step === 4 && emotion && (
        <div className="fade-in">
          <h3>{language === 'zh' ? '你的內心需求' : 'Your underlying need'}</h3>
          <div className="insight-card">
            <p style={{ marginBottom: '10px' }}>
              {language === 'zh' 
                ? `「${getEmotionLabel(emotion)}」這個情緒背後，你渴望的是：`
                : `Behind "${getEmotionLabel(emotion)}", you're longing for:`}
            </p>
            <div className="need-highlight">{need}</div>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '15px' }}>
              {emotion.definition}
            </p>
          </div>
          <button className="primary-btn" onClick={handleNext}>{t('common.next')}</button>
        </div>
      )}

      {/* Step 5: SMART Request */}
      {step === 5 && (
        <div className="fade-in">
          <h3>{t('module2.draft_builder.step4_title')}</h3>
          <p>{t('module2.draft_builder.step4_desc')}</p>
          <textarea 
            value={request}
            onChange={e => setRequest(e.target.value)}
            placeholder={language === 'zh' ? '例如：吃完飯後30分鐘內洗碗。' : 'e.g., clean them within 30 mins after dinner.'}
            className="input-area"
          />
          <button className="primary-btn" onClick={handleNext} disabled={!request}>{t('module2.draft_builder.generate_btn')}</button>
        </div>
      )}

      {/* Final Preview */}
      {step === 6 && (
        <div className="fade-in">
           <h3>{t('module2.draft_builder.preview_title')}</h3>
           <div className="card">
              <p>
                 <strong>{language === 'zh' ? '情境：' : 'Context:'}</strong> {fact}<br/>
                 <strong>{language === 'zh' ? '我感到：' : 'I feel:'}</strong> {emotion ? getEmotionLabel(emotion) : ''}<br/>
                 <strong>{language === 'zh' ? '因為我需要：' : 'Because I need:'}</strong> {need}<br/>
                 <strong>{language === 'zh' ? '我請求：' : 'I request:'}</strong> {request}
              </p>
              <hr/>
              <p className="final-text">
                 {getFinalText()}
              </p>
           </div>
           <div className="button-group">
             <button className="secondary-btn" onClick={handleCopy}>
               📋 {t('common.copy') || 'Copy'}
             </button>
             <button className="primary-btn" onClick={handleFinish}>{t('common.done')}</button>
           </div>
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.msg}
        </div>
      )}

      <style>{`
        .input-area { width: 100%; height: 120px; padding: 15px; border-radius: 12px; border: 1px solid #ccc; font-size: 16px; margin-bottom: 20px; font-family: inherit; }
        .primary-btn { width: 100%; padding: 15px; background: var(--color-ink-black); color: white; border: none; border-radius: 50px; cursor: pointer; font-size: 16px; transition: background 0.3s; }
        .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .secondary-btn { width: 100%; padding: 15px; background: white; color: var(--color-ink-black); border: 2px solid var(--color-ink-black); border-radius: 50px; cursor: pointer; font-size: 16px; }
        .button-group { display: flex; gap: 15px; }
        .error-box { background: #ffebee; color: #c62828; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-weight: bold; }
        .category-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .category-btn { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 20px; border-radius: 16px; border: 2px solid; background: white; cursor: pointer; font-size: 16px; font-weight: 600; transition: transform 0.2s; }
        .category-btn:hover { transform: scale(1.02); }
        .emotion-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-height: 400px; overflow-y: auto; }
        .emotion-btn { padding: 15px; border-radius: 12px; border: 1px solid #ddd; background: white; cursor: pointer; text-align: left; transition: all 0.2s; }
        .emotion-btn:hover { background: #f5f5f5; border-color: var(--color-sage-green); }
        .insight-card { background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%); padding: 25px; border-radius: 16px; margin-bottom: 20px; text-align: center; }
        .need-highlight { font-size: 22px; font-weight: bold; color: var(--color-sage-dark); padding: 15px; background: white; border-radius: 12px; margin-top: 10px; }
        .card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 30px; }
        .final-text { font-size: 18px; font-style: italic; color: var(--color-text-primary); margin-top: 15px; line-height: 1.5; }
        .fade-in { animation: fadeIn 0.5s ease; }
        .toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); padding: 10px 20px; border-radius: 30px; color: white; font-weight: bold; z-index: 1000; }
        .toast.success { background: var(--color-sage-dark, #2e7d32); }
        .toast.error { background: #c62828; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default DraftBuilder;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppProvider';
import BodyMap from '../../module1/components/BodyMap';
import StorageService from '../../../services/StorageService';
import { emotionTaxonomy } from '../../../data/emotionTaxonomy';
import BackButton from '../../../components/BackButton';

const EmotionScan = () => {
  const navigate = useNavigate();
  const { t, addXp, language } = useApp();
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [intensity, setIntensity] = useState(5);
  const [bodyPart, setBodyPart] = useState(null);
  const [savedReport, setSavedReport] = useState(null);

  const handleNext = () => setStep(s => s + 1);

  const getEmotionLabel = (emo) => {
    return language === 'zh' ? emo.name_zh : emo.name_en;
  };

  const getCategoryLabel = (cat) => {
    return language === 'zh' ? cat.category_zh : cat.category;
  };

  const handleEmotionSelect = (emo) => {
    setEmotion(emo);
    setConfirmed(false);
    handleNext();
  };

  const handleConfirm = () => {
    setConfirmed(true);
    handleNext();
  };

  const handleReject = () => {
    setStep(2);
    setEmotion(null);
  };
  
  const handleSave = () => {
    const report = {
      type: 'emotion_scan',
      emotion: emotion ? getEmotionLabel(emotion) : '',
      emotionId: emotion?.id,
      category: selectedCategory?.category,
      category_zh: selectedCategory?.category_zh,
      definition: getDefinition(emotion),
      need: getNeed(emotion),
      intensity,
      bodyPart,
      timestamp: new Date().toISOString()
    };
    
    StorageService.saveLog('module1', report);
    addXp(30);
    
    // Save report for display
    setSavedReport(report);
    handleNext(); // Go to report screen
  };

  const getBodyPartLabel = (part) => {
    const labels = {
      head: language === 'zh' ? '頭部' : 'Head',
      chest: language === 'zh' ? '胸口' : 'Chest',
      stomach: language === 'zh' ? '腹部' : 'Stomach',
      hands: language === 'zh' ? '雙手' : 'Hands',
      legs: language === 'zh' ? '雙腿' : 'Legs',
      throat: language === 'zh' ? '喉嚨' : 'Throat',
      shoulders: language === 'zh' ? '肩膀' : 'Shoulders'
    };
    return labels[part] || part;
  };

  const getDescription = (cat) => {
    return language === 'zh' ? cat.description : (cat.description_en || cat.description);
  };

  const getDefinition = (emo) => {
    return language === 'zh' ? emo.definition : (emo.definition_en || emo.definition);
  };

  const getNeed = (emo) => {
    return language === 'zh' ? emo.need : (emo.need_en || emo.need);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <BackButton />
        <h2>{t('module1.emotion_scan.title')}</h2>
      </header>

      {/* Step 1: Category Selection */}
      {step === 1 && (
        <div className="fade-in">
          <h3>{language === 'zh' ? '你現在的主要感受是？' : 'How are you feeling right now?'}</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            {language === 'zh' ? '選擇一個最接近的情緒類別' : 'Choose the closest emotion category'}
          </p>
          <div className="category-grid">
            {emotionTaxonomy.map(category => (
              <button 
                key={category.category}
                onClick={() => { setSelectedCategory(category); handleNext(); }}
                className="category-btn"
                style={{ borderColor: category.color, backgroundColor: `${category.color}15` }}
              >
                <span style={{ fontSize: '32px' }}>{category.icon}</span>
                <span style={{ fontWeight: 'bold' }}>{getCategoryLabel(category)}</span>
                <span style={{ fontSize: '12px', color: '#666' }}>{getDescription(category)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Specific Emotion Selection */}
      {step === 2 && selectedCategory && (
        <div className="fade-in">
          <div className="category-header" style={{ backgroundColor: `${selectedCategory.color}20`, borderLeft: `4px solid ${selectedCategory.color}` }}>
            <span style={{ fontSize: '24px' }}>{selectedCategory.icon}</span>
            <span style={{ fontWeight: 'bold' }}>{getCategoryLabel(selectedCategory)}</span>
          </div>
          <h3>{language === 'zh' ? '更具體來說，你感受到...' : 'More specifically, you feel...'}</h3>
          <div className="emotion-grid">
            {selectedCategory.emotions.map(emo => (
              <button 
                key={emo.id}
                onClick={() => handleEmotionSelect(emo)}
                className="emotion-btn"
                style={{ borderColor: selectedCategory.color }}
              >
                <div className="emotion-name">{getEmotionLabel(emo)}</div>
                <div className="emotion-hint">
                  {getDefinition(emo).slice(0, 30)}...
                </div>
              </button>
            ))}
          </div>
          <button className="back-btn" onClick={() => setStep(1)}>
            ← {language === 'zh' ? '返回類別' : 'Back to categories'}
          </button>
        </div>
      )}

      {/* Step 3: Confirmation Dialog */}
      {step === 3 && emotion && !confirmed && (
        <div className="fade-in">
          <div className="confirmation-card">
            <div className="confirmation-icon">🤔</div>
            <h3>{language === 'zh' ? '你是指...' : 'You mean...'}</h3>
            <div className="definition-box">
              <span style={{ fontSize: '28px', marginRight: '10px' }}>{selectedCategory.icon}</span>
              <strong>{getEmotionLabel(emotion)}</strong>
              <p className="definition-text">「{getDefinition(emotion)}」</p>
            </div>
            
            <div className="confirm-buttons">
              <button className="confirm-yes" onClick={handleConfirm}>
                ✓ {language === 'zh' ? '對，就是這個感覺！' : 'Yes, that\'s it!'}
              </button>
              <button className="confirm-no" onClick={handleReject}>
                {language === 'zh' ? '不太對，讓我重選' : 'Not quite, let me choose again'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Need Revelation */}
      {step === 4 && emotion && confirmed && (
        <div className="fade-in">
          <div className="revelation-card">
            <div className="revelation-icon">💡</div>
            <h3>{language === 'zh' ? '我理解了...' : 'I understand...'}</h3>
            
            <div className="emotion-summary">
              <span style={{ fontSize: '24px' }}>{selectedCategory.icon}</span>
              <span style={{ fontWeight: 'bold', fontSize: '20px', color: selectedCategory.color }}>
                {getEmotionLabel(emotion)}
              </span>
            </div>

            <div className="need-revelation">
              <p className="need-intro">
                {language === 'zh' 
                  ? '看起來，你內心深處渴望的是：'
                  : 'It seems what you truly need is:'}
              </p>
              <div className="need-highlight">
                {getNeed(emotion)}
              </div>
            </div>

            <p className="healing-message">
              {language === 'zh' 
                ? '這是一個很重要的發現。當我們理解自己真正需要什麼，改變就開始了。'
                : 'This is an important discovery. When we understand what we truly need, change begins.'}
            </p>
          </div>
          
          <button className="primary-btn" onClick={handleNext}>{t('common.next')}</button>
        </div>
      )}

      {/* Step 5: Intensity */}
      {step === 5 && (
        <div className="fade-in" style={{textAlign: 'center'}}>
          <h3>{t('module1.emotion_scan.intensity_title')}</h3>
          <p style={{ color: '#666' }}>
            {language === 'zh' ? '這個感受有多強烈？' : 'How intense is this feeling?'}
          </p>
          <div className="intensity-display" style={{ color: selectedCategory?.color }}>
            {intensity}
          </div>
          <input 
            type="range" min="1" max="10" value={intensity} 
            onChange={e => setIntensity(Number(e.target.value))}
            className="intensity-slider"
          />
          <div className="intensity-labels">
            <span>{language === 'zh' ? '輕微' : 'Mild'}</span>
            <span>{language === 'zh' ? '強烈' : 'Intense'}</span>
          </div>
          {intensity > 8 && (
            <div className="high-intensity-alert">
              ⚠️ {t('module1.emotion_scan.alert_high_intensity')}
            </div>
          )}
          <button className="primary-btn" onClick={handleNext}>{t('common.next')}</button>
        </div>
      )}

      {/* Step 6: Body Map */}
      {step === 6 && (
        <div className="fade-in" style={{textAlign: 'center'}}>
           <h3>{t('module1.emotion_scan.body_map_title')}</h3>
           <p style={{ color: '#666' }}>
             {language === 'zh' ? '你在身體哪個部位感受到這個情緒？' : 'Where in your body do you feel this emotion?'}
           </p>
           <BodyMap onSelect={setBodyPart} />
           <button className="primary-btn" onClick={handleSave} disabled={!bodyPart}>
             {language === 'zh' ? '生成報告' : 'Generate Report'}
           </button>
        </div>
      )}

      {/* Step 7: Report Screen */}
      {step === 7 && savedReport && (
        <div className="fade-in">
          <div className="report-card">
            <div className="report-header">
              <span style={{ fontSize: '40px' }}>📋</span>
              <h2>{language === 'zh' ? '情緒掃描報告' : 'Emotion Scan Report'}</h2>
              <p className="report-time">{new Date(savedReport.timestamp).toLocaleString()}</p>
            </div>

            <div className="report-section">
              <div className="report-label">{language === 'zh' ? '情緒類別' : 'Category'}</div>
              <div className="report-value" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>{selectedCategory.icon}</span>
                <span style={{ color: selectedCategory.color, fontWeight: 'bold' }}>
                  {getCategoryLabel(selectedCategory)}
                </span>
              </div>
            </div>

            <div className="report-section">
              <div className="report-label">{language === 'zh' ? '具體情緒' : 'Specific Emotion'}</div>
              <div className="report-value-large">{savedReport.emotion}</div>
              <p className="report-definition">「{savedReport.definition}」</p>
            </div>

            <div className="report-section highlight">
              <div className="report-label">{language === 'zh' ? '💡 背後的需求' : '💡 Underlying Need'}</div>
              <div className="report-need">{savedReport.need}</div>
            </div>

            <div className="report-row">
              <div className="report-section half">
                <div className="report-label">{language === 'zh' ? '強度' : 'Intensity'}</div>
                <div className="report-intensity" style={{ color: selectedCategory.color }}>
                  {savedReport.intensity}/10
                </div>
              </div>
              <div className="report-section half">
                <div className="report-label">{language === 'zh' ? '身體部位' : 'Body Part'}</div>
                <div className="report-body">{getBodyPartLabel(savedReport.bodyPart)}</div>
              </div>
            </div>

            <div className="report-insight">
              <p>
                {language === 'zh' 
                  ? `💬 當你感到「${savedReport.emotion}」時，你的內心正在呼喚「${savedReport.need}」。試著在生活中多給自己這份滋養吧！`
                  : `💬 When you feel "${savedReport.emotion}", your heart is calling for "${savedReport.need}". Try to nurture this need in your life!`}
              </p>
            </div>
          </div>

          <div className="report-actions">
            <button className="secondary-btn" onClick={() => navigate('/profile')}>
              {language === 'zh' ? '查看所有報告' : 'View All Reports'}
            </button>
            <button className="primary-btn" onClick={() => navigate('/')}>
              {language === 'zh' ? '完成' : 'Done'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .category-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .category-btn { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 20px 15px; border-radius: 16px; border: 2px solid; background: white; cursor: pointer; font-size: 15px; transition: transform 0.2s; }
        .category-btn:hover { transform: scale(1.02); }
        .category-header { display: flex; align-items: center; gap: 10px; padding: 12px 15px; border-radius: 12px; margin-bottom: 15px; }
        .emotion-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-height: 350px; overflow-y: auto; padding-bottom: 10px; }
        .emotion-btn { padding: 15px; border-radius: 12px; border: 1px solid #ddd; background: white; cursor: pointer; text-align: left; transition: all 0.2s; }
        .emotion-btn:hover { background: #f5f5f5; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .emotion-name { font-weight: bold; font-size: 16px; margin-bottom: 4px; }
        .emotion-hint { font-size: 12px; color: #888; }
        .back-btn { width: 100%; padding: 12px; background: white; color: #666; border: 1px solid #ddd; border-radius: 50px; cursor: pointer; margin-top: 15px; font-size: 14px; }
        
        .confirmation-card { background: white; padding: 30px; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); text-align: center; }
        .confirmation-icon { font-size: 48px; margin-bottom: 15px; }
        .definition-box { background: #f8f9fa; padding: 20px; border-radius: 16px; margin: 20px 0; }
        .definition-text { font-style: italic; color: #555; margin-top: 10px; line-height: 1.6; }
        .confirm-buttons { display: flex; flex-direction: column; gap: 12px; margin-top: 25px; }
        .confirm-yes { padding: 16px; background: var(--color-sage-green); color: white; border: none; border-radius: 50px; font-size: 16px; font-weight: bold; cursor: pointer; }
        .confirm-no { padding: 14px; background: white; color: #666; border: 1px solid #ddd; border-radius: 50px; font-size: 14px; cursor: pointer; }
        
        .revelation-card { background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%); padding: 30px; border-radius: 24px; text-align: center; margin-bottom: 20px; }
        .revelation-icon { font-size: 48px; margin-bottom: 10px; }
        .emotion-summary { display: flex; align-items: center; justify-content: center; gap: 10px; margin: 15px 0; }
        .need-revelation { margin: 25px 0; }
        .need-intro { color: #555; margin-bottom: 15px; }
        .need-highlight { font-size: 22px; font-weight: bold; color: var(--color-sage-dark); background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
        .healing-message { font-size: 14px; color: #666; margin-top: 20px; line-height: 1.6; padding: 0 10px; }
        
        .intensity-display { font-size: 64px; font-weight: bold; margin: 20px 0; }
        .intensity-slider { width: 100%; height: 8px; margin: 20px 0; }
        .intensity-labels { display: flex; justify-content: space-between; color: #888; font-size: 14px; }
        .high-intensity-alert { background: var(--color-crisis-red); color: white; padding: 12px; border-radius: 12px; margin: 20px 0; }
        
        .report-card { background: white; border-radius: 24px; padding: 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); margin-bottom: 20px; }
        .report-header { text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
        .report-header h2 { margin: 10px 0 5px; }
        .report-time { color: #888; font-size: 13px; margin: 0; }
        .report-section { margin-bottom: 20px; }
        .report-section.half { flex: 1; }
        .report-section.highlight { background: var(--color-sage-light); padding: 20px; border-radius: 16px; }
        .report-label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .report-value { font-size: 18px; }
        .report-value-large { font-size: 24px; font-weight: bold; }
        .report-definition { font-style: italic; color: #666; font-size: 14px; margin-top: 8px; }
        .report-need { font-size: 20px; font-weight: bold; color: var(--color-sage-dark); }
        .report-row { display: flex; gap: 20px; }
        .report-intensity { font-size: 32px; font-weight: bold; }
        .report-body { font-size: 18px; font-weight: 600; }
        .report-insight { background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); padding: 20px; border-radius: 16px; margin-top: 20px; }
        .report-insight p { margin: 0; line-height: 1.6; font-size: 14px; }
        .report-actions { display: flex; gap: 12px; }
        
        .primary-btn { flex: 1; padding: 16px; background: var(--color-ink-black); color: white; border: none; border-radius: 50px; cursor: pointer; font-size: 16px; font-weight: 600; }
        .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .secondary-btn { flex: 1; padding: 16px; background: white; color: var(--color-ink-black); border: 2px solid var(--color-ink-black); border-radius: 50px; cursor: pointer; font-size: 16px; }
        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default EmotionScan;

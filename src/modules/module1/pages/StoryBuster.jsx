import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppProvider';
import StorageService from '../../../services/StorageService';
import { getRandomQuestions } from '../../../data/storyBusterQuiz';
import BackButton from '../../../components/BackButton';

const StoryBuster = () => {
  const navigate = useNavigate();
  const { t, addXp, language } = useApp();
  
  // Game modes
  const [mode, setMode] = useState('menu'); // menu, quiz, practice, result
  
  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  
  // Practice mode state
  const [thought, setThought] = useState('');
  const [fact, setFact] = useState('');
  const [practicePhase, setPracticePhase] = useState('input');

  const startQuiz = (category = null) => {
    const quizQuestions = getRandomQuestions(10, category);
    setQuestions(quizQuestions);
    setCurrentIndex(0);
    setScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setMode('quiz');
  };

  const handleAnswer = (isFact) => {
    const currentQ = questions[currentIndex];
    const isCorrect = isFact === currentQ.is_fact;
    
    setSelectedAnswer(isFact);
    setShowExplanation(true);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      addXp(5);
    }
    
    setAnswers(prev => [...prev, { 
      question: currentQ, 
      userAnswer: isFact, 
      isCorrect 
    }]);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz complete
      const finalScore = score + (selectedAnswer === questions[currentIndex].is_fact ? 0 : 0);
      StorageService.saveLog('module1', {
        tool: 'Story Buster',
        type: 'quiz',
        score: finalScore,
        total: questions.length,
        percentage: Math.round((finalScore / questions.length) * 100)
      });
      addXp(20);
      setMode('result');
    }
  };

  const handlePracticeSubmit = () => {
    if (thought.trim()) setPracticePhase('rewrite');
  };

  const handlePracticeComplete = () => {
    StorageService.saveLog('module1', {
      tool: 'Story Buster',
      type: 'practice',
      original_thought: thought,
      fact: fact
    });
    addXp(30);
    setMode('result');
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="page-container">
      <header className="page-header">
        {mode === 'menu' ? (
          <BackButton />
        ) : (
          <button 
            className="back-btn"
            onClick={() => setMode('menu')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0 10px 0 0',
              color: 'var(--color-ink-black)',
              display: 'flex',
              alignItems: 'center'
            }}
          >←</button>
        )}
        <h2>{t('module1.story_buster.title')}</h2>
      </header>

      {/* Menu */}
      {mode === 'menu' && (
        <div className="fade-in">
          <div className="intro-card">
            <div className="intro-icon">🎬</div>
            <h3>{language === 'zh' ? '攝影機測試' : 'The Camera Test'}</h3>
            <p>{language === 'zh' 
              ? '事實是攝影機可以拍到的。故事是你大腦編出來的。'
              : 'Facts are what a camera can capture. Stories are what your brain creates.'}</p>
          </div>

          <div className="menu-options">
            <button className="menu-btn quiz" onClick={() => startQuiz()}>
              <span className="menu-icon">🧩</span>
              <div className="menu-text">
                <strong>{language === 'zh' ? '挑戰模式' : 'Quiz Challenge'}</strong>
                <span>{language === 'zh' ? '10 題隨機測驗' : '10 random questions'}</span>
              </div>
            </button>

            <button className="menu-btn practice" onClick={() => { setMode('practice'); setPracticePhase('input'); setThought(''); setFact(''); }}>
              <span className="menu-icon">✍️</span>
              <div className="menu-text">
                <strong>{language === 'zh' ? '自由練習' : 'Free Practice'}</strong>
                <span>{language === 'zh' ? '分析你自己的想法' : 'Analyze your own thoughts'}</span>
              </div>
            </button>
          </div>

          <h4 style={{ marginTop: '30px', marginBottom: '15px', color: '#666' }}>
            {language === 'zh' ? '按類別練習' : 'Practice by Category'}
          </h4>
          
          <div className="category-btns">
            <button onClick={() => startQuiz('behavior_intent')}>
              {language === 'zh' ? '行為vs意圖' : 'Behavior vs Intent'}
            </button>
            <button onClick={() => startQuiz('adjective_data')}>
              {language === 'zh' ? '形容詞vs數據' : 'Adjective vs Data'}
            </button>
            <button onClick={() => startQuiz('future_present')}>
              {language === 'zh' ? '預測vs當下' : 'Future vs Present'}
            </button>
            <button onClick={() => startQuiz('self_attack')}>
              {language === 'zh' ? '自我攻擊' : 'Self-Attack'}
            </button>
            <button onClick={() => startQuiz('advanced')}>
              {language === 'zh' ? '⚡ 高級陷阱' : '⚡ Advanced'}
            </button>
          </div>
        </div>
      )}

      {/* Quiz Mode */}
      {mode === 'quiz' && currentQ && (
        <div className="fade-in">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
          </div>
          <div className="progress-text">{currentIndex + 1} / {questions.length}</div>

          <div className="question-card">
            <div className="question-text">
              「{language === 'zh' ? currentQ.question_zh : currentQ.question_en}」
            </div>
          </div>

          {!showExplanation ? (
            <div className="answer-buttons">
              <button className="answer-btn fact" onClick={() => handleAnswer(true)}>
                <span className="btn-icon">📷</span>
                <span>{language === 'zh' ? '事實' : 'Fact'}</span>
              </button>
              <button className="answer-btn story" onClick={() => handleAnswer(false)}>
                <span className="btn-icon">📖</span>
                <span>{language === 'zh' ? '故事' : 'Story'}</span>
              </button>
            </div>
          ) : (
            <div className={`explanation-card ${selectedAnswer === currentQ.is_fact ? 'correct' : 'wrong'}`}>
              <div className="result-icon">
                {selectedAnswer === currentQ.is_fact ? '✅' : '❌'}
              </div>
              <div className="result-text">
                {selectedAnswer === currentQ.is_fact 
                  ? (language === 'zh' ? '正確！' : 'Correct!')
                  : (language === 'zh' ? '答錯了！' : 'Wrong!')}
              </div>
              <div className="answer-label">
                {currentQ.is_fact 
                  ? (language === 'zh' ? '這是「事實」' : 'This is a "Fact"')
                  : (language === 'zh' ? '這是「故事」' : 'This is a "Story"')}
              </div>
              <div className="explanation-text">
                {language === 'zh' ? currentQ.explanation_zh : currentQ.explanation_en}
              </div>
              <button className="primary-btn" onClick={nextQuestion}>
                {currentIndex < questions.length - 1 
                  ? (language === 'zh' ? '下一題' : 'Next')
                  : (language === 'zh' ? '查看結果' : 'See Results')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Practice Mode */}
      {mode === 'practice' && (
        <div className="fade-in">
          {practicePhase === 'input' && (
            <>
              <h3>{language === 'zh' ? '輸入一個讓你痛苦的想法' : 'Enter a painful thought'}</h3>
              <textarea 
                value={thought} 
                onChange={e => setThought(e.target.value)}
                placeholder={language === 'zh' ? '例如：他不愛我了...' : "e.g., He doesn't love me anymore..."}
                className="thought-input"
              />
              <button className="primary-btn" onClick={handlePracticeSubmit} disabled={!thought.trim()}>
                {t('common.next')}
              </button>
            </>
          )}

          {practicePhase === 'rewrite' && (
            <>
              <div className="thought-display">
                <span className="label">{language === 'zh' ? '你的想法（故事）' : 'Your thought (Story)'}</span>
                <div className="thought-text">「{thought}」</div>
              </div>

              <div className="camera-prompt">
                <span className="camera-icon">🎬</span>
                <p>{language === 'zh' 
                  ? '攝影機只能拍到什麼？把它改寫成不帶形容詞的客觀事實。'
                  : 'What can a camera see? Rewrite it as an objective fact without adjectives.'}</p>
              </div>

              <textarea 
                value={fact} 
                onChange={e => setFact(e.target.value)}
                placeholder={language === 'zh' ? '例如：他回家時沒有打招呼。' : 'e.g., He came home without greeting me.'}
                className="thought-input"
              />
              <button className="primary-btn" onClick={handlePracticeComplete} disabled={!fact.trim()}>
                {t('common.done')}
              </button>
            </>
          )}
        </div>
      )}

      {/* Result */}
      {mode === 'result' && (
        <div className="fade-in result-screen">
          <div className="result-card">
            <div className="result-emoji">
              {questions.length > 0 
                ? (score >= 8 ? '🏆' : score >= 5 ? '👍' : '💪')
                : '✨'}
            </div>
            
            {questions.length > 0 ? (
              <>
                <h2>{score} / {questions.length}</h2>
                <p className="result-percent">{Math.round((score / questions.length) * 100)}%</p>
                <p className="result-message">
                  {score >= 8 
                    ? (language === 'zh' ? '火眼金睛！你能精準分辨事實和故事。' : 'Eagle eyes! You can precisely distinguish facts from stories.')
                    : score >= 5 
                      ? (language === 'zh' ? '不錯！繼續練習會更好。' : 'Good! Keep practicing to improve.')
                      : (language === 'zh' ? '沒關係，這是學習的過程。多練習幾次！' : "It's okay, this is part of learning. Practice more!")}
                </p>
              </>
            ) : (
              <>
                <h2>{language === 'zh' ? '練習完成！' : 'Practice Complete!'}</h2>
                <div className="practice-result">
                  <div className="before-after">
                    <div className="before">
                      <span className="label">{language === 'zh' ? '故事' : 'Story'}</span>
                      <p>「{thought}」</p>
                    </div>
                    <div className="arrow">→</div>
                    <div className="after">
                      <span className="label">{language === 'zh' ? '事實' : 'Fact'}</span>
                      <p>「{fact}」</p>
                    </div>
                  </div>
                </div>
                <p className="result-message">
                  {language === 'zh' 
                    ? '你成功地把故事轉化為事實。這是自我覺察的第一步！' 
                    : 'You successfully transformed a story into a fact. This is the first step of self-awareness!'}
                </p>
              </>
            )}
          </div>

          <div className="result-actions">
            <button className="secondary-btn" onClick={() => setMode('menu')}>
              {language === 'zh' ? '再來一次' : 'Try Again'}
            </button>
            <button className="primary-btn" onClick={() => navigate('/profile')}>
              {language === 'zh' ? '查看報告' : 'View Report'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .intro-card { text-align: center; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 30px; border-radius: 20px; margin-bottom: 25px; }
        .intro-icon { font-size: 48px; margin-bottom: 10px; }
        .intro-card h3 { margin: 0 0 10px; }
        .intro-card p { margin: 0; color: #555; }
        
        .menu-options { display: flex; flex-direction: column; gap: 15px; }
        .menu-btn { display: flex; align-items: center; gap: 15px; padding: 20px; border-radius: 16px; border: 2px solid #eee; background: white; cursor: pointer; text-align: left; transition: all 0.2s; }
        .menu-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .menu-btn.quiz { border-color: var(--color-sage-green); }
        .menu-btn.practice { border-color: #64b5f6; }
        .menu-icon { font-size: 32px; }
        .menu-text { display: flex; flex-direction: column; }
        .menu-text strong { font-size: 16px; }
        .menu-text span { font-size: 13px; color: #888; }
        
        .category-btns { display: flex; flex-wrap: wrap; gap: 10px; }
        .category-btns button { padding: 10px 16px; border-radius: 20px; border: 1px solid #ddd; background: white; font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .category-btns button:hover { background: #f5f5f5; }
        
        .progress-bar { height: 6px; background: #eee; border-radius: 3px; overflow: hidden; margin-bottom: 10px; }
        .progress-fill { height: 100%; background: var(--color-sage-green); transition: width 0.3s ease; }
        .progress-text { text-align: center; font-size: 14px; color: #888; margin-bottom: 20px; }
        
        .question-card { background: white; padding: 40px 25px; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); text-align: center; margin-bottom: 25px; }
        .question-text { font-size: 22px; font-weight: 600; line-height: 1.5; }
        
        .answer-buttons { display: flex; gap: 15px; }
        .answer-btn { flex: 1; padding: 25px 20px; border-radius: 16px; border: none; background: white; box-shadow: 0 4px 15px rgba(0,0,0,0.1); cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 10px; font-size: 18px; font-weight: bold; transition: all 0.2s; }
        .answer-btn:hover { transform: translateY(-3px); }
        .answer-btn.fact { color: var(--color-sage-dark); }
        .answer-btn.story { color: #e57373; }
        .btn-icon { font-size: 32px; }
        
        .explanation-card { padding: 25px; border-radius: 20px; text-align: center; }
        .explanation-card.correct { background: #e8f5e9; border: 2px solid var(--color-sage-green); }
        .explanation-card.wrong { background: #ffebee; border: 2px solid #ef5350; }
        .result-icon { font-size: 48px; margin-bottom: 10px; }
        .result-text { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
        .answer-label { font-size: 16px; color: #666; margin-bottom: 15px; }
        .explanation-text { background: white; padding: 15px; border-radius: 12px; font-size: 14px; line-height: 1.6; margin-bottom: 15px; }
        
        .thought-input { width: 100%; height: 120px; padding: 15px; border-radius: 16px; border: 2px solid #eee; font-size: 16px; font-family: inherit; margin-bottom: 10px; resize: none; }
        .thought-input:focus { border-color: var(--color-sage-green); outline: none; }
        
        .thought-display { background: #fff3e0; padding: 20px; border-radius: 16px; margin-bottom: 20px; }
        .thought-display .label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
        .thought-display .thought-text { font-size: 18px; margin-top: 10px; font-style: italic; }
        
        .camera-prompt { background: #e3f2fd; padding: 20px; border-radius: 16px; margin-bottom: 20px; display: flex; align-items: flex-start; gap: 15px; }
        .camera-icon { font-size: 32px; }
        .camera-prompt p { margin: 0; line-height: 1.5; }
        
        .result-screen { text-align: center; }
        .result-card { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); margin-bottom: 20px; }
        .result-emoji { font-size: 64px; margin-bottom: 15px; }
        .result-card h2 { font-size: 48px; margin: 0; }
        .result-percent { font-size: 24px; color: var(--color-sage-dark); margin: 5px 0 15px; }
        .result-message { color: #666; line-height: 1.6; }
        
        .practice-result { margin: 20px 0; text-align: left; }
        .before-after { display: flex; align-items: center; gap: 10px; }
        .before, .after { flex: 1; background: #f5f5f5; padding: 15px; border-radius: 12px; }
        .after { background: var(--color-sage-light); }
        .before-after .label { font-size: 11px; color: #888; text-transform: uppercase; }
        .before-after p { margin: 8px 0 0; font-size: 14px; }
        .arrow { font-size: 24px; color: #ccc; }
        
        .result-actions { display: flex; gap: 12px; }
        .primary-btn { flex: 1; padding: 16px; background: var(--color-ink-black); color: white; border: none; border-radius: 50px; font-size: 16px; font-weight: 600; cursor: pointer; }
        .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .secondary-btn { flex: 1; padding: 16px; background: white; color: var(--color-ink-black); border: 2px solid var(--color-ink-black); border-radius: 50px; font-size: 16px; cursor: pointer; }
        
        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default StoryBuster;

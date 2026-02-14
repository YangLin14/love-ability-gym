import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppProvider';
import StorageService from '../../../services/StorageService';
import SimpleLineChart from '../../../components/SimpleLineChart';
import BackButton from '../../../components/BackButton';

const RapidAwareness = () => {
  const navigate = useNavigate();
  const { t, addXp } = useApp();
  
  // Form State
  const [form, setForm] = useState({
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    location: '',
    event: '',
    emotion: '',
    score: 0 
  });

  const [historyData, setHistoryData] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = () => {
    const logs = StorageService.getLogs('module1');
    const awarenessLogs = logs.filter(l => l.tool === 'Rapid Awareness');
    
    // Process last 14 days
    const last14Days = [];
    for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString();
        
        // Find max absolute score for this day
        const dayLogs = awarenessLogs.filter(l => new Date(l.timestamp).toLocaleDateString() === dateStr);
        let maxScore = 0;
        
        if (dayLogs.length > 0) {
            const scores = dayLogs.map(l => l.score);
            const maxAbs = Math.max(...scores.map(Math.abs));
            maxScore = scores.find(s => Math.abs(s) === maxAbs) || 0;
        }

        last14Days.push({
            label: `${d.getMonth() + 1}/${d.getDate()}`,
            score: maxScore,
            fullDate: dateStr
        });
    }
    setHistoryData(last14Days);
  };

  const handleSave = () => {
    if (!form.location || !form.event || !form.emotion) return;

    StorageService.saveLog('module1', {
      tool: 'Rapid Awareness',
      ...form,
      timestamp: new Date().toISOString()
    });
    
    addXp(20);
    alert('Recorded!');
    
    loadChartData();
    setForm(prev => ({
        ...prev,
        location: '', 
        event: '', 
        emotion: '',
        score: 0
    }));
  };


  return (
    <div className="page-container">
      <header className="page-header">
        <BackButton />
        <h2>{t('module1.rapid.title')}</h2>
      </header>

      {/* Toggle View */}
      <div style={{display: 'flex', background: '#eee', padding: '5px', borderRadius: '50px', marginBottom: '20px'}}>
         <button 
           onClick={() => setShowHistory(false)}
           style={{flex: 1, padding: '10px', borderRadius: '40px', border: 'none', background: !showHistory ? 'white' : 'transparent', fontWeight: !showHistory ? 'bold' : 'normal', cursor: 'pointer'}}
         >
           Record
         </button>
         <button 
           onClick={() => setShowHistory(true)}
           style={{flex: 1, padding: '10px', borderRadius: '40px', border: 'none', background: showHistory ? 'white' : 'transparent', fontWeight: showHistory ? 'bold' : 'normal', cursor: 'pointer'}}
         >
           Chart (14 Days)
         </button>
      </div>

      {!showHistory ? (
        <div className="fade-in">
           {/* Time (Auto/Editable) */}
           <div className="form-group">
              <label>{t('module1.rapid.time')}</label>
              <input 
                value={form.time} 
                onChange={e => setForm({...form, time: e.target.value})}
                style={inputStyle}
              />
           </div>

           {/* Location */}
           <div className="form-group">
              <label>{t('module1.rapid.location')}</label>
              <input 
                placeholder={t('module1.rapid.location_ph')}
                value={form.location}
                onChange={e => setForm({...form, location: e.target.value})}
                style={inputStyle}
              />
           </div>

           {/* Event */}
           <div className="form-group">
              <label>{t('module1.rapid.event')}</label>
              <input 
                placeholder={t('module1.rapid.event_ph')}
                value={form.event}
                onChange={e => setForm({...form, event: e.target.value})}
                style={inputStyle}
              />
           </div>

           {/* Emotion */}
           <div className="form-group">
              <label>{t('module1.rapid.emotion')}</label>
              <input 
                placeholder={t('module1.rapid.emotion_ph')}
                value={form.emotion}
                onChange={e => setForm({...form, emotion: e.target.value})}
                style={inputStyle}
              />
           </div>

           {/* Score Slider (-10 to 10) */}
           <div className="form-group">
              <label>{t('module1.rapid.score')}: <span style={{fontSize: '24px', fontWeight: 'bold', color: form.score > 0 ? 'var(--color-sage-dark)' : (form.score < 0 ? '#c62828' : '#666')}}>{form.score}</span></label>
              <input 
                type="range" 
                min="-10" 
                max="10" 
                value={form.score} 
                onChange={e => setForm({...form, score: parseInt(e.target.value)})}
                style={{width: '100%', accentColor: 'var(--color-sage-dark)', margin: '15px 0'}}
              />
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999'}}>
                 <span>-10 (Negative)</span>
                 <span>0 (Calm)</span>
                 <span>+10 (Positive)</span>
              </div>
           </div>

           <button 
             className="primary-btn" 
             onClick={handleSave}
             disabled={!form.location || !form.event || !form.emotion}
           >
             {t('common.save')}
           </button>
        </div>
      ) : (
        <div className="fade-in chart-container" style={{background: 'white', padding: '20px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)'}}>
           <h3 style={{textAlign: 'center', marginBottom: '20px'}}>{t('module1.rapid.chart_title')}</h3>
           <div style={{width: '100%', height: '250px'}}>
              <SimpleLineChart data={historyData} />
           </div>
           <p style={{fontSize: '12px', color: '#999', marginTop: '10px', textAlign: 'center'}}>
             {t('module1.rapid.chart_desc')}
           </p>
        </div>
      )}

      <style>{`
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: bold; color: #555; }
        .primary-btn { width: 100%; padding: 15px; background: var(--color-ink-black); color: white; border: none; border-radius: 50px; cursor: pointer; font-size: 16px; margin-top: 10px; }
        .primary-btn:disabled { opacity: 0.5; }
        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ccc', fontSize: '16px' };

export default RapidAwareness;

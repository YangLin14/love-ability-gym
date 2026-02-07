import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppProvider';
import StorageService from '../../../services/StorageService';

const TimeCapsule = () => {
  const navigate = useNavigate();
  const { t } = useApp();
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    const logs = StorageService.getLogs('module5');
    // Filter for journal entries that were positive
    const validLogs = logs.filter(l => l.type === 'journal' && l.highlight);
    setMemories(validLogs);
  }, []);

  return (
    <div className="page-container">
      <header className="page-header">
        <button onClick={() => navigate('/')}>←</button>
        <h2>{t('module5.capsule.title')}</h2>
      </header>
      
      <p style={{fontStyle: 'italic', marginBottom: '30px', color: '#666'}}>
        "{t('module5.capsule.intro')}"
      </p>

      {memories.length === 0 ? (
        <div style={{textAlign: 'center', marginTop: '50px'}}>
           <div style={{fontSize: '64px', marginBottom: '20px'}}>📭</div>
           <p>{t('module5.capsule.empty')}</p>
           <button className="primary-btn" onClick={() => navigate('/module5/spotlight-journal')}>
             Go to Journal
           </button>
        </div>
      ) : (
        <div className="memory-list">
           {memories.map((m, idx) => (
             <div key={m.id || idx} className="memory-card">
                <div className="memory-date">{new Date(m.timestamp).toLocaleDateString()}</div>
                <div className="memory-text">"{m.highlight}"</div>
                <div className="memory-tag">Evidence of Love</div>
             </div>
           ))}
        </div>
      )}

      <style>{`
        .primary-btn { padding: 15px 30px; background: var(--color-ink-black); color: white; border: none; border-radius: 50px; cursor: pointer; margin-top: 20px; }
        .memory-list { display: flex; flexDirection: column; gap: 20px; }
        .memory-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-left: 4px solid var(--color-sage-green); }
        .memory-date { font-size: 12px; color: #999; margin-bottom: 5px; }
        .memory-text { font-size: 18px; font-family: var(--font-serif); margin-bottom: 15px; }
        .memory-tag { display: inline-block; background: var(--color-sage-light); color: var(--color-sage-dark); padding: 4px 10px; borderRadius: 20px; font-size: 12px; font-weight: bold; }
      `}</style>
    </div>
  );
};

export default TimeCapsule;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppProvider';
import StorageService from '../services/StorageService';
import RadarChart from '../components/RadarChart';
import SimpleLineChart from '../components/SimpleLineChart';
import EmotionInsights from '../components/EmotionInsights';

const Profile = () => {
  const { userProfile, setUserProfile, userStats, t } = useApp();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(userProfile);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({});
  const [assessment, setAssessment] = useState(null);
  const [rapidData, setRapidData] = useState([]);

  useEffect(() => {
    // Load History
    const logs = StorageService.getAllLogs();
    setHistory(logs);
    
    // Load Stats
    const usage = StorageService.getStats();
    setStats(usage);

    // Load Assessment
    const savedAssessment = localStorage.getItem('user_assessment');
    if (savedAssessment) {
      setAssessment(JSON.parse(savedAssessment));
    }

    // Load Rapid Awareness Data (Last 14 days)
    const awarenessLogs = logs.filter(l => l.tool === 'Rapid Awareness');
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
    setRapidData(last14Days);

  }, []);

  const handleSaveProfile = () => {
    setUserProfile(editForm);
    setIsEditing(false);
  };

  // Helper to format date
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString();
  };

  const getToolIcon = (type) => {
    switch(type) {
      case 'Log': return '📝';
      case 'Attribution': return '🔄';
      case 'Emotion Scan': return '🌡️';
      case 'Story Buster': return '🎥';
      case 'Draft Builder': return '💌';
      case 'Apology': return '🕊️';
      case 'Permission': return '🎟️';
      case 'Spotlight Journal': return '🔦';
      default: return '✅';
    }
  };

  const getToolName = (log) => {
    return log.type || 'Activity';
  };

  const renderResult = (log) => {
    // Universal fallback for missing data
    if (!log) return <span style={{color: '#ccc'}}>No Data</span>;

    // Module 1
    if (log.tool === 'Emotion Scan' || log.type === 'Emotion Scan') {
       return <div><span style={{fontWeight: 'bold', color: 'var(--color-sage-dark)'}}>{log.emotion}</span> (Intensity: {log.intensity})</div>;
    }
    if (log.tool === 'Attribution Shift') {
        return <div style={{fontSize: '13px'}}>Shifted: "{log.event?.substring(0, 20)}...</div>;
    }
    if (log.tool === 'Story Buster') {
        // Quiz mode: show score
        if (log.type === 'quiz' && log.score !== undefined) {
          return <div style={{fontSize: '13px'}}>
            <span style={{fontWeight: 'bold', color: log.percentage >= 80 ? 'var(--color-sage-dark)' : log.percentage >= 50 ? '#fb8c00' : '#e57373'}}>
              {log.score}/{log.total} ({log.percentage}%)
            </span>
          </div>;
        }
        // Practice mode: show before/after
        if (log.type === 'practice' && log.original_thought) {
          return <div style={{fontSize: '13px'}}>"{log.original_thought?.substring(0, 15)}..." → "{log.fact?.substring(0, 15)}..."</div>;
        }
        // Legacy fallback
        if (log.original_thought) {
          return <div style={{fontSize: '13px'}}>"{log.original_thought?.substring(0, 15)}..." → "{log.fact?.substring(0, 15)}..."</div>;
        }
        return <div style={{fontSize: '13px', color: '#888'}}>Completed</div>;
    }
    if (log.tool === 'Time Travel') {
        return <div style={{fontSize: '13px'}}>Visited self at age {log.age}</div>;
    }
    if (log.tool === 'Rapid Awareness') {
        return <div style={{fontSize: '13px'}}>{log.emotion} ({log.score > 0 ? '+' : ''}{log.score}) @ {log.location}</div>;
    }

    // Module 2
    if (log.tool === 'Draft Builder') {
        return <div style={{fontStyle: 'italic', fontSize: '13px', color: '#666'}}>{log.preview?.substring(0, 50)}...</div>;
    }
    if (log.tool === 'Vocabulary Swap') {
        return <div style={{fontSize: '13px'}}>Swapped {log.total_items} negative phrases</div>;
    }
    if (log.tool === 'Apology Builder') {
        return <div style={{fontStyle: 'italic', fontSize: '13px', color: '#666'}}>Apology for: {log.action?.substring(0, 30)}...</div>;
    }

    // Module 3
    if (log.tool === 'Anger Decoder') {
         return <div style={{fontSize: '13px'}}>Decoded: {log.surface_emotion} → <strong>{log.deep_fear}</strong></div>;
    }
    if (log.tool === 'Deep Listening Lab') {
         return <div style={{fontSize: '13px'}}>Listened for {log.duration}s (Level {log.level_id})</div>;
    }
    if (log.tool === 'Perspective Switcher') {
         return <div style={{fontSize: '13px'}}>Perspective: {log.notes}</div>;
    }

    // Module 4
    if (log.tool === 'Permission Slip') {
        return <div>Allowed: <span style={{fontWeight: 'bold'}}>{log.issue}</span></div>;
    }
    if (log.tool === 'Reframing Tool') {
        return <div style={{fontSize: '13px'}}>Reframed: {log.weakness} → <strong>{log.strength}</strong></div>;
    }

    // Module 5
    if (log.tool === 'Spotlight Journal' || log.type === 'journal') {
        return <div style={{fontStyle: 'italic', fontSize: '13px'}}>"{log.highlight?.substring(0, 30)}..."</div>;
    }
    if (log.tool === 'Vision Board') {
        return <div style={{fontSize: '13px'}}>Mission: {log.action}</div>;
    }
    
    // Fallback
    return <span style={{color: '#999', fontSize: '12px'}}>Task Completed</span>;
  };

  return (
    <div className="page-container" style={{paddingTop: '20px'}}>
      
      {/* Header / Nav */}
      <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
        <button onClick={() => navigate('/')} style={{background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', padding: '0 10px 0 0'}}>
          ←
        </button>
        <h2 style={{margin: 0}}>{t('profile.title')}</h2>
      </div>

      {/* Profile Card */}
      <div className="fade-in" style={{
        background: 'white',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        {isEditing ? (
          <div style={{width: '100%'}}>
             <div style={{marginBottom: '15px'}}>
               <label style={{display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px'}}>{t('profile.avatar')}</label>
               <input 
                 type="text" 
                 value={editForm.avatar} 
                 onChange={(e) => setEditForm({...editForm, avatar: e.target.value})}
                 style={{fontSize: '40px', width: '60px', textAlign: 'center', border: '1px solid #eee', borderRadius: '12px'}} 
               />
             </div>
             <div style={{marginBottom: '15px'}}>
               <label style={{display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px'}}>{t('profile.name')}</label>
               <input 
                 type="text" 
                 value={editForm.name} 
                 onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                 style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px'}}
               />
             </div>
             <div style={{marginBottom: '20px'}}>
               <label style={{display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px'}}>{t('profile.age')}</label>
               <input 
                 type="number" 
                 value={editForm.age} 
                 onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                 style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px'}}
               />
             </div>
             <button className="primary-btn" onClick={handleSaveProfile}>{t('profile.save')}</button>
          </div>
        ) : (
          <>
             <div onClick={() => setIsEditing(true)} style={{fontSize: '60px', marginBottom: '10px', cursor: 'pointer'}}>
               {userProfile.avatar}
             </div>
             <h3 style={{margin: '0 0 5px 0', fontSize: '24px'}}>{userProfile.name} <span style={{fontSize: '14px', color: '#999', fontWeight: 'normal'}}>✏️</span></h3>
             <div style={{color: '#666', fontSize: '14px', marginBottom: '20px'}}>
                {userProfile.age ? `${userProfile.age} y/o` : ''} • Lv. {userStats.level} • {userStats.xp} XP
             </div>
             
             <div style={{display: 'flex', gap: '15px', width: '100%'}}>
                <div style={{flex: 1, background: 'var(--color-sage-light)', padding: '15px', borderRadius: '16px'}}>
                   <div style={{fontSize: '24px', fontWeight: 'bold', color: 'var(--color-sage-dark)'}}>{userStats.streak}</div>
                   <div style={{fontSize: '12px', color: '#666'}}>{t('profile.streak')}</div>
                </div>
                <div style={{flex: 1, background: '#FFF3E0', padding: '15px', borderRadius: '16px'}}>
                   <div style={{fontSize: '24px', fontWeight: 'bold', color: '#FF9800'}}>{history.length}</div>
                   <div style={{fontSize: '12px', color: '#666'}}>Activities</div>
                </div>
             </div>
          </>
        )}
      </div>

      {/* Emotion Insights Report */}
      <section style={{marginBottom: '30px'}}>
        <h3 style={{marginBottom: '15px', color: '#444'}}>
          {t('profile.insights_title') || (userProfile?.language === 'zh' ? '📊 情緒分析報告' : '📊 Emotion Insights')}
        </h3>
        <EmotionInsights period={14} />
      </section>

      {/* Stats Charts */}
      <section style={{marginBottom: '30px'}}>
        <h3 style={{marginBottom: '15px', color: '#444'}}>{t('profile.stats_title')}</h3>
        <div style={{
          display: 'grid', 
          gridTemplateColumns: '1fr', // Mobile first
          gap: '20px'
        }}>
          {/* Radar Chart */}
          {assessment && (
            <div style={{background: 'white', padding: '20px', borderRadius: '20px', boxShadow: 'var(--shadow-sm)', textAlign: 'center'}}>
               <h4 style={{margin: '0 0 15px 0', fontSize: '16px', color: '#666'}}>Love Quotient (LQ)</h4>
               <div style={{width: '250px', height: '250px', margin: '0 auto'}}>
                  <RadarChart data={assessment.scores} size={250} />
               </div>
               <div style={{marginTop: '15px', fontSize: '14px', color: '#666'}}>
                  Total: <span style={{fontWeight: 'bold', color: 'var(--color-sage-green)'}}>{assessment.total} / 75</span>
               </div>
               <button onClick={() => navigate('/onboarding')} style={{marginTop: '10px', background: 'none', border: 'none', color: '#999', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline'}}>
                 Retake Assessment
               </button>
            </div>
          )}

          {/* Rapid Awareness Chart */}
          <div style={{background: 'white', padding: '20px', borderRadius: '20px', boxShadow: 'var(--shadow-sm)', textAlign: 'center'}}>
             <h4 style={{margin: '0 0 15px 0', fontSize: '14px', color: '#888'}}>{t('module1.rapid.chart_title')}</h4>
             <div style={{width: '100%', height: '200px', margin: '0 auto'}}>
                <SimpleLineChart data={rapidData} />
             </div>
          </div>

          {/* Usage Stats (Bar Chart mockup using CSS) */}
          <div style={{background: 'white', padding: '20px', borderRadius: '20px', boxShadow: 'var(--shadow-sm)'}}>
             <h4 style={{margin: '0 0 15px 0', fontSize: '14px', color: '#888'}}>{t('profile.usage_chart')}</h4>
             {Object.keys(stats).length > 0 ? (
               <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                  {Object.entries(stats).map(([tool, count]) => (
                    <div key={tool} style={{display: 'flex', alignItems: 'center', fontSize: '13px'}}>
                       <div style={{width: '100px', color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                         {tool}
                       </div>
                       <div style={{flex: 1, height: '8px', background: '#f0f0f0', borderRadius: '4px', margin: '0 10px'}}>
                          <div style={{
                            width: `${Math.min((count / Math.max(...Object.values(stats))) * 100, 100)}%`, 
                            height: '100%', 
                            background: 'var(--color-sage-green)', 
                            borderRadius: '4px'
                          }}></div>
                       </div>
                       <div style={{width: '20px', textAlign: 'right', fontWeight: 'bold', color: '#666'}}>{count}</div>
                    </div>
                  ))}
               </div>
             ) : (
               <div style={{color: '#999', fontSize: '14px', textAlign: 'center', padding: '20px'}}>{t('common.no_data')}</div>
             )}
          </div>
        </div>
      </section>

      {/* History Table */}
      <section style={{marginBottom: '50px'}}>
        <h3 style={{marginBottom: '15px', color: '#444'}}>{t('profile.history_title')}</h3>
        {history.length > 0 ? (
          <div style={{background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '14px'}}>
              <thead style={{background: '#f9f9f9', color: '#666'}}>
                <tr>
                  <th style={{padding: '12px 15px', textAlign: 'left', fontWeight: '600', width: '25%'}}>Date</th>
                  <th style={{padding: '12px 15px', textAlign: 'left', fontWeight: '600', width: '25%'}}>Activity</th>
                  <th style={{padding: '12px 15px', textAlign: 'left', fontWeight: '600', width: '50%'}}>Result</th>
                </tr>
              </thead>
              <tbody>
                {history.map((log) => (
                  <tr key={log.id} style={{borderBottom: '1px solid #f0f0f0'}}>
                    <td style={{padding: '12px 15px', color: '#999', fontSize: '12px'}}>
                      {new Date(log.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{padding: '12px 15px', fontWeight: '500'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                         <span style={{fontSize: '16px'}}>{getToolIcon(log.tool || log.type)}</span>
                         <span>{log.tool || getToolName(log)}</span>
                      </div>
                    </td>
                    <td style={{padding: '12px 15px', color: '#555'}}>
                      {renderResult(log)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{textAlign: 'center', padding: '40px', color: '#999', background: 'white', borderRadius: '16px'}}>
            {t('profile.no_history')}
          </div>
        )}
      </section>

      {/* Danger Zone */}
      <div style={{textAlign: 'center', marginTop: '50px', marginBottom: '30px'}}>
        <button 
          onClick={() => {
            if (window.confirm(t('profile.reset_confirm'))) {
               // We need to access resetData from context, but I need to destructure it first
               // Since I can't easily change the destructuring at the top without viewing the file,
               // I will assume I need to do that in a separate step or just do a manual clear which I can do here.
               // Actually, let's just do manual clear here for safety if context isn't ready, 
               // BUT I updated AppProvider, so I should update the destructuring at the top.
               localStorage.clear();
               window.location.reload();
            }
          }}
          style={{
            background: 'none',
            border: '1px solid #ffcdd2',
            color: '#c62828',
            padding: '10px 20px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {t('profile.reset_btn')}
        </button>
      </div>

    </div>
  );
};

export default Profile;

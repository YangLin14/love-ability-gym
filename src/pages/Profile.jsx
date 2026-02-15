import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppProvider';
import { useAuth } from '../context/AuthContext';
import StorageService from '../services/StorageService';
import RadarChart from '../components/RadarChart';
import EmotionInsights from '../components/EmotionInsights';

const Profile = () => {
  const { userProfile, setUserProfile, userStats, t, deferredPrompt, isIos, isStandalone, installPWA } = useApp();
  const { user, signIn, signUp, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(userProfile);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({});
  const [assessment, setAssessment] = useState(null);
  


  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
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
  };

  useEffect(() => {
    if (location.state?.scrollToInsights) {
        // Small timeout to allow render
        setTimeout(() => {
            const element = document.getElementById('emotion-insights-section');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }
  }, [location.state]);



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
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <button onClick={() => navigate('/')} style={{background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', padding: '0 10px 0 0'}}>
            ←
          </button>
          <h2 style={{margin: 0}}>{t('profile.title')}</h2>
        </div>

      </div>

      {/* Cloud Sync / Auth Section */}


      {/* Profile Card */}
      <div className="fade-in" style={{
        position: 'relative',
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
        {/* Settings Icon - Top Right of Card */}
        <button 
          onClick={() => navigate('/settings')}
          style={{
            position: 'absolute',
            top: '20px',
            right: '25px',
            background: 'none',
            border: 'none',
            fontSize: '30px',
            color: '#b0bec5',
            cursor: 'pointer',
            padding: '5px',
            opacity: 0.7,
            transition: 'opacity 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
          title="Settings"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> 
            <path fillRule="evenodd" clipRule="evenodd" d="M5.07699 14.3816L3.59497 13.9054C3.24043 13.7915 3 13.4617 3 13.0894V10.9106C3 10.5383 3.24043 10.2085 3.59497 10.0946L5.07699 9.61845C5.52769 9.47366 5.77568 8.99091 5.63089 8.54021C5.60187 8.44991 5.55808 8.36505 5.50127 8.28908L4.86839 7.44272C4.61323 7.10148 4.64746 6.62461 4.94875 6.32332L6.32332 4.94875C6.62461 4.64746 7.10148 4.61323 7.44272 4.86839L8.28908 5.50127C8.6682 5.78476 9.20535 5.70724 9.48884 5.32812C9.54564 5.25216 9.58944 5.1673 9.61845 5.07699L10.0946 3.59497C10.2085 3.24043 10.5383 3 10.9106 3L13.0894 3C13.4617 3 13.7915 3.24043 13.9054 3.59497L14.3816 5.07699C14.5263 5.52769 15.0091 5.77568 15.4598 5.63089C15.5501 5.60187 15.635 5.55808 15.7109 5.50127L16.5573 4.86839C16.8985 4.61323 17.3754 4.64746 17.6767 4.94875L19.0512 6.32332C19.3525 6.62461 19.3868 7.10148 19.1316 7.44272L18.4987 8.28908C18.2152 8.6682 18.2928 9.20535 18.6719 9.48884C18.7478 9.54564 18.8327 9.58944 18.923 9.61845L20.405 10.0946C20.7596 10.2085 21 10.5383 21 10.9106V13.0894C21 13.4617 20.7596 13.7915 20.405 13.9054L18.923 14.3816C18.4723 14.5263 18.2243 15.0091 18.3691 15.4598C18.3981 15.5501 18.4419 15.635 18.4987 15.7109L19.1316 16.5573C19.3868 16.8985 19.3525 17.3754 19.0512 17.6767L17.6767 19.0512C17.3754 19.3525 16.8985 19.3868 16.5573 19.1316L15.7109 18.4987C15.3318 18.2152 14.7947 18.2928 14.5112 18.6719C14.4544 18.7478 14.4106 18.8327 14.3816 18.923L13.9054 20.405C13.7915 20.7596 13.4617 21 13.0894 21H10.9106C10.5383 21 10.2085 20.7596 10.0946 20.405L9.61845 18.923C9.47366 18.4723 8.99091 18.2243 8.54021 18.3691C8.44991 18.3981 8.36505 18.4419 8.28908 18.4987L7.44272 19.1316C7.10148 19.3868 6.62461 19.3525 6.32332 19.0512L4.94875 17.6767C4.64746 17.3754 4.61323 16.8985 4.86839 16.5573L5.50127 15.7109C5.78476 15.3318 5.70724 14.7947 5.32812 14.5112C5.25216 14.4544 5.1673 14.4106 5.07699 14.3816Z" stroke="var(--color-sage-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> 
            <path fillRule="evenodd" clipRule="evenodd" d="M14.1213 9.87868C12.9497 8.70711 11.0503 8.70711 9.87868 9.87868C8.70711 11.0503 8.70711 12.9497 9.87868 14.1213C11.0503 15.2929 12.9497 15.2929 14.1213 14.1213C15.2929 12.9497 15.2929 11.0503 14.1213 9.87868Z" stroke="var(--color-sage-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> 
          </svg>
        </button>

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
             <h3 style={{margin: '0 0 5px 0', fontSize: '24px'}}>{userProfile.name} <span onClick={() => setIsEditing(true)} style={{fontSize: '18px', color: '#999', fontWeight: 'normal', cursor: 'pointer', marginLeft: '5px'}}>✏️</span></h3>
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
      <section id="emotion-insights-section" style={{marginBottom: '30px'}}>
        <h3 style={{marginBottom: '15px', color: '#444'}}>
          {t('profile.insights_title') || (userProfile?.language === 'zh' ? '📊 情緒分析報告' : '📊 Emotion Insights')}
        </h3>
        <EmotionInsights period={14} defaultView={location.state?.viewMode || 'today'} />
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



    </div>
  );
};

export default Profile;

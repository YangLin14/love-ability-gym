import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppProvider';

const Dashboard = () => {
  const { userStats, t, toggleLanguage, language } = useApp();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const saved = localStorage.getItem('user_assessment');
    if (saved) {
      setAssessment(JSON.parse(saved));
    }
  }, []);

  const modules = [
    { id: 'all', label: t('common.all') || 'All', icon: '♾️' },
    { id: 'module1', label: t('module1.short') || 'Awareness', icon: '🌱' },
    { id: 'module2', label: t('module2.short') || 'Expression', icon: '🗣️' },
    { id: 'module3', label: t('module3.short') || 'Empathy', icon: '❤️' },
    { id: 'module4', label: t('module4.short') || 'Allowing', icon: '🌊' },
    { id: 'module5', label: t('module5.short') || 'Influence', icon: '🌟' },
  ];

  const tools = [
    // Module 1
    { id: 'attribution', moduleId: 'module1', path: '/module1/attribution', title: t('module1.attribution.title'), icon: '🔄', color: '#E8F5E9' },
    { id: 'emotion-scan', moduleId: 'module1', path: '/module1/emotion-scan', title: t('module1.emotion_scan.title'), icon: '🌡️', color: '#F1F8E9' },
    { id: 'story-buster', moduleId: 'module1', path: '/module1/story-buster', title: t('module1.story_buster.title'), icon: '🎥', color: '#E0F2F1' },
    { id: 'time-travel', moduleId: 'module1', path: '/module1/time-travel', title: t('module1.time_travel.title'), icon: '⏳', color: '#EFEBE9' },
    { id: 'happiness-scale', moduleId: 'module1', path: '/module1/happiness-scale', title: t('module1.happiness_scale.title'), icon: '⚖️', color: '#FFF3E0' },
    { id: 'rapid-awareness', moduleId: 'module1', path: '/module1/rapid-awareness', title: t('module1.rapid.title'), icon: '⚡', color: '#F3E5F5' },
    
    // Module 2
    { id: 'draft-builder', moduleId: 'module2', path: '/module2/draft-builder', title: t('module2.draft_builder.title'), icon: '💌', color: '#FFF8E1' },
    { id: 'vocabulary-swap', moduleId: 'module2', path: '/module2/vocabulary-swap', title: t('module2.vocabulary.title'), icon: '🔤', color: '#F3E5F5' },
    { id: 'apology-builder', moduleId: 'module2', path: '/module2/apology-builder', title: t('module2.apology.title'), icon: '🕊️', color: '#E3F2FD' },

    // Module 3
    { id: 'anger-decoder', moduleId: 'module3', path: '/module3/anger-decoder', title: t('module3.anger_decoder.title'), icon: '🧘', color: '#FFEBEE' },
    { id: 'deep-listening', moduleId: 'module3', path: '/module3/deep-listening', title: t('module3.deep_listening.title'), icon: '👂', color: '#E1F5FE' },
    { id: 'perspective-switcher', moduleId: 'module3', path: '/module3/perspective-switcher', title: t('module3.perspective.title'), icon: '👓', color: '#F9FBE7' },

    // Module 4
    { id: 'permission-slip', moduleId: 'module4', path: '/module4/permission-slip', title: t('module4.permission.title'), icon: '🎟️', color: '#FCE4EC' },
    { id: 'reframing-tool', moduleId: 'module4', path: '/module4/reframing-tool', title: t('module4.reframe.title'), icon: '🃏', color: '#F3E5F5' },

    // Module 5
    { id: 'spotlight-journal', moduleId: 'module5', path: '/module5/spotlight-journal', title: t('module5.journal.title'), icon: '🔦', color: '#FFFDE7' },
    { id: 'time-capsule', moduleId: 'module5', path: '/module5/time-capsule', title: t('module5.capsule.title'), icon: '💊', color: '#E0F7FA' },
    { id: 'vision-board', moduleId: 'module5', path: '/module5/vision-board', title: t('module5.vision.title'), icon: '🗺️', color: '#E8EAF6' },
  ];

  const filteredTools = activeTab === 'all' ? tools : tools.filter(t => t.moduleId === activeTab);

  return (
    <div className="page-container" style={{paddingTop: '10px'}}>
      {/* Header */}
      <header style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px'}}>Gym Dashboard</div>
          <h1 style={{ margin: '5px 0 0', fontSize: '24px' }}>{t('dashboard.greeting')}</h1>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
           <div 
             onClick={() => navigate('/profile')}
             style={{ 
               cursor: 'pointer',
               background: assessment ? 'var(--color-sage-light)' : '#f0f0f0',
               padding: '5px 10px',
               borderRadius: '12px',
               display: 'inline-block'
             }}
           >
              <span style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--color-sage-dark)' }}>Lv. {userStats.level}</span>
              {assessment && <span style={{ fontSize: '10px', color: '#666', marginLeft: '5px' }}>LQ: {assessment.total}</span>}
           </div>
           
           <button 
             onClick={toggleLanguage} 
             style={{
               background: 'none', 
               border: '1px solid #eee', 
               color: '#999', 
               fontSize: '11px', 
               padding: '2px 8px', 
               borderRadius: '10px',
               cursor: 'pointer',
               marginTop: '5px'
             }}
           >
             {language === 'en' ? 'CN' : 'EN'}
           </button>
        </div>
      </header>

      {/* Assessment / Stats Section */}
      <section style={{ marginBottom: '20px' }}>
        {!assessment && (
          <div 
             onClick={() => navigate('/onboarding')}
             style={{ 
               background: 'linear-gradient(135deg, var(--color-sage-dark) 0%, var(--color-sage-green) 100%)', 
               color: 'white', 
               padding: '24px 30px', 
               borderRadius: 'var(--radius-lg)',
               boxShadow: 'var(--shadow-md)',
               cursor: 'pointer',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'space-between',
               position: 'relative',
               overflow: 'hidden',
               border: '1px solid rgba(255,255,255,0.1)'
             }}
          >
             <div style={{zIndex: 1, position: 'relative'}}>
               <div style={{
                 background: 'rgba(255,255,255,0.2)', 
                 width: 'fit-content', 
                 padding: '4px 10px', 
                 borderRadius: '20px', 
                 fontSize: '11px', 
                 fontWeight: 'bold', 
                 marginBottom: '8px',
                 textTransform: 'uppercase',
                 letterSpacing: '1px'
               }}>
                 {t('dashboard.start_here')}
               </div>
               <h3 style={{ margin: '0 0 6px 0', color: 'white', fontSize: '20px', fontWeight: '700' }}>{t('dashboard.assessment_title')}</h3>
               <p style={{ margin: '0', fontSize: '14px', opacity: 0.9, fontWeight: '400' }}>{t('dashboard.assessment_desc')}</p>
             </div>
             
             <div style={{
               background: 'white',
               width: '50px',
               height: '50px',
               borderRadius: '50%',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               zIndex: 1,
               boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
             }}>
               <span style={{ fontSize: '24px' }}>👉</span>
             </div>

             {/* Decorative Background Elements */}
             <div style={{position: 'absolute', right: '-15px', bottom: '-25px', fontSize: '120px', opacity: '0.1', transform: 'rotate(-10deg)'}}>🏋️‍♀️</div>
             <div style={{position: 'absolute', left: '-20px', top: '-20px', width: '100px', height: '100px', background: 'white', opacity: '0.05', borderRadius: '50%'}}></div>
          </div>
        )}
      </section>

      {/* Focus Quote */}
      <section style={{ marginBottom: '25px' }}>
        <div style={{ 
          backgroundColor: 'var(--color-ink-black)', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '20px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
           <div style={{position: 'absolute', right: '-10px', top: '-10px', fontSize: '80px', opacity: '0.1'}}>❝</div>
           <p style={{ fontSize: '16px', fontFamily: 'var(--font-serif)', margin: 0, lineHeight: '1.5', fontStyle: 'italic' }}>
             {t('dashboard.focus_quote')}
           </p>
           <div style={{marginTop: '10px', fontSize: '12px', opacity: '0.7', textTransform: 'uppercase', letterSpacing: '1px'}}>{t('dashboard.focus_title')}</div>
        </div>
      </section>

      {/* Module Nav Bar */}
      <section style={{ marginBottom: '20px', overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '10px', scrollbarWidth: 'none' }} className="no-scrollbar">
         <div style={{display: 'inline-flex', gap: '10px'}}>
            {modules.map(mod => (
              <button
                key={mod.id}
                onClick={() => setActiveTab(mod.id)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '25px',
                  border: 'none',
                  background: activeTab === mod.id ? 'var(--color-sage-green)' : 'white',
                  color: activeTab === mod.id ? 'white' : '#666',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: activeTab === mod.id ? '0 4px 12px rgba(89, 149, 117, 0.4)' : '0 2px 5px rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                <span style={{marginRight: '6px'}}>{mod.icon}</span>
                {mod.label}
              </button>
            ))}
         </div>
      </section>

      {/* Tools Grid */}
      <section style={{ marginBottom: '30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {filteredTools.map(tool => (
            <Link key={tool.id} to={tool.path} style={{ textDecoration: 'none' }}>
              <div className="tool-card-modern" style={{
                 backgroundColor: 'white',
                 padding: '20px',
                 borderRadius: '20px',
                 boxShadow: '0 8px 16px rgba(0,0,0,0.04)',
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: '12px',
                 textAlign: 'center',
                 height: '140px',
                 transition: 'transform 0.2s ease',
                 border: `1px solid ${tool.color}`
              }}>
                <div style={{
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '16px', 
                  background: tool.color, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {tool.icon}
                </div>
                <div style={{
                   fontSize: '14px', 
                   fontWeight: '600', 
                   color: '#333',
                   lineHeight: '1.3'
                }}>
                  {tool.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>



      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .tool-card-modern:active { transform: scale(0.97); }
      `}</style>
    </div>
  );
};

export default Dashboard;

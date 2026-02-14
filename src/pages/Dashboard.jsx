import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppProvider';

const Dashboard = () => {
  const { userStats, t, toggleLanguage, language } = useApp();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('user_assessment');
    if (saved) {
      setAssessment(JSON.parse(saved));
    }
  }, []);

  const gardenModules = [
    { id: 'module1', title: t('module1.short') || 'Awareness', sub: 'Understand', icon: 'water_drop' },
    { id: 'module2', title: t('module2.short') || 'Expression', sub: 'Communicate', icon: 'graphic_eq' },
    { id: 'module3', title: t('module3.short') || 'Empathy', sub: 'Connect', icon: 'diversity_1' },
    { id: 'module4', title: t('module4.short') || 'Allowing', sub: 'Accept', icon: 'spa' },
  ];

  const module5 = {
    id: 'module5',
    title: t('module5.short') || 'Influence',
    sub: 'Impact & Flow',
    icon: 'blur_on'
  };

  // Get greeting based on time of day
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 18) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  // Format current date
  const getFormattedDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div className="page-container" style={{paddingTop: '10px', paddingBottom: '100px'}}>
      {/* Background Blobs */}
      <div className="background-blobs">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="blob-3"></div>
      </div>

      {/* Content */}
      <div style={{position: 'relative', zIndex: 10}}>

        {/* Header */}
        <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: '10px' }}>
          <div>
            <p style={{
              color: 'var(--color-moss-dark)',
              opacity: 0.7,
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              margin: '0 0 4px 0'
            }}>
              {getFormattedDate()}
            </p>
            <div style={{fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px'}}>Gym Dashboard</div>
            <h1 style={{
              margin: 0,
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '28px',
              color: 'var(--color-soft-charcoal)',
              lineHeight: 1.2,
              fontWeight: 400
            }}>
              {getTimeGreeting()} <br/>
              <span style={{fontStyle: 'normal', fontWeight: 300, color: 'var(--color-moss-dark)'}}>
                {t('dashboard.greeting').replace('Hello, ', '')}
              </span>
            </h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <div
              onClick={() => navigate('/profile')}
              style={{
                cursor: 'pointer',
                borderRadius: '50%',
                padding: '2px',
                background: 'white',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--color-moss-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--color-moss-light)'
              }}>
                <span style={{fontSize: '20px'}}>😊</span>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span style={{
                fontWeight: 600,
                fontSize: '13px',
                color: 'var(--color-moss-dark)',
                background: 'var(--color-moss-light)',
                padding: '3px 10px',
                borderRadius: '20px'
              }}>
                Lv. {userStats.level}
              </span>
              <button
                onClick={toggleLanguage}
                style={{
                  background: 'white',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-moss-dark)',
                  fontSize: '11px',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                {language === 'en' ? 'CN' : 'EN'}
              </button>
            </div>
          </div>
        </header>

        {/* Assessment Card */}
        <section style={{ marginBottom: '24px' }}>
          {!assessment && (
            <div
              onClick={() => navigate('/onboarding')}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-xl)',
                padding: '28px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'box-shadow 0.3s ease'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '120px',
                height: '120px',
                background: 'linear-gradient(to bottom right, rgba(184,207,179,0.3), transparent)',
                borderBottomLeftRadius: '100%',
                pointerEvents: 'none'
              }}></div>
              <div style={{position: 'relative', zIndex: 1}}>
                <div style={{
                  display: 'inline-block',
                  background: 'var(--color-primary)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  marginBottom: '12px'
                }}>
                  {t('dashboard.start_here')}
                </div>
                <h3 style={{
                  margin: '0 0 6px 0',
                  color: 'var(--color-soft-charcoal)',
                  fontSize: '20px',
                  fontWeight: 500,
                  fontFamily: 'var(--font-display)'
                }}>
                  {t('dashboard.assessment_title')}
                </h3>
                <p style={{
                  margin: '0 0 16px 0',
                  fontSize: '14px',
                  color: 'var(--color-text-secondary)',
                  fontWeight: 400
                }}>
                  {t('dashboard.assessment_desc')}
                </p>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--color-paper-white)',
                  padding: '10px 20px',
                  borderRadius: '50px',
                  fontWeight: 500,
                  fontSize: '14px',
                  color: 'var(--color-moss-dark)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s ease'
                }}>
                  <span className="material-symbols-outlined" style={{fontSize: '20px', color: 'var(--color-primary)'}}>
                    play_circle
                  </span>
                  Start Assessment
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Focus Quote */}
        <section style={{ marginBottom: '32px' }}>
          <div className="glass-panel" style={{
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'linear-gradient(to bottom right, rgba(184,207,179,0.2), transparent)',
              borderBottomLeftRadius: '100%',
              pointerEvents: 'none'
            }}></div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
              <span className="material-symbols-outlined" style={{fontSize: '22px', color: 'var(--color-primary)'}}>
                cloud_queue
              </span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '16px',
                fontWeight: 500,
                color: 'var(--color-moss-dark)'
              }}>
                {t('dashboard.focus_title')}
              </span>
            </div>
            <p style={{
              fontSize: '18px',
              fontFamily: 'var(--font-display)',
              margin: 0,
              lineHeight: 1.5,
              fontStyle: 'italic',
              color: 'var(--color-soft-charcoal)',
            }}>
              {t('dashboard.focus_quote')}
            </p>
          </div>
        </section>

        {/* The Garden — 5 Modules */}
        <section style={{ paddingBottom: '20px' }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            color: 'var(--color-soft-charcoal)',
            marginBottom: '20px',
            paddingLeft: '12px',
            borderLeft: '4px solid rgba(143, 168, 137, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 400
          }}>
            The Garden
            <span style={{
              fontSize: '11px',
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              color: '#999',
              background: '#f5f5f5',
              padding: '2px 10px',
              borderRadius: '20px',
              marginLeft: '4px'
            }}>
              5 Modules
            </span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {gardenModules.map(mod => (
              <button
                key={mod.id}
                onClick={() => navigate(`/gym?module=${mod.id}`)}
                className="soft-card"
                style={{
                  padding: '24px 16px',
                  borderRadius: 'var(--radius-xl)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '1px solid var(--color-border)',
                  background: 'white'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--color-moss-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  transition: 'background 0.2s ease',
                  boxShadow: 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.6)'
                }}>
                  <span className="material-symbols-outlined" style={{
                    fontSize: '26px',
                    color: 'var(--color-moss-dark)',
                    transition: 'color 0.2s ease'
                  }}>
                    {mod.icon}
                  </span>
                </div>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '17px',
                  color: 'var(--color-soft-charcoal)',
                  transition: 'color 0.2s ease'
                }}>
                  {mod.title}
                </span>
                <span style={{
                  fontSize: '10px',
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginTop: '4px',
                  fontWeight: 500
                }}>
                  {mod.sub}
                </span>
              </button>
            ))}

            {/* Module 5 — full width */}
            <button
              onClick={() => navigate(`/gym?module=${module5.id}`)}
              style={{
                gridColumn: 'span 2',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderRadius: 'var(--radius-xl)',
                background: 'white',
                border: '1px solid rgba(143, 168, 137, 0.1)',
                boxShadow: 'var(--shadow-md)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(143, 168, 137, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s ease'
                }}>
                  <span className="material-symbols-outlined" style={{
                    fontSize: '26px',
                    color: 'var(--color-primary)',
                    transition: 'color 0.2s ease'
                  }}>
                    {module5.icon}
                  </span>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '19px',
                    color: 'var(--color-soft-charcoal)',
                    fontWeight: 500
                  }}>
                    {module5.title}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: '#999',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    marginTop: '2px'
                  }}>
                    {module5.sub}
                  </span>
                </div>
              </div>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#f9f9f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span className="material-symbols-outlined" style={{fontSize: '20px', color: '#bbb'}}>
                  chevron_right
                </span>
              </div>
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppProvider';

const Gym = () => {
  const { t } = useApp();
  const [searchParams] = useSearchParams();
  const initialModule = searchParams.get('module') || 'all';
  const [activeTab, setActiveTab] = useState(initialModule);

  const modules = [
    { id: 'all', label: t('common.all') || 'All', icon: 'grid_view' },
    { id: 'module1', label: t('module1.short') || 'Awareness', icon: 'water_drop' },
    { id: 'module2', label: t('module2.short') || 'Expression', icon: 'graphic_eq' },
    { id: 'module3', label: t('module3.short') || 'Empathy', icon: 'diversity_1' },
    { id: 'module4', label: t('module4.short') || 'Allowing', icon: 'spa' },
    { id: 'module5', label: t('module5.short') || 'Influence', icon: 'blur_on' },
  ];

  const tools = [
    // Module 1
    { id: 'attribution', moduleId: 'module1', path: '/module1/attribution', title: t('module1.attribution.title'), icon: 'swap_horiz' },
    { id: 'emotion-scan', moduleId: 'module1', path: '/module1/emotion-scan', title: t('module1.emotion_scan.title'), icon: 'thermostat' },
    { id: 'story-buster', moduleId: 'module1', path: '/module1/story-buster', title: t('module1.story_buster.title'), icon: 'movie_filter' },
    { id: 'time-travel', moduleId: 'module1', path: '/module1/time-travel', title: t('module1.time_travel.title'), icon: 'hourglass_empty' },
    { id: 'happiness-scale', moduleId: 'module1', path: '/module1/happiness-scale', title: t('module1.happiness_scale.title'), icon: 'balance' },
    { id: 'rapid-awareness', moduleId: 'module1', path: '/module1/rapid-awareness', title: t('module1.rapid.title'), icon: 'bolt' },
    
    // Module 2
    { id: 'draft-builder', moduleId: 'module2', path: '/module2/draft-builder', title: t('module2.draft_builder.title'), icon: 'edit_note' },
    { id: 'vocabulary-swap', moduleId: 'module2', path: '/module2/vocabulary-swap', title: t('module2.vocabulary.title'), icon: 'spellcheck' },
    { id: 'apology-builder', moduleId: 'module2', path: '/module2/apology-builder', title: t('module2.apology.title'), icon: 'volunteer_activism' },

    // Module 3
    { id: 'anger-decoder', moduleId: 'module3', path: '/module3/anger-decoder', title: t('module3.anger_decoder.title'), icon: 'psychology' },
    { id: 'deep-listening', moduleId: 'module3', path: '/module3/deep-listening', title: t('module3.deep_listening.title'), icon: 'hearing' },
    { id: 'perspective-switcher', moduleId: 'module3', path: '/module3/perspective-switcher', title: t('module3.perspective.title'), icon: 'visibility' },

    // Module 4
    { id: 'permission-slip', moduleId: 'module4', path: '/module4/permission-slip', title: t('module4.permission.title'), icon: 'approval' },
    { id: 'reframing-tool', moduleId: 'module4', path: '/module4/reframing-tool', title: t('module4.reframe.title'), icon: 'flip' },

    // Module 5
    { id: 'spotlight-journal', moduleId: 'module5', path: '/module5/spotlight-journal', title: t('module5.journal.title'), icon: 'highlight' },
    { id: 'time-capsule', moduleId: 'module5', path: '/module5/time-capsule', title: t('module5.capsule.title'), icon: 'inventory_2' },
    { id: 'vision-board', moduleId: 'module5', path: '/module5/vision-board', title: t('module5.vision.title'), icon: 'map' },
  ];

  const filteredTools = activeTab === 'all' ? tools : tools.filter(t => t.moduleId === activeTab);

  return (
    <div className="page-container" style={{paddingTop: '10px', paddingBottom: '100px'}}>
      {/* Background Blobs */}
      <div className="background-blobs">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="blob-3"></div>
      </div>

      <div style={{position: 'relative', zIndex: 10}}>
        {/* Page Title */}
        <header style={{marginBottom: '24px', paddingTop: '10px'}}>
          <h1 style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            color: 'var(--color-soft-charcoal)',
            fontWeight: 400
          }}>
            <span className="material-symbols-outlined" style={{fontSize: '28px', color: 'var(--color-primary)', verticalAlign: 'middle', marginRight: '8px'}}>
              fitness_center
            </span>
            The Gym
          </h1>
        </header>

        {/* Module Filter Tabs */}
        <section style={{ marginBottom: '24px', overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '8px', scrollbarWidth: 'none' }} className="no-scrollbar">
          <div style={{display: 'inline-flex', gap: '10px'}}>
            {modules.map(mod => (
              <button
                key={mod.id}
                onClick={() => setActiveTab(mod.id)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '25px',
                  border: activeTab === mod.id ? 'none' : '1px solid var(--color-border)',
                  background: activeTab === mod.id ? 'var(--color-moss-dark)' : 'rgba(255,255,255,0.7)',
                  backdropFilter: activeTab !== mod.id ? 'blur(10px)' : 'none',
                  color: activeTab === mod.id ? 'white' : 'var(--color-text-secondary)',
                  fontSize: '13px',
                  fontWeight: 500,
                  boxShadow: activeTab === mod.id ? '0 4px 12px rgba(94, 107, 92, 0.3)' : 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span className="material-symbols-outlined" aria-hidden="true" style={{fontSize: '18px'}}>
                  {mod.icon}
                </span>
                {mod.label}
              </button>
            ))}
          </div>
        </section>

        {/* Tools Grid */}
        <section style={{ marginBottom: '30px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <span style={{
              fontSize: '13px',
              color: '#999',
              fontWeight: 500
            }}>
              {filteredTools.length} Tools
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {filteredTools.map(tool => (
              <Link key={tool.id} to={tool.path} style={{ textDecoration: 'none' }}>
                <div className="soft-card" style={{
                  padding: '24px 16px',
                  borderRadius: 'var(--radius-xl)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  textAlign: 'center',
                  height: '140px',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'var(--color-moss-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s ease',
                    boxShadow: 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.6)'
                  }}>
                    <span className="material-symbols-outlined" style={{
                      fontSize: '24px',
                      color: 'var(--color-moss-dark)',
                      transition: 'color 0.2s ease'
                    }}>
                      {tool.icon}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '15px',
                    color: 'var(--color-soft-charcoal)',
                    lineHeight: 1.3,
                    fontWeight: 400
                  }}>
                    {tool.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .soft-card:hover {
          background: white !important;
          border-color: rgba(143, 168, 137, 0.2) !important;
          transform: translateY(-2px);
          box-shadow: var(--shadow-md) !important;
        }
        .soft-card:hover .material-symbols-outlined {
          color: var(--color-primary) !important;
        }
        .soft-card:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

export default Gym;

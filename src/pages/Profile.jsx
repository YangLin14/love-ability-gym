import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppProvider';
import { useAuth } from '../context/AuthContext';
import StorageService from '../services/StorageService';
import RadarChart from '../components/RadarChart';
import EmotionInsights from '../components/EmotionInsights';
import ProfileHeader from '../components/profile/ProfileHeader';
import StatsOverview from '../components/profile/StatsOverview';
import ActivityHistory from '../components/profile/ActivityHistory';
import styles from './Profile.module.css';

const Profile = () => {
  const { userProfile, setUserProfile, userStats, t } = useApp();
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
    const logs = StorageService.getAllLogs();
    setHistory(logs);
    const usage = StorageService.getStats();
    setStats(usage);
    const savedAssessment = localStorage.getItem('user_assessment');
    if (savedAssessment) {
      try { setAssessment(JSON.parse(savedAssessment)); } catch (e) { /* corrupted */ }
    }
  };

  useEffect(() => {
    if (location.state?.scrollToInsights) {
      setTimeout(() => {
        const element = document.getElementById('emotion-insights-section');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.state]);

  const handleSaveProfile = () => {
    setUserProfile(editForm);
    setIsEditing(false);
  };

  return (
    <div className={`page-container ${styles.container}`}>
      
      {/* Header / Nav */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button 
            onClick={() => navigate('/')} 
            className={styles.backButton}
            aria-label="Go back to dashboard"
          >
            ←
          </button>
          <h2 style={{margin: 0}}>{t('profile.title')}</h2>
        </div>
      </div>

      {/* Profile Card */}
      <div className={`fade-in ${styles.profileCard}`}>
        <ProfileHeader
          userProfile={userProfile}
          userStats={userStats}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editForm={editForm}
          setEditForm={setEditForm}
          onSave={handleSaveProfile}
          t={t}
          onNavigateSettings={() => navigate('/settings')}
        />

        {!isEditing && (
          <StatsOverview 
            userStats={userStats} 
            historyCount={history.length} 
            t={t} 
          />
        )}
      </div>

      {/* Emotion Insights Report */}
      <section id="emotion-insights-section" className={styles.section}>
        <h3 className={styles.sectionTitle}>
          {t('profile.insights_title') || '📊 Emotion Insights'}
        </h3>
        <EmotionInsights period={14} defaultView={location.state?.viewMode || 'today'} />
      </section>

      {/* Stats Charts */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('profile.stats_title')}</h3>
        <div className={styles.grid}>
          {/* Radar Chart */}
          {assessment && (
            <div className={styles.chartCard}>
               <h4 className={styles.chartCardTitle}>Love Quotient (LQ)</h4>
               <div className={styles.chartContainer}>
                  <RadarChart data={assessment.scores} size={250} />
               </div>
               <div className={styles.lqTotal}>
                  Total: <span className={styles.lqScore}>{assessment.total} / 75</span>
               </div>
               <button 
                 onClick={() => navigate('/onboarding')} 
                 className={styles.retakeButton}
                 aria-label="Retake love ability assessment"
               >
                 Retake Assessment
               </button>
            </div>
          )}

          {/* Usage Stats */}
          <div className={styles.chartCard}>
             <h4 className={styles.chartCardSubtitle}>{t('profile.usage_chart')}</h4>
             {Object.keys(stats).length > 0 ? (
               <div className={styles.usageColumn}>
                  {Object.entries(stats).map(([tool, count]) => (
                    <div key={tool} className={styles.usageRow}>
                       <div className={styles.usageLabel}>{tool}</div>
                       <div className={styles.usageBarTrack}>
                          <div 
                            className={styles.usageBarFill}
                            style={{ width: `${Math.min((count / Math.max(...Object.values(stats))) * 100, 100)}%` }}
                          />
                       </div>
                       <div className={styles.usageCount}>{count}</div>
                    </div>
                  ))}
               </div>
             ) : (
               <div className={styles.noData}>{t('common.no_data')}</div>
             )}
          </div>
        </div>
      </section>

      {/* History Table */}
      <section className={styles.sectionBottom}>
        <h3 className={styles.sectionTitle}>{t('profile.history_title')}</h3>
        <ActivityHistory history={history} t={t} />
      </section>

    </div>
  );
};

export default Profile;

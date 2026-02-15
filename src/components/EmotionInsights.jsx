import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useEmotionAnalysis } from '@/hooks/useEmotionAnalysis';
import SimpleLineChart from '@/components/SimpleLineChart';

/**
 * EmotionInsights Component
 * Analyzes ALL user emotion data from ALL modules and generates comprehensive insights
 */
const EmotionInsights = ({ period = 14 }) => {
  const { language } = useLanguage();
  const { insights, loading } = useEmotionAnalysis(period);

  if (loading) {
    return (
      <div style={styles.loading}>
        {language === 'zh' ? '分析中...' : 'Analyzing...'}
      </div>
    );
  }

  if (!insights || insights.totalRecords === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>📊</div>
        <h4>{language === 'zh' ? '還沒有數據' : 'No data yet'}</h4>
        <p style={{ color: '#888', fontSize: '14px' }}>
          {language === 'zh' 
            ? '使用任何工具記錄情緒後，這裡會顯示綜合分析報告。'
            : 'Use any tool to log emotions and see insights here.'}
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Period Header */}
      <div style={styles.periodHeader}>
        <span style={{ fontSize: '20px' }}>📊</span>
        <span>
          {language === 'zh' 
            ? `過去 ${insights.period} 天綜合報告`
            : `${insights.period}-Day Comprehensive Report`}
        </span>
      </div>

      {/* Stats Row */}
      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <div style={styles.statNumber}>{insights.totalRecords}</div>
          <div style={styles.statLabel}>{language === 'zh' ? '筆記錄' : 'Records'}</div>
        </div>
        {insights.avgIntensity && (
          <div style={styles.statBox}>
            <div style={styles.statNumber}>{insights.avgIntensity}</div>
            <div style={styles.statLabel}>{language === 'zh' ? '平均強度' : 'Avg Intensity'}</div>
          </div>
        )}
        <div style={styles.statBox}>
          <div style={styles.statNumber}>{insights.topTools.length}</div>
          <div style={styles.statLabel}>{language === 'zh' ? '工具使用' : 'Tools Used'}</div>
        </div>
      </div>

      {/* Dominant Category */}
      {insights.dominantCategory && (
        <div style={{
          ...styles.dominantCard,
          backgroundColor: `${insights.dominantCategory.color}15`,
          borderColor: insights.dominantCategory.color
        }}>
          <div style={styles.dominantIcon}>{insights.dominantCategory.icon}</div>
          <div>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              {language === 'zh' ? '主要情緒類型' : 'Dominant Emotion'}
            </p>
            <h3 style={{ margin: '5px 0', color: insights.dominantCategory.color }}>
              {language === 'zh' ? insights.dominantCategory.category_zh : insights.dominantCategory.category}
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>
              {insights.dominantCategoryCount} {language === 'zh' ? '次出現' : 'occurrences'}
            </p>
          </div>
        </div>
      )}

      {/* Top Needs - Most Important */}
      {insights.topNeeds.length > 0 && (
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>
            💡 {language === 'zh' ? '你最渴望的需求' : 'Your Top Needs'}
          </h4>
          <div style={styles.needsGrid}>
            {insights.topNeeds.map(([need, count], index) => (
              <div key={need} style={{
                ...styles.needItem,
                backgroundColor: index === 0 ? 'var(--color-sage-light)' : '#f5f5f5',
                border: index === 0 ? '2px solid var(--color-sage-green)' : 'none'
              }}>
                <span style={styles.needText}>{need}</span>
                <span style={styles.needCount}>{count}x</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Emotions */}
      {insights.topEmotions.length > 0 && (
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>
            🎯 {language === 'zh' ? '高頻情緒詞' : 'Frequent Emotions'}
          </h4>
          <div style={styles.emotionList}>
            {insights.topEmotions.map(([emotion, count]) => (
              <div key={emotion} style={styles.emotionRow}>
                <span>{emotion}</span>
                <div style={styles.barContainer}>
                  <div style={{
                    ...styles.bar,
                    width: `${(count / insights.topEmotions[0][1]) * 100}%`
                  }} />
                  <span style={styles.barCount}>{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tools Used */}
      {insights.topTools.length > 0 && (
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>
            🛠️ {language === 'zh' ? '使用的工具' : 'Tools Used'}
          </h4>
          <div style={styles.toolsGrid}>
            {insights.topTools.map(([tool, count]) => (
              <div key={tool} style={styles.toolChip}>
                <span>{tool}</span>
                <span style={styles.toolCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Fluctuations Chart */}
      {insights.dailyFluctuations && (
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>
            📈 {language === 'zh' ? '情緒起伏 (過去14天)' : 'Emotional Fluctuations (14 Days)'}
          </h4>
          <div style={{ width: '100%', height: '200px', marginBottom: '20px' }}>
             <SimpleLineChart data={insights.dailyFluctuations} />
          </div>
          <p style={{fontSize: '12px', color: '#999', textAlign: 'center', marginBottom: '20px'}}>
            {language === 'zh' 
              ? '此圖表結合了您的快速覺察分數與情緒掃描強度。'
              : 'This chart combines your Rapid Awareness scores and Emotion Scan intensities.'}
          </p>
        </div>
      )}

      {/* Insight Message */}
      {insights.topNeeds.length > 0 && (
        <div style={styles.insightMessage}>
          <p>
            {language === 'zh' 
              ? `💬 綜合分析顯示，「${insights.topNeeds[0][0]}」是你目前最需要被滿足的需求。建議在日常生活和關係中，多關注這份需求的滿足。`
              : `💬 Analysis shows that "${insights.topNeeds[0][0]}" is your most pressing need right now. Focus on fulfilling this need in your daily life and relationships.`}
          </p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    background: 'white',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#888'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
  },
  periodHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px'
  },
  statsRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  statBox: {
    flex: 1,
    background: '#f8f9fa',
    padding: '15px 10px',
    borderRadius: '12px',
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'var(--color-sage-dark)'
  },
  statLabel: {
    fontSize: '11px',
    color: '#888',
    marginTop: '4px'
  },
  dominantCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '20px',
    borderRadius: '16px',
    border: '2px solid',
    marginBottom: '20px'
  },
  dominantIcon: {
    fontSize: '40px'
  },
  section: {
    marginBottom: '20px'
  },
  sectionTitle: {
    margin: '0 0 12px 0',
    fontSize: '15px',
    color: '#333'
  },
  needsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px'
  },
  needItem: {
    padding: '10px 15px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  needText: {
    fontWeight: '600',
    fontSize: '14px'
  },
  needCount: {
    fontSize: '12px',
    color: '#888'
  },
  emotionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  emotionRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px'
  },
  barContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  bar: {
    height: '8px',
    background: 'var(--color-sage-green)',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  },
  barCount: {
    fontSize: '12px',
    color: '#888',
    minWidth: '20px'
  },
  toolsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  toolChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: '#f0f0f0',
    borderRadius: '20px',
    fontSize: '13px'
  },
  toolCount: {
    background: '#ddd',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '11px'
  },
  insightMessage: {
    background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
    padding: '15px',
    borderRadius: '12px',
    fontSize: '14px',
    lineHeight: '1.6'
  }
};

export default EmotionInsights;

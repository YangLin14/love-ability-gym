import React, { useState } from 'react';

const emotions = [
  { label: 'Joy', color: '#FFD700', category: 'High Energy Positive' },
  { label: 'Sadness', color: '#87CEEB', category: 'Low Energy Negative' },
  { label: 'Anger', color: '#FF6B6B', category: 'High Energy Negative' },
  { label: 'Fear', color: '#9370DB', category: 'High Energy Negative' },
  { label: 'Peace', color: '#98FB98', category: 'Low Energy Positive' },
  { label: 'Power', color: '#FFA500', category: 'High Energy Positive' },
];

const MoodSelector = ({ onSelect }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
      {emotions.map((emotion) => (
        <button
          key={emotion.label}
          onClick={() => onSelect(emotion)}
          style={{
            backgroundColor: emotion.color,
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#fff',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {emotion.label}
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;

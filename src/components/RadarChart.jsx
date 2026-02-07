import React from 'react';
import { useApp } from '../context/AppProvider';

const RadarChart = ({ data, size = 300 }) => {
  const { t } = useApp();
  // data format: { label: string OR labelKey: string, value: number (0-5), fullMark: 5 }
  // 5 axes for 5 modules
  
  const center = size / 2;
  const radius = (size / 2) - 40; // padding
  const angleSlice = (Math.PI * 2) / 5;

  const getCoordinates = (value, index) => {
    const angle = index * angleSlice - Math.PI / 2; // Start from top
    const r = (value / 5) * radius; // assuming max score is 5
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const labels = data.map((d, i) => {
    const coords = getCoordinates(6, i); // Place label slightly outside (radius +)
    // Adjust label position based on angle to avoid overlap
    let xOffset = 0;
    let yOffset = 0;
    if (i === 1 || i === 2) yOffset = 10;
    
    // Use labelKey for translation if available, otherwise use label
    const displayLabel = d.labelKey ? t(d.labelKey) : d.label;
    
    return (
      <text 
        key={d.label || d.labelKey} 
        x={coords.x + xOffset} 
        y={coords.y + yOffset} 
        textAnchor="middle" 
        fill="#333" 
        fontSize="12"
        dy={i===0 ? "-10" : "5"}
      >
        {displayLabel}
      </text>
    );
  });

  const levels = [1, 2, 3, 4, 5];
  const grid = levels.map(level => {
    const points = Array.from({ length: 5 }).map((_, i) => {
      const { x, y } = getCoordinates(level, i);
      return `${x},${y}`;
    }).join(' ');
    return <polygon key={level} points={points} fill="none" stroke="#ddd" strokeWidth="1" />;
  });

  const dataPoints = data.map((d, i) => getCoordinates(d.value, i));
  const polyPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      {grid}
      {/* Axis Lines */}
      {Array.from({ length: 5 }).map((_, i) => {
        const { x, y } = getCoordinates(5, i);
        return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#eee" />;
      })}
      
      {/* Data Polygon */}
      <polygon points={polyPoints} fill="rgba(89, 149, 117, 0.5)" stroke="var(--color-sage-green)" strokeWidth="2" />
      
      {/* Data Dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="var(--color-ink-black)" />
      ))}

      {labels}
    </svg>
  );
};

export default RadarChart;

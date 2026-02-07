import React, { useState } from 'react';

const BodyMap = ({ onSelect }) => {
  const [selectedPart, setSelectedPart] = useState(null);

  const handleClick = (part) => {
    setSelectedPart(part);
    onSelect(part);
  };

  const partStyle = (part) => ({
    fill: selectedPart === part ? 'var(--color-crisis-red)' : '#E0E0E0',
    stroke: '#333',
    strokeWidth: '2',
    cursor: 'pointer',
    transition: 'fill 0.3s'
  });

  return (
    <div style={{ width: '200px', height: '400px', margin: '0 auto', position: 'relative' }}>
      <svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <circle cx="100" cy="50" r="30" style={partStyle('head')} onClick={() => handleClick('head')} />
        
        {/* Torso (Chest + Stomach) */}
        <path d="M70 80 L130 80 L130 200 L70 200 Z" style={partStyle('torso')} onClick={() => handleClick('torso')} />
        
        {/* Arms */}
        <line x1="70" y1="90" x2="30" y2="150" stroke="#333" strokeWidth="10" style={partStyle('arms')} onClick={() => handleClick('arms')} />
        <line x1="130" y1="90" x2="170" y2="150" stroke="#333" strokeWidth="10" style={partStyle('arms')} onClick={() => handleClick('arms')} />
        
        {/* Legs */}
        <line x1="80" y1="200" x2="80" y2="300" stroke="#333" strokeWidth="10" style={partStyle('legs')} onClick={() => handleClick('legs')} />
        <line x1="120" y1="200" x2="120" y2="300" stroke="#333" strokeWidth="10" style={partStyle('legs')} onClick={() => handleClick('legs')} />
      </svg>
      {selectedPart && (
        <div style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold' }}>
          {selectedPart.toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default BodyMap;

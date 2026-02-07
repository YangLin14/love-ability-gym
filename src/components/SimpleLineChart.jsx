import React from 'react';

// Simple SVG Line Chart Component
const SimpleLineChart = ({ data }) => {
    const width = 300;
    const height = 200;
    const padding = 20;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    // Y Axis: -10 to 10. Range = 20.
    // y = 0 is at height/2.
    const getY = (score) => {
        const normalized = (score + 10) / 20; // 0 to 1
        return height - padding - (normalized * graphHeight);
    };

    const getX = (index) => {
        // Guard against division by zero if data has 0 or 1 point
        if (data.length <= 1) return padding + (graphWidth / 2);
        return padding + (index * (graphWidth / (data.length - 1)));
    };

    if (!data || data.length === 0) {
        return <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999'}}>No Data</div>;
    }

    const points = data.map((d, i) => `${getX(i)},${getY(d.score)}`).join(' ');

    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{overflow: 'visible'}}>
            {/* Grid Lines */}
            <line x1={padding} y1={padding} x2={width-padding} y2={padding} stroke="#eee" strokeWidth="1" />
            <line x1={padding} y1={height/2} x2={width-padding} y2={height/2} stroke="#ccc" strokeWidth="1" strokeDasharray="4" />
            <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} stroke="#eee" strokeWidth="1" />
            
            {/* Y Axis Labels */}
            <text x={0} y={padding + 4} fontSize="10" fill="#999">10</text>
            <text x={0} y={height/2 + 4} fontSize="10" fill="#999">0</text>
            <text x={0} y={height - padding + 4} fontSize="10" fill="#999">-10</text>

            {/* Line */}
            <polyline points={points} fill="none" stroke="var(--color-sage-dark)" strokeWidth="2" />

            {/* Dots */}
            {data.map((d, i) => (
                <circle key={i} cx={getX(i)} cy={getY(d.score)} r="3" fill="var(--color-sage-dark)" />
            ))}

            {/* X Axis Labels (Every 2 days) */}
            {data.map((d, i) => (
                i % 2 === 0 && (
                <text key={i} x={getX(i)} y={height - 2} fontSize="8" fill="#999" textAnchor="middle">
                    {d.label}
                </text>
                )
            ))}
        </svg>
    );
};

export default SimpleLineChart;

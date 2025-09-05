import React from 'react';
import './BgAnimation.css';

const BgAnimation = () => {
  return (
    <div className="bg-animation-container">
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Background Gradient - Updated to Amber/Orange theme */}
          <radialGradient id="bg-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{ stopColor: '#2d1c0b', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#1c1106', stopOpacity: 1 }} />
          </radialGradient>

          {/* Glow Filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width="1920" height="1080" fill="url(#bg-gradient)" />

        {/* Animated Digital Grid */}
        <g className="grid-group">
          {Array.from({ length: 40 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="1080" stroke="rgba(245, 158, 11, 0.1)" strokeWidth="1" />
          ))}
          {Array.from({ length: 22 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 50} x2="1920" y2={i * 50} stroke="rgba(245, 158, 11, 0.1)" strokeWidth="1" />
          ))}
        </g>
        
        {/* Floating Geometric Shapes */}
        <g className="floating-shapes" filter="url(#glow)">
            <path d="M300 300 l 50 -86.6 l 100 0 l 50 86.6 l -50 86.6 l -100 0 z" className="shape hexagon" style={{ '--i': 1 }} />
            <circle cx="1600" cy="200" r="80" className="shape circle" style={{ '--i': 2 }} />
            <path d="M150 800 l 30 -52 l 60 0 l 30 52 l -30 52 l -60 0 z" className="shape hexagon" style={{ '--i': 3 }} />
            <circle cx="1800" cy="900" r="50" className="shape circle" style={{ '--i': 4 }} />
            <circle cx="960" cy="540" r="120" className="shape circle-center" style={{ '--i': 5 }} />
        </g>

        {/* Neural Network Animation */}
        <g className="neural-network">
          {/* Nodes */}
          <circle cx="200" cy="150" r="8" className="node" style={{'--d': '1s'}} />
          <circle cx="450" cy="600" r="10" className="node" style={{'--d': '2s'}}/>
          <circle cx="700" cy="200" r="7" className="node" style={{'--d': '3s'}}/>
          <circle cx="1200" cy="850" r="12" className="node" style={{'--d': '1.5s'}}/>
          <circle cx="1500" cy="450" r="9" className="node" style={{'--d': '2.5s'}}/>
          <circle cx="1750" cy="700" r="8" className="node" style={{'--d': '0.5s'}}/>

          {/* Connecting Lines with travelling particles */}
          <path d="M 200 150 Q 400 300 700 200" className="line" style={{'--l': 580, '--d': '0s' }} />
          <path d="M 450 600 Q 500 400 700 200" className="line" style={{'--l': 450, '--d': '1s' }} />
          <path d="M 1500 450 Q 1300 650 1200 850" className="line" style={{'--l': 450, '--d': '2s' }} />
          <path d="M 1200 850 L 1750 700" className="line" style={{'--l': 570, '--d': '3s' }} />
          <path d="M 200 150 C 800 50, 1000 800, 1500 450" className="line" style={{'--l': 1500, '--d': '4s' }} />
        </g>
      </svg>
    </div>
  );
};

export default BgAnimation;
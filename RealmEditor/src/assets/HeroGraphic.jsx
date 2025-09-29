// src/assets/HeroGraphic.jsx
import React from 'react';

export default function HeroGraphic() {
  return (
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#818cf8', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#d8b4fe', stopOpacity: 1}} />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#f472b6', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#fbbf24', stopOpacity: 1}} />
        </linearGradient>
      </defs>
      <circle cx="256" cy="256" r="256" fill="url(#grad1)"/>
      <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
        <circle cx="256" cy="256" r="256" fill="white"/>
      </mask>
      <g mask="url(#mask0)">
        <path transform="translate(50 50) scale(1.2)" d="M226.8,324.8,111.4,267.1a20,20,0,0,1,0-34.6L226.8,175.2a20,20,0,0,1,30,17.3V307.5A20,20,0,0,1,226.8,324.8Z" fill="rgba(255,255,255,0.2)"/>
        <circle cx="350" cy="150" r="100" fill="url(#grad2)" opacity="0.8"/>
        <rect x="-50" y="300" width="400" height="100" rx="50" fill="rgba(255,255,255,0.15)" transform="rotate(-30, 150, 350)" />
      </g>
    </svg>
  );
}
import React from 'react';
import './Stickers.css';

// Large 3D Code Symbol - Slash with shadow effect
export const CodeSlash = ({ className = '', style = {} }) => (
  <svg className={`code-symbol code-slash ${className}`} style={style} viewBox="0 0 80 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF8C00" />
        <stop offset="50%" stopColor="#FF6B00" />
        <stop offset="100%" stopColor="#E55A00" />
      </linearGradient>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="4" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.5"/>
      </filter>
    </defs>
    {/* White background shape */}
    <path d="M55 10C60 10 65 15 65 20L25 180C23 188 15 192 8 190C3 188 0 183 0 178L40 18C42 12 48 10 55 10Z" fill="white" filter="url(#shadow)"/>
    {/* Orange gradient stroke */}
    <path d="M52 20L15 170" stroke="url(#orangeGradient)" strokeWidth="18" strokeLinecap="round"/>
  </svg>
);

// Large 3D Code Symbol - Left Bracket <
export const CodeBracketLeft = ({ className = '', style = {} }) => (
  <svg className={`code-symbol code-bracket ${className}`} style={style} viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="orangeGradientLeft" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF8C00" />
        <stop offset="50%" stopColor="#FF6B00" />
        <stop offset="100%" stopColor="#E55A00" />
      </linearGradient>
      <filter id="shadowLeft" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="4" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.5"/>
      </filter>
    </defs>
    {/* White background shape */}
    <path d="M100 15C108 8 118 12 118 22L118 30L35 90L118 150L118 158C118 168 108 172 100 165L10 95C2 89 2 81 10 75L100 15Z" fill="white" filter="url(#shadowLeft)"/>
    {/* Orange gradient stroke */}
    <path d="M100 25L25 90L100 155" stroke="url(#orangeGradientLeft)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

// Large 3D Code Symbol - Right Bracket >
export const CodeBracketRight = ({ className = '', style = {} }) => (
  <svg className={`code-symbol code-bracket ${className}`} style={style} viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="orangeGradientRight" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FF8C00" />
        <stop offset="50%" stopColor="#FF6B00" />
        <stop offset="100%" stopColor="#E55A00" />
      </linearGradient>
      <filter id="shadowRight" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="4" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.5"/>
      </filter>
    </defs>
    {/* White background shape */}
    <path d="M20 15C12 8 2 12 2 22L2 30L85 90L2 150L2 158C2 168 12 172 20 165L110 95C118 89 118 81 110 75L20 15Z" fill="white" filter="url(#shadowRight)"/>
    {/* Orange gradient stroke */}
    <path d="M20 25L95 90L20 155" stroke="url(#orangeGradientRight)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

// Combined </> symbol for hero section
export const CodeSymbolFull = ({ className = '', style = {} }) => (
  <div className={`code-symbol-full ${className}`} style={style}>
    <CodeBracketLeft />
    <CodeSlash />
    <CodeBracketRight />
  </div>
);

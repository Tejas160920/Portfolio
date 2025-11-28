import React from 'react';
import { motion } from 'framer-motion';
import './CodeGraphics.css';

// Animated Code Bracket < or >
export const CodeBracket = ({ direction = 'left', size = 120, delay = 0, className = '', style = {} }) => {
  const path = direction === 'left'
    ? "M70 20L20 75L70 130"
    : "M30 20L80 75L30 130";

  return (
    <motion.svg
      className={`code-graphic code-bracket ${className}`}
      style={{ width: size, height: size * 1.25, ...style }}
      viewBox="0 0 100 150"
      fill="none"
      initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      <defs>
        <linearGradient id={`bracketGrad-${direction}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="50%" stopColor="#66BB6A" />
          <stop offset="100%" stopColor="#81C784" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <motion.path
        d={path}
        stroke={`url(#bracketGrad-${direction})`}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: delay + 0.3, ease: "easeInOut" }}
      />
    </motion.svg>
  );
};

// Animated Curly Brace { or }
export const CurlyBrace = ({ direction = 'left', size = 100, delay = 0, className = '', style = {} }) => {
  const path = direction === 'left'
    ? "M60 15C60 15 40 15 40 35C40 55 25 55 25 75C25 95 40 95 40 115C40 135 60 135 60 135"
    : "M40 15C40 15 60 15 60 35C60 55 75 55 75 75C75 95 60 95 60 115C60 135 40 135 40 135";

  return (
    <motion.svg
      className={`code-graphic curly-brace ${className}`}
      style={{ width: size * 0.8, height: size * 1.5, ...style }}
      viewBox="0 0 100 150"
      fill="none"
      initial={{ opacity: 0, x: direction === 'left' ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      <defs>
        <linearGradient id={`curlyGrad-${direction}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFEA00" />
          <stop offset="50%" stopColor="#FFD600" />
          <stop offset="100%" stopColor="#FFC107" />
        </linearGradient>
      </defs>
      <motion.path
        d={path}
        stroke={`url(#curlyGrad-${direction})`}
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: delay + 0.2, ease: "easeInOut" }}
      />
    </motion.svg>
  );
};

// Animated Slash /
export const CodeSlash = ({ size = 100, delay = 0, className = '', style = {} }) => (
  <motion.svg
    className={`code-graphic code-slash ${className}`}
    style={{ width: size * 0.5, height: size * 1.5, ...style }}
    viewBox="0 0 50 150"
    fill="none"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
  >
    <defs>
      <linearGradient id="slashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4CAF50" />
        <stop offset="100%" stopColor="#81C784" />
      </linearGradient>
    </defs>
    <motion.line
      x1="40" y1="15" x2="10" y2="135"
      stroke="url(#slashGrad)"
      strokeWidth="10"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8, delay: delay + 0.2, ease: "easeInOut" }}
    />
  </motion.svg>
);

// Animated Semicolon ;
export const Semicolon = ({ size = 60, delay = 0, className = '', style = {} }) => (
  <motion.svg
    className={`code-graphic semicolon ${className}`}
    style={{ width: size * 0.4, height: size, ...style }}
    viewBox="0 0 30 80"
    fill="none"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay, type: "spring", stiffness: 200 }}
  >
    <defs>
      <radialGradient id="semiGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FF4081" />
        <stop offset="100%" stopColor="#E91E63" />
      </radialGradient>
    </defs>
    <circle cx="15" cy="15" r="8" fill="url(#semiGrad)" />
    <motion.path
      d="M15 35C15 35 18 50 10 65"
      stroke="url(#semiGrad)"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, delay: delay + 0.3 }}
    />
  </motion.svg>
);

// Animated Hash # (for comments)
export const HashSymbol = ({ size = 80, delay = 0, className = '', style = {} }) => (
  <motion.svg
    className={`code-graphic hash-symbol ${className}`}
    style={{ width: size, height: size, ...style }}
    viewBox="0 0 80 80"
    fill="none"
    initial={{ opacity: 0, rotate: -20 }}
    animate={{ opacity: 1, rotate: 0 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
    <defs>
      <linearGradient id="hashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7C4DFF" />
        <stop offset="100%" stopColor="#B388FF" />
      </linearGradient>
    </defs>
    {/* Vertical lines */}
    <motion.line x1="28" y1="10" x2="22" y2="70" stroke="url(#hashGrad)" strokeWidth="6" strokeLinecap="round"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: delay + 0.1 }} />
    <motion.line x1="58" y1="10" x2="52" y2="70" stroke="url(#hashGrad)" strokeWidth="6" strokeLinecap="round"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: delay + 0.2 }} />
    {/* Horizontal lines */}
    <motion.line x1="10" y1="28" x2="70" y2="28" stroke="url(#hashGrad)" strokeWidth="6" strokeLinecap="round"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: delay + 0.3 }} />
    <motion.line x1="10" y1="52" x2="70" y2="52" stroke="url(#hashGrad)" strokeWidth="6" strokeLinecap="round"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: delay + 0.4 }} />
  </motion.svg>
);

// Animated Equal Sign =
export const EqualSign = ({ size = 60, delay = 0, className = '', style = {} }) => (
  <motion.svg
    className={`code-graphic equal-sign ${className}`}
    style={{ width: size, height: size * 0.6, ...style }}
    viewBox="0 0 60 36"
    fill="none"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
  >
    <defs>
      <linearGradient id="equalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#00BCD4" />
        <stop offset="100%" stopColor="#4DD0E1" />
      </linearGradient>
    </defs>
    <motion.line x1="5" y1="12" x2="55" y2="12" stroke="url(#equalGrad)" strokeWidth="6" strokeLinecap="round"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: delay + 0.1 }} />
    <motion.line x1="5" y1="24" x2="55" y2="24" stroke="url(#equalGrad)" strokeWidth="6" strokeLinecap="round"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: delay + 0.2 }} />
  </motion.svg>
);

// Animated Parentheses ( or )
export const Parenthesis = ({ direction = 'left', size = 100, delay = 0, className = '', style = {} }) => {
  const path = direction === 'left'
    ? "M50 10C50 10 20 40 20 75C20 110 50 140 50 140"
    : "M30 10C30 10 60 40 60 75C60 110 30 140 30 140";

  return (
    <motion.svg
      className={`code-graphic parenthesis ${className}`}
      style={{ width: size * 0.6, height: size * 1.5, ...style }}
      viewBox="0 0 80 150"
      fill="none"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      <defs>
        <linearGradient id={`parenGrad-${direction}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF9800" />
          <stop offset="100%" stopColor="#FFB74D" />
        </linearGradient>
      </defs>
      <motion.path
        d={path}
        stroke={`url(#parenGrad-${direction})`}
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.2, ease: "easeInOut" }}
      />
    </motion.svg>
  );
};

// Animated Dot .
export const CodeDot = ({ size = 30, delay = 0, color = "#4CAF50", className = '', style = {} }) => (
  <motion.div
    className={`code-graphic code-dot ${className}`}
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle at 30% 30%, ${color}, ${color}99)`,
      boxShadow: `0 0 20px ${color}66, 0 0 40px ${color}33`,
      ...style
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay, type: "spring", stiffness: 300 }}
  />
);

// Animated Arrow =>
export const ArrowFunction = ({ size = 80, delay = 0, className = '', style = {} }) => (
  <motion.svg
    className={`code-graphic arrow-function ${className}`}
    style={{ width: size * 1.5, height: size * 0.6, ...style }}
    viewBox="0 0 120 50"
    fill="none"
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
    <defs>
      <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#4CAF50" />
        <stop offset="100%" stopColor="#8BC34A" />
      </linearGradient>
    </defs>
    {/* = sign */}
    <motion.line x1="10" y1="18" x2="45" y2="18" stroke="url(#arrowGrad)" strokeWidth="6" strokeLinecap="round"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: delay + 0.1 }} />
    <motion.line x1="10" y1="32" x2="45" y2="32" stroke="url(#arrowGrad)" strokeWidth="6" strokeLinecap="round"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: delay + 0.2 }} />
    {/* > arrow */}
    <motion.path d="M60 25L95 25M95 25L80 12M95 25L80 38" stroke="url(#arrowGrad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: delay + 0.3 }} />
  </motion.svg>
);

// Floating wrapper with parallax effect
export const FloatingGraphic = ({ children, amplitude = 20, duration = 4, delay = 0, className = '', style = {} }) => (
  <motion.div
    className={`floating-graphic ${className}`}
    style={style}
    animate={{
      y: [0, -amplitude, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
      delay
    }}
  >
    {children}
  </motion.div>
);

// Rotating glow ring
export const GlowRing = ({ size = 100, delay = 0, className = '', style = {} }) => (
  <motion.div
    className={`glow-ring ${className}`}
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      border: '3px solid transparent',
      borderTopColor: '#4CAF50',
      borderRightColor: '#FFEA00',
      boxShadow: '0 0 30px #4CAF5044, inset 0 0 30px #4CAF5022',
      ...style
    }}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1, rotate: 360 }}
    transition={{
      opacity: { duration: 0.5, delay },
      scale: { duration: 0.5, delay },
      rotate: { duration: 8, repeat: Infinity, ease: "linear", delay }
    }}
  />
);

// Code block decoration
export const CodeBlockDecor = ({ size = 150, delay = 0, className = '', style = {} }) => (
  <motion.div
    className={`code-block-decor ${className}`}
    style={{
      width: size,
      height: size * 0.8,
      background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(255, 234, 0, 0.05) 100%)',
      borderRadius: '12px',
      border: '1px solid rgba(76, 175, 80, 0.3)',
      backdropFilter: 'blur(10px)',
      padding: '15px',
      ...style
    }}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
  >
    {/* Fake code lines */}
    <motion.div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <motion.div style={{ width: '70%', height: '8px', background: 'linear-gradient(90deg, #4CAF50, transparent)', borderRadius: '4px' }}
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: delay + 0.2 }} />
      <motion.div style={{ width: '90%', height: '8px', background: 'linear-gradient(90deg, #FFEA00, transparent)', borderRadius: '4px' }}
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: delay + 0.3 }} />
      <motion.div style={{ width: '60%', height: '8px', background: 'linear-gradient(90deg, #FF4081, transparent)', borderRadius: '4px' }}
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: delay + 0.4 }} />
      <motion.div style={{ width: '80%', height: '8px', background: 'linear-gradient(90deg, #7C4DFF, transparent)', borderRadius: '4px' }}
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: delay + 0.5 }} />
    </motion.div>
  </motion.div>
);

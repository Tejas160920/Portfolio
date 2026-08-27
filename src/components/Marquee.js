import React from 'react';
import './Marquee.css';

const ROW_ONE = [
  'Java', 'Spring Boot', 'Python', 'FastAPI', 'Node.js', 'React',
  'TypeScript', 'PostgreSQL', 'MongoDB', 'Redis'
];

const ROW_TWO = [
  'AWS', 'Kubernetes', 'Docker', 'Terraform', 'GitHub Actions', 'vLLM',
  'PyTorch', 'RAG', 'Microservices', 'System Design'
];

/**
 * Two counter-scrolling technology rows.
 *
 * Doubles as connective tissue: it sits between sections so the eye never
 * lands on a hard boundary between one block of content and the next.
 *
 * The track holds the list twice and translates by exactly -50%, which is
 * what makes the loop seamless — the second copy is in the first copy's
 * position at the moment the animation resets.
 */
const MarqueeRow = ({ items, reverse = false, speed = 42 }) => (
  <div className="marquee-row">
    <div
      className={`marquee-track ${reverse ? 'reverse' : ''}`}
      style={{ '--marquee-duration': `${speed}s` }}
    >
      {[...items, ...items].map((item, i) => (
        <span className="marquee-item" key={`${item}-${i}`}>
          {item}
          <span className="marquee-sep" aria-hidden="true">✦</span>
        </span>
      ))}
    </div>
  </div>
);

const Marquee = () => (
  <div className="marquee" aria-hidden="true">
    <MarqueeRow items={ROW_ONE} speed={44} />
    <MarqueeRow items={ROW_TWO} reverse speed={52} />
  </div>
);

export default Marquee;

import React, { useEffect, useState } from 'react';
import './Preloader.css';

/**
 * A short intro curtain. Runs once per browser session so returning to the
 * tab or navigating back does not replay it.
 *
 * Deliberately brief (~1.5s) and it never blocks interaction: the page is
 * already mounted underneath, the curtain just lifts off it.
 */
const Preloader = ({ onDone }) => {
  const [count, setCount] = useState(0);
  const [lifting, setLifting] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion) {
      setGone(true);
      onDone?.();
      return;
    }

    let frame = null;
    let liftTimer = null;
    const start = performance.now();
    const DURATION = 1100;

    const tick = (now) => {
      const t = Math.min((now - start) / DURATION, 1);
      // Ease-out so the counter sprints then settles
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));

      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setLifting(true);
        liftTimer = window.setTimeout(() => {
          setGone(true);
          onDone?.();
        }, 900);
      }
    };

    frame = requestAnimationFrame(tick);
    document.body.style.overflow = 'hidden';

    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (liftTimer) clearTimeout(liftTimer);
      document.body.style.overflow = '';
    };
  }, [onDone]);

  if (gone) return null;

  return (
    <div className={`preloader ${lifting ? 'lifting' : ''}`} aria-hidden="true">
      <div className="preloader-inner">
        <div className="preloader-name">
          {'TEJAS'.split('').map((letter, i) => (
            <span
              key={i}
              className="preloader-letter"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="preloader-meta">
          <span className="preloader-role">Software Engineer</span>
          <span className="preloader-count">{String(count).padStart(3, '0')}</span>
        </div>
        <div className="preloader-track">
          <div
            className="preloader-fill"
            style={{ transform: `scaleX(${count / 100})` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Preloader;

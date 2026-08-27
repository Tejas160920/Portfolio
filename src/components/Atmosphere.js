import React, { useEffect, useRef } from 'react';
import './Atmosphere.css';

/**
 * The single continuous background for the entire page.
 *
 * Every section used to paint its own opaque colour, which produced a hard
 * seam at each boundary and made the page read as six stacked windows. This
 * component is the only thing that paints the page now; sections are
 * transparent frames laid over it.
 *
 * Layers, back to front:
 *   1. base wash        — the page colour
 *   2. aurora blobs     — three slow-drifting radial gradients
 *   3. grid             — faint blueprint rule, masked out at the edges
 *   4. spotlight        — follows the pointer, very subtle
 *   5. grain            — SVG noise, kills gradient banding
 */
const Atmosphere = () => {
  const rootRef = useRef(null);
  const spotlightRef = useRef(null);

  // Drive scroll + pointer through CSS custom properties so we never trigger
  // a React re-render, and never touch layout — only compositor properties.
  useEffect(() => {
    const root = rootRef.current;
    const spotlight = spotlightRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduceMotion) return;

    let scrollRaf = null;
    let pointerRaf = null;

    const applyScroll = () => {
      scrollRaf = null;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      // Aurora drifts slowly as you travel down the page, so the backdrop
      // evolves instead of repeating.
      root.style.setProperty('--scroll-progress', progress.toFixed(4));
    };

    const onScroll = () => {
      if (scrollRaf === null) scrollRaf = requestAnimationFrame(applyScroll);
    };

    const onPointerMove = (e) => {
      if (pointerRaf !== null) return;
      pointerRaf = requestAnimationFrame(() => {
        pointerRaf = null;
        if (!spotlight) return;
        spotlight.style.setProperty('--px', `${e.clientX}px`);
        spotlight.style.setProperty('--py', `${e.clientY}px`);
      });
    };

    applyScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', applyScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', applyScroll);
      window.removeEventListener('pointermove', onPointerMove);
      if (scrollRaf !== null) cancelAnimationFrame(scrollRaf);
      if (pointerRaf !== null) cancelAnimationFrame(pointerRaf);
    };
  }, []);

  return (
    <div className="atmosphere" ref={rootRef} aria-hidden="true">
      <div className="atm-base" />

      <div className="atm-aurora">
        <span className="atm-blob atm-blob-1" />
        <span className="atm-blob atm-blob-2" />
        <span className="atm-blob atm-blob-3" />
      </div>

      <div className="atm-grid" />
      <div className="atm-spotlight" ref={spotlightRef} />
      <div className="atm-grain" />
    </div>
  );
};

export default Atmosphere;

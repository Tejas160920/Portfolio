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
    // Phones disable these layers in CSS, so the listeners would only burn
    // frames writing to hidden elements.
    const isSmall = window.matchMedia('(max-width: 768px)').matches;
    if (reduceMotion || isSmall) return;

    const aurora = root.querySelector('.atm-aurora');
    const grid = root.querySelector('.atm-grid');

    let scrollRaf = null;
    let pointerRaf = null;

    // scrollHeight and innerHeight both force a synchronous layout when read,
    // so cache them and refresh only when the page actually changes size.
    let maxScroll = 0;
    const measureDoc = () => {
      maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    };

    const applyScroll = () => {
      scrollRaf = null;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      // Written straight onto the two layers. Driving them through a custom
      // property on the parent invalidated style for the whole subtree on
      // every scroll frame.
      const vh = window.innerHeight / 100;
      if (aurora) {
        aurora.style.transform =
          `translate3d(0, ${(progress * -8 * vh).toFixed(2)}px, 0)`;
      }
      if (grid) {
        grid.style.transform =
          `translate3d(0, ${(progress * 4 * vh).toFixed(2)}px, 0)`;
      }
    };

    const onScroll = () => {
      if (scrollRaf === null) scrollRaf = requestAnimationFrame(applyScroll);
    };

    const onPointerMove = (e) => {
      if (pointerRaf !== null) return;
      pointerRaf = requestAnimationFrame(() => {
        pointerRaf = null;
        if (!spotlight) return;
        spotlight.style.transform =
          `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      });
    };

    const onResize = () => {
      measureDoc();
      applyScroll();
    };

    measureDoc();
    applyScroll();
    const ro = new ResizeObserver(onResize);
    ro.observe(document.documentElement);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
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

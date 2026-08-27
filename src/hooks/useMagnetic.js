import { useEffect, useRef } from 'react';

/**
 * Magnetic hover: the element leans toward the pointer while it is nearby,
 * then springs back on exit. Attach the returned ref to any element.
 *
 *   const ref = useMagnetic({ strength: 0.35 });
 *   <button ref={ref}>Hire me</button>
 *
 * Pointer-coarse devices and reduced-motion users get a plain element.
 */
export const useMagnetic = ({ strength = 0.3, radius = 90 } = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (!finePointer || reduceMotion) return;

    let raf = null;
    let active = false;

    const onMove = (e) => {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const distance = Math.hypot(dx, dy);
        const reach = Math.max(rect.width, rect.height) / 2 + radius;

        if (distance < reach) {
          active = true;
          // Falls off with distance so the pull feels physical, not linear
          const falloff = 1 - distance / reach;
          el.style.transform =
            `translate3d(${dx * strength * falloff}px, ${dy * strength * falloff}px, 0)`;
        } else if (active) {
          active = false;
          el.style.transform = '';
        }
      });
    };

    const onLeave = () => {
      active = false;
      el.style.transform = '';
    };

    el.style.willChange = 'transform';
    el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      if (raf !== null) cancelAnimationFrame(raf);
      el.style.transform = '';
      el.style.willChange = '';
    };
  }, [strength, radius]);

  return ref;
};

/**
 * 3D tilt on hover, driven by CSS custom properties so the card's own
 * stylesheet decides how far to take it.
 */
export const useTilt = ({ max = 8 } = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (!finePointer || reduceMotion) return;

    let raf = null;

    const onMove = (e) => {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        el.style.setProperty('--tilt-x', `${(0.5 - py) * max * 2}deg`);
        el.style.setProperty('--tilt-y', `${(px - 0.5) * max * 2}deg`);
        // Also expose pointer position for a hover sheen
        el.style.setProperty('--mx', `${px * 100}%`);
        el.style.setProperty('--my', `${py * 100}%`);
      });
    };

    const onLeave = () => {
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [max]);

  return ref;
};

export default useMagnetic;

import { useEffect } from 'react';
import './CustomCursor.css';

/**
 * Two-part cursor: a small dot that tracks the pointer exactly, and a ring
 * that lags behind on a spring.
 *
 * Interactive targets are detected by event delegation on the document rather
 * than by attaching listeners to every matched node — the previous version
 * re-queried and re-bound the whole DOM on every mutation, which fought with
 * the chatbot and the portfolio tab switches.
 */

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, .sw-wheel, .portfolio-card, .domain-card-inner';

const CustomCursor = () => {
  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!finePointer || reduceMotion) return;

    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    dot.setAttribute('aria-hidden', 'true');
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.classList.add('has-custom-cursor');

    // target = where the pointer is; ring = where the ring has caught up to
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...target };
    let raf = null;
    let visible = false;

    const render = () => {
      // Critically-damped-ish follow: a fraction of the remaining gap per
      // frame gives the ring its weight without overshoot.
      ringPos.x += (target.x - ringPos.x) * 0.18;
      ringPos.y += (target.y - ringPos.y) * 0.18;

      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;

      raf = requestAnimationFrame(render);
    };

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        dot.classList.add('is-visible');
        ring.classList.add('is-visible');
      }
    };

    // Delegated hover state — one listener, survives any DOM change
    const onOver = (e) => {
      const hit = e.target.closest?.(INTERACTIVE);
      ring.classList.toggle('is-active', Boolean(hit));
    };

    const onDown = () => ring.classList.add('is-pressed');
    const onUp = () => ring.classList.remove('is-pressed');

    const onLeave = () => {
      visible = false;
      dot.classList.remove('is-visible');
      ring.classList.remove('is-visible');
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('pointerleave', onLeave, { passive: true });
    raf = requestAnimationFrame(render);

    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
      if (raf !== null) cancelAnimationFrame(raf);
      dot.remove();
      ring.remove();
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  return null;
};

export { CustomCursor, CustomCursor as default };

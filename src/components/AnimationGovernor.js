import { useEffect } from 'react';
import './AnimationGovernor.css';

/**
 * Pauses CSS animations in regions that are not on screen.
 *
 * The page runs a lot of infinite animations — aurora blobs, the marquee,
 * avatar rings, orbital rings, the skill wheel's centre pulse. Without this
 * they all keep running while scrolled far past, and the browser keeps
 * compositing them. Chrome in particular does not throttle offscreen CSS
 * animations, which is a large part of why this page felt heavier there than
 * in Safari.
 */
const REGIONS = ['#home', '#skills', '#portfolio', '#resume', '#domain', '#contact', '.marquee', '.footer'];

const AnimationGovernor = () => {
  useEffect(() => {
    const elements = REGIONS
      .map((selector) => document.querySelector(selector))
      .filter(Boolean);

    if (!elements.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-offscreen', !entry.isIntersecting);
        });
      },
      // A generous margin means a region resumes before it scrolls into view,
      // so nothing is ever caught mid-freeze.
      { rootMargin: '25% 0px 25% 0px', threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
};

export default AnimationGovernor;

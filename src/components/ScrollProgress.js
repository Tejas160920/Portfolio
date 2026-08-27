import React, { useEffect, useRef } from 'react';
import './ScrollProgress.css';

/**
 * Hairline reading-progress bar pinned to the top of the viewport.
 * Writes a CSS variable on a ref rather than setting React state, so
 * scrolling costs one style write per frame and zero re-renders.
 */
const ScrollProgress = () => {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let raf = null;
    // scrollHeight forces a synchronous layout. Cache it and refresh only
    // when the document actually changes size, not on every scroll frame.
    let maxScroll = 0;

    const measureDoc = () => {
      maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    };

    const update = () => {
      raf = null;
      const progress = maxScroll > 0
        ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1)
        : 0;
      bar.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };

    const onResize = () => {
      measureDoc();
      onScroll();
    };

    measureDoc();

    // Sections reveal and images load after mount, both of which change the
    // page height without a resize event.
    const ro = new ResizeObserver(onResize);
    ro.observe(document.documentElement);

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress-bar" ref={barRef} />
    </div>
  );
};

export default ScrollProgress;

import React, { useEffect, useRef, useState } from 'react';

/**
 * One scroll-reveal vocabulary for the whole page.
 *
 * Replaces the copy-pasted IntersectionObserver + setTimeout stagger that
 * every section used to carry its own version of. Styles live in index.css
 * under `.reveal` so the animation stays declarative and interruptible.
 */
const Reveal = ({
  children,
  as: Tag = 'div',
  animation = 'up',      // up | fade | left | right | scale | blur
  delay = 0,             // ms
  threshold = 0.15,
  rootMargin = '0px 0px -12% 0px',
  once = true,
  className = '',
  style,
  ...rest
}) => {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Anything already on screen at mount reveals immediately, avoids a
    // blank first paint when the browser restores a scroll position.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setRevealed(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return (
    <Tag
      ref={ref}
      data-animation={animation}
      className={`reveal ${revealed ? 'is-revealed' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;

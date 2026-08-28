import { useEffect, useState } from 'react';

/**
 * Tracks which section is currently under the reading line.
 *
 * Uses an IntersectionObserver rather than measuring rects on scroll, so it
 * costs nothing while scrolling. Shared by the desktop navbar and the mobile
 * tab bar so both stay in sync without duplicating the logic.
 */
export const useActiveSection = (ids, { rootMargin = '-35% 0px -55% 0px' } = {}) => {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const seen = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => seen.set(entry.target.id, entry));

        // Of the sections currently crossing the band, take the highest one
        let best = null;
        seen.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (!best || entry.boundingClientRect.top < best.boundingClientRect.top) {
            best = entry;
          }
        });

        if (best) setActive(best.target.id);
      },
      { rootMargin, threshold: 0 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // ids is a module-level constant at every call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootMargin]);

  return [active, setActive];
};

export default useActiveSection;

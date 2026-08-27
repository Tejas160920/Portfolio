import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Navbar.css';
import { useMagnetic } from '../hooks/useMagnetic';

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'skills', label: 'Skills' },
  { id: 'portfolio', label: 'Work' },
  { id: 'resume', label: 'Resume' },
  { id: 'domain', label: 'Domains' },
  { id: 'contact', label: 'Contact' }
];

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const listRef = useRef(null);
  const hireRef = useMagnetic({ strength: 0.3 });

  // Active section via IntersectionObserver.
  // The previous version measured all six sections with getBoundingClientRect
  // on every scroll frame — six forced synchronous layouts per frame, which
  // was a large part of the scroll jank. The observer costs nothing on scroll.
  useEffect(() => {
    const seen = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          seen.set(entry.target.id, entry);
        });

        // The visible section closest to the top of the viewport wins
        let best = null;
        seen.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (!best || entry.boundingClientRect.top < best.boundingClientRect.top) {
            best = entry;
          }
        });

        if (best) setActiveSection(best.target.id);
      },
      {
        // A band across the upper-middle of the viewport acts as the
        // reading line the old code computed by hand.
        rootMargin: '-35% 0px -55% 0px',
        threshold: 0
      }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Navbar background state. Reads only scrollY, which is free.
  useEffect(() => {
    let raf = null;
    let last = false;

    const measure = () => {
      raf = null;
      const next = window.scrollY > 40;
      if (next !== last) {
        last = next;
        setScrolled(next);
      }
    };

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  // Slide the highlight pill under the active link. Measured from the DOM
  // rather than hard-coded, so it stays correct at any font size.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const move = () => {
      const activeEl = list.querySelector('.nav-link.active');
      if (!activeEl) return;
      const listRect = list.getBoundingClientRect();
      const rect = activeEl.getBoundingClientRect();
      list.style.setProperty('--pill-x', `${rect.left - listRect.left}px`);
      list.style.setProperty('--pill-w', `${rect.width}px`);
      list.style.setProperty('--pill-o', '1');
    };

    move();
    window.addEventListener('resize', move);
    // Web fonts land after first paint and shift the measurement
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(move).catch(() => {});
    }

    return () => window.removeEventListener('resize', move);
  }, [activeSection]);

  const scrollToSection = useCallback((sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} aria-label="Primary">
        <div className="nav-container">
          <ul className="nav-links" ref={listRef}>
            <li className="nav-pill" aria-hidden="true" />
            {SECTIONS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`nav-link ${activeSection === id ? 'active' : ''}`}
                  aria-current={activeSection === id ? 'true' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(id);
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <a
        ref={hireRef}
        href="mailto:tejasgaikwad16092002@gmail.com"
        className="hire-me-button"
      >
        <span className="hire-dot" />
        Hire me
      </a>
    </>
  );
};

export default Navbar;

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

  // Which section is under the reading line, and has the page moved at all
  useEffect(() => {
    let raf = null;

    const measure = () => {
      raf = null;
      setScrolled(window.scrollY > 40);

      // The section straddling a line ~40% down the viewport wins.
      const line = window.innerHeight * 0.4;
      let current = SECTIONS[0].id;

      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= line && rect.bottom >= line) {
          current = id;
          break;
        }
        // Already scrolled past its top — keep it as the running best
        if (rect.top <= line) current = id;
      }

      setActiveSection(current);
    };

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
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

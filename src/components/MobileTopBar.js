import React from 'react';

/**
 * Slim app-style header for phones.
 *
 * The site had no mark on mobile once the desktop nav was hidden, and the
 * theme toggle floated over scrolling content with nothing behind it. This
 * gives both a home. Styles live in MobileNav.css alongside the tab bar,
 * since the two form one navigation frame.
 */
const MobileTopBar = () => (
  <header className="mobile-topbar">
    <button
      type="button"
      className="mobile-topbar-mark"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <span className="mobile-topbar-monogram">TG</span>
      <span className="mobile-topbar-name">Tejas Gaikwad</span>
    </button>
  </header>
);

export default MobileTopBar;

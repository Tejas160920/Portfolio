import React, { useCallback } from 'react';
import { Home, LayoutGrid, FileText, Cpu, Mail } from 'lucide-react';
import './MobileNav.css';
import { useActiveSection } from '../hooks/useActiveSection';

const TABS = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'portfolio', label: 'Work', Icon: LayoutGrid },
  { id: 'resume', label: 'Resume', Icon: FileText },
  { id: 'domain', label: 'Skills', Icon: Cpu },
  { id: 'contact', label: 'Contact', Icon: Mail }
];

const IDS = TABS.map((t) => t.id);

/**
 * Fixed bottom tab bar — the navigation pattern people already know from
 * native apps. Replaces the desktop pill nav below 768px, so reaching any
 * section is one thumb tap instead of a long scroll.
 */
const MobileNav = () => {
  const [active, setActive] = useActiveSection(IDS);

  const go = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setActive(id);
  }, [setActive]);

  return (
    <nav className="mobile-nav" aria-label="Sections">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className={`mobile-nav-item ${active === id ? 'active' : ''}`}
          aria-current={active === id ? 'true' : undefined}
          onClick={() => go(id)}
        >
          <span className="mobile-nav-icon">
            <Icon size={19} strokeWidth={2} />
          </span>
          <span className="mobile-nav-label">{label}</span>
        </button>
      ))}
    </nav>
  );
};

export default MobileNav;

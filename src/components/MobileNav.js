import React, { useCallback } from 'react';
import { Home, LayoutGrid, FileText, Mail, Sparkles } from 'lucide-react';
import './MobileNav.css';
import { useActiveSection } from '../hooks/useActiveSection';

const TABS = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'portfolio', label: 'Work', Icon: LayoutGrid },
  { id: 'ai', label: 'Ask AI', Icon: Sparkles, action: true },
  { id: 'resume', label: 'Resume', Icon: FileText },
  { id: 'contact', label: 'Contact', Icon: Mail }
];

const IDS = TABS.filter((t) => !t.action).map((t) => t.id);

/**
 * Bottom tab bar with an elevated centre action.
 *
 * Ask AI used to be a floating pill that sat on top of the hero copy. Making
 * it the raised middle tab is the pattern people already know from Instagram
 * and X. It reads as the primary action instead of an obstruction, and it
 * frees the screen of a permanently overlapping control.
 */
const MobileNav = () => {
  const [active, setActive] = useActiveSection(IDS);

  const go = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setActive(id);
  }, [setActive]);

  const openAI = useCallback(() => {
    window.dispatchEvent(new CustomEvent('openTejasAI'));
  }, []);

  return (
    <nav className="mobile-nav" aria-label="Sections">
      {TABS.map(({ id, label, Icon, action }) =>
        action ? (
          <button
            key={id}
            type="button"
            className="mobile-nav-item mobile-nav-action"
            onClick={openAI}
            aria-label="Ask Tejas's AI assistant"
          >
            <span className="mobile-nav-fab">
              <Icon size={20} strokeWidth={2.1} />
            </span>
            <span className="mobile-nav-label">{label}</span>
          </button>
        ) : (
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
        )
      )}
    </nav>
  );
};

export default MobileNav;

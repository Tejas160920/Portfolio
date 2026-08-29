import React from 'react';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import './Footer.css';
import { composeUrl } from '../hooks/useEmailCopy';

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/Tejas160920', Icon: Github },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/tejas-gaikwad-342199297/',
    Icon: Linkedin
  },
  { label: 'Email', href: composeUrl('Hello from your portfolio'), Icon: Mail }
];

const Footer = () => {
  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="footer">
      {/* Oversized wordmark, cropped by the footer's own overflow */}
      <div className="footer-wordmark" aria-hidden="true">TEJAS</div>

      <div className="footer-inner">
        <div className="footer-left">
          <p className="footer-line">
            Designed &amp; built by Tejas Gaikwad
          </p>
          <p className="footer-sub">
            React · Firebase · Vercel — © {new Date().getFullYear()}
          </p>
        </div>

        <nav className="footer-links" aria-label="Social links">
          {LINKS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              className="footer-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <button className="footer-top" onClick={scrollTop} aria-label="Back to top">
          <ArrowUp size={16} strokeWidth={2.2} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;

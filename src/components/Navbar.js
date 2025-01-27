import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll events for navbar background and active section
  useEffect(() => {
    const handleScroll = () => {
      // Add background when scrolled past 50px
      setScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = ['home', 'portfolio', 'resume','domain' ];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveSection(sectionId);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <ul className="nav-links">
          {['HOME', 'PORTFOLIO', 'RESUME', 'DOMAIN'].map((item) => (
            <li key={item}>
<a
  href={`#${item.toLowerCase()}`}
  className={`nav-link ${activeSection === item.toLowerCase() ? 'active' : ''}`}
  onClick={(e) => {
    e.preventDefault(); // Prevent default anchor behavior
    scrollToSection(item.toLowerCase());
  }}
>
  {item}
  <span className="nav-line"></span>
</a>

            </li>
          ))}
        </ul>
        <button 
  className="hire-me-button" 
  onClick={() => window.location.href = "mailto:tejasgaikwad16092002@gmail.com"}
>
  Hire me!
</button>
      </div>
    </nav>
  );
};

export default Navbar;
import React, { useState, useEffect, useRef } from 'react';
import { FiExternalLink, FiCode, FiAward, FiZap, FiFileText } from "react-icons/fi";
import './Portfolio.css';
import {
  CodeBracket,
  CurlyBrace,
  CodeSlash,
  Parenthesis,
  CodeDot,
  CodeBlockDecor,
  FloatingGraphic
} from './CodeGraphics';

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const sectionRef = useRef(null);

  // All projects data
  const allProjects = [
    {
      image: '/jobleap.png',
      alt: 'Jobleap',
      year: '2025',
      title: 'Jobleap - AI-Powered Job Search & Chrome Extension',
      description: 'AI-powered job platform with Chrome extension that automates multi-step applications across major ATS systems with 90%+ accuracy.',
      tags: ['React', 'Node.js', 'MongoDB', 'Docker', 'OAuth', 'LLM APIs'],
      links: [
        { text: 'View Project', url: 'https://github.com/Tejas160920/Jobleap' },
        { text: 'Live', url: 'https://www.jobleap.work', external: true }
      ]
    },
    {
      image: '/rapcut.png',
      alt: 'Rapcut',
      year: '2025',
      title: 'Rapcut - LLM-Powered Image Text Editor SaaS',
      description: 'SaaS platform for AI-powered text editing in images using Google Gemini Vision, preserving original fonts, colors, and layouts.',
      tags: ['React 19', 'Firebase', 'AWS S3', 'Gemini Vision', 'Next.js'],
      links: [
        { text: 'View Project', url: 'https://github.com/Tejas160920/Rapcut' },
        { text: 'Live', url: 'https://rapcut.app/', external: true }
      ]
    },
    {
      image: '/memento.jpg',
      alt: 'Memento',
      year: '2025',
      title: 'Memento',
      description: 'A caregiving app for dementia patients featuring facial recognition, voice reminders, GPS safety monitoring, and medical data collection.',
      tags: ['TypeScript', 'OpenCV', 'DeepFace', 'GPS'],
      links: [
        { text: 'View Project', url: 'https://github.com/Tejas160920/Memento' }
      ]
    },
    {
      image: '/rag.jpg',
      alt: 'Tejas AI',
      year: '2025',
      title: 'Tejas AI - Portfolio Assistant',
      description: 'An intelligent RAG-powered chatbot that answers questions about me. Built with FastAPI, FAISS vector search, Sentence Transformers, and Llama 3.3 70B via Groq.',
      tags: ['RAG', 'FastAPI', 'FAISS', 'Llama 3.3', 'HuggingFace'],
      links: [
        { text: 'Try Tejas AI', url: '#tejas-ai', isChatbot: true },
        { text: 'GitHub', url: 'https://github.com/Tejas160920/Tejas-RAG-model', external: true }
      ]
    },
    {
      image: '/agribot1.jpeg',
      alt: 'Agribot',
      year: '2023',
      title: 'AgriBot',
      description: 'Developed a precision farming robot for weed detection, depth estimation, and autonomous navigation.',
      tags: ['YOLOv7', 'OpenCV', 'Stereo Vision'],
      links: [{ text: 'View Project', url: 'https://github.com/Tejas160920/Agribot' }]
    },
    {
      image: '/tryonn.jpg',
      alt: 'Virtual Try-On',
      year: '2024',
      title: 'Virtual Try-On',
      description: 'This Chrome extension lets you try on clothes virtually while shopping online, providing a fun and interactive way to see how outfits look on you.',
      tags: ['Chrome extension'],
      links: [
        { text: 'View Project', url: 'https://github.com/Tejas160920/Virtual-Try-On' },
        { text: 'Try', url: 'https://chromewebstore.google.com/detail/Virtual%20Clothes%20Try-on/hpogkihhfoglihcgmhfhhngefkjgehjf', external: true }
      ]
    },
    {
      image: '/bird.gif',
      alt: 'FlockFlow',
      year: '2024',
      title: 'FlockFlow: Parallel Flocking Simulation',
      description: 'This project uses parallel processing to simulate flocking behavior, making the simulation run faster and smoother.',
      tags: ['Apache Spark'],
      links: [{ text: 'View Project', url: 'https://github.com/Tejas160920/FlockFlow-Parallel-Flocking-Simulation/tree/main' }]
    },
    {
      image: '/brain.jpeg',
      alt: 'Brain Tumor',
      year: '2023',
      title: 'Brain Tumor',
      description: 'Developed a deep learning model for brain tumor classification, achieving 75% accuracy on test data using CNNs.',
      tags: ['Deep Learning', 'CNN'],
      links: [{ text: 'View Project', url: 'https://github.com/Tejas160920/Brain-Tumor-Classification' }]
    },
    {
      image: '/portfolio.jpeg',
      alt: 'Portfolio',
      year: '2024',
      title: 'Personal Portfolio',
      description: 'A personal portfolio site to showcase my projects, skills, and experience.',
      tags: ['React', 'Javascript'],
      links: [
        { text: 'View Project', url: '#' },
        { text: 'Visit', url: 'https://www.npmjs.com/package/circledot-cursor?activeTab=readme', external: true }
      ]
    },
    {
      image: '/demo.gif',
      alt: 'HoverMorph',
      year: '2024',
      title: 'HoverMorph',
      description: 'A React library for animated, customizable cursors with responsive hover effects, enhancing UI interactions.',
      tags: ['React', 'JavaScript', 'npm Package'],
      links: [
        { text: 'View Project', url: 'https://github.com/Tejas160920/HoverMorph' },
        { text: 'Try', url: 'https://www.npmjs.com/package/circledot-cursor?activeTab=readme', external: true }
      ]
    }
  ];

  // Projects to display (6 by default, all when expanded)
  const displayedProjects = showAllProjects ? allProjects : allProjects.slice(0, 6);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setVisibleCards([]); // Reset for stagger animation
    // Re-trigger stagger animation
    setTimeout(() => {
      const cards = document.querySelectorAll('.portfolio-card');
      cards.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards(prev => [...prev, index]);
        }, index * 100);
      });
    }, 50);
  };

  // Intersection Observer for section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stagger cards
          const cards = document.querySelectorAll('.portfolio-card');
          cards.forEach((_, index) => {
            setTimeout(() => {
              setVisibleCards(prev => [...prev, index]);
            }, index * 100);
          });
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Handle ripple effect on buttons
  const handleRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${e.clientX - rect.left - radius}px`;
    ripple.style.top = `${e.clientY - rect.top - radius}px`;
    ripple.classList.add('ripple');

    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) existingRipple.remove();

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <section id="portfolio" className="portfolio-section" ref={sectionRef}>
      {/* Floating orbs background */}
      <div className="portfolio-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Animated Code Decorations */}
      {isVisible && (
        <div className="code-decorations">
          {/* Top right - Curly brace */}
          <FloatingGraphic amplitude={16} duration={5} style={{ top: '3%', right: '5%' }}>
            <CurlyBrace direction="right" size={100} delay={0.3} />
          </FloatingGraphic>

          {/* Top left - Code bracket */}
          <FloatingGraphic amplitude={14} duration={5.5} delay={0.5} style={{ top: '5%', left: '4%' }} className="hide-mobile">
            <CodeBracket direction="left" size={80} delay={0.5} />
          </FloatingGraphic>

          {/* Bottom left - Parenthesis */}
          <FloatingGraphic amplitude={12} duration={6} delay={1} style={{ bottom: '5%', left: '3%' }}>
            <Parenthesis direction="left" size={90} delay={0.7} />
          </FloatingGraphic>

          {/* Bottom right - Slash and bracket */}
          <FloatingGraphic amplitude={15} duration={5} delay={0.8} style={{ bottom: '8%', right: '6%' }} className="hide-tablet">
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <CodeSlash size={70} delay={0.9} />
              <CodeBracket direction="right" size={80} delay={1} />
            </div>
          </FloatingGraphic>

          {/* Code block decoration */}
          <FloatingGraphic amplitude={8} duration={7} delay={1.5} style={{ top: '40%', right: '2%' }} className="hide-mobile">
            <CodeBlockDecor size={120} delay={1.2} />
          </FloatingGraphic>

          {/* Decorative dots */}
          <FloatingGraphic amplitude={6} duration={3} style={{ top: '25%', left: '2%' }} className="hide-tablet">
            <CodeDot size={12} delay={1.4} color="#FF4081" />
          </FloatingGraphic>
          <FloatingGraphic amplitude={8} duration={3.5} style={{ bottom: '30%', right: '3%' }} className="hide-mobile">
            <CodeDot size={10} delay={1.6} color="#00BCD4" />
          </FloatingGraphic>
        </div>
      )}

      <div className="portfolio-container">
        <h2 className={`portfolio-title ${isVisible ? 'title-visible' : ''}`}>
          Featured <span className="title-highlight">Portfolio</span>
        </h2>

        {/* Tabs */}
        <div className={`portfolio-tabs ${isVisible ? 'tabs-visible' : ''}`}>
          {[
            { id: 'projects', label: 'Projects', icon: FiCode },
            { id: 'certifications', label: 'Certifications', icon: FiAward },
            { id: 'hackathons', label: 'Hackathons', icon: FiZap },
            { id: 'publications', label: 'Publications', icon: FiFileText }
          ].map((tab, index) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={(e) => {
                  handleRipple(e);
                  handleTabClick(tab.id);
                }}
                className={`tab-heading ripple-container ${activeTab === tab.id ? 'active' : ''}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <IconComponent className="tab-icon" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="portfolio-content">
          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <>
              <div className="tab-content active">
                {displayedProjects.map((project, index) => (
                  <div
                    key={project.title}
                    className={`portfolio-card ${visibleCards.includes(index) ? 'card-visible' : ''}`}
                    style={{ '--card-index': index }}
                  >
                    <div className="card-image">
                      <img src={project.image} alt={project.alt} />
                    </div>
                    <div className="card-content">
                      <div className="card-header">
                        <span className="year">{project.year}</span>
                      </div>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="tech-stack">
                        {project.tags.map(tag => (
                          <span key={tag} className="tech-tag">{tag}</span>
                        ))}
                      </div>
                      <div className="card-actions">
                        {project.links.map(link => (
                          <button
                            key={link.text}
                            className="card-btn ripple-container"
                            onClick={(e) => {
                              handleRipple(e);
                              if (link.isChatbot) {
                                // Open the Tejas AI chatbot
                                window.dispatchEvent(new CustomEvent('openTejasAI'));
                              } else {
                                window.open(link.url, '_blank');
                              }
                            }}
                          >
                            {link.text} {link.external && <FiExternalLink />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show More/Less Button */}
              {allProjects.length > 6 && (
                <div className="show-more-container">
                  <button
                    className="show-more-btn ripple-container"
                    onClick={(e) => {
                      handleRipple(e);
                      setShowAllProjects(!showAllProjects);
                      if (!showAllProjects) {
                        // Trigger animation for new cards
                        setTimeout(() => {
                          const newIndices = allProjects.slice(6).map((_, i) => 6 + i);
                          newIndices.forEach((idx, i) => {
                            setTimeout(() => {
                              setVisibleCards(prev => [...prev, idx]);
                            }, i * 100);
                          });
                        }, 50);
                      }
                    }}
                  >
                    <span className="btn-text">
                      {showAllProjects ? 'Show Less' : 'Show More'}
                    </span>
                    <span className={`btn-icon ${showAllProjects ? 'rotated' : ''}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                    <span className="btn-count">
                      {showAllProjects ? '' : `+${allProjects.length - 6}`}
                    </span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* Certifications Tab */}
          {activeTab === 'certifications' && (
            <div className="tab-content active">
              <div className={`portfolio-card ${visibleCards.includes(0) ? 'card-visible' : ''}`}>
                <div className="card-image">
                  <img src="/certi.jpeg" alt="IITM Foundation" />
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <span className="year">2022</span>
                  </div>
                  <h3>IITM Foundation Certificate: Programming and Data Science</h3>
                  <p>April 2022</p>
                  <div className="tech-stack">
                    <span className="tech-tag">Programming</span>
                    <span className="tech-tag">Data Science</span>
                    <span className="tech-tag">IITM</span>
                  </div>
                  <div className="card-actions">
                    <a href="https://drive.google.com/file/d/1sc5H3Rp9Q3dUGYH-iAe5h5aPTyr535iF/view?usp=sharing" className="card-btn" target="_blank" rel="noopener noreferrer">
                      View Certificate
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hackathons Tab */}
          {activeTab === 'hackathons' && (
            <div className="tab-content active">
              <div className={`portfolio-card ${visibleCards.includes(0) ? 'card-visible' : ''}`}>
                <div className="card-image">
                  <img src="/hack.jpeg" alt="Hackathon" />
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <span className="year">2023</span>
                  </div>
                  <h3>APROJECTATHON '23</h3>
                  <p>Secured 3rd runner-up for creating 'Agribot,' a precision farming robot that optimized weed and disease detection.</p>
                  <div className="tech-stack">
                    <span className="tech-tag">Python</span>
                    <span className="tech-tag">YOLOv7</span>
                    <span className="tech-tag">OpenCV</span>
                  </div>
                  <div className="card-actions">
                    <a href="https://drive.google.com/file/d/183jvEqk7kV62c7u3wTyoZKRdW6Mz_oP-/view?usp=sharing" className="card-btn" target="_blank" rel="noopener noreferrer">
                      View Project
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Publications Tab */}
          {activeTab === 'publications' && (
            <div className="tab-content active">
              <div className={`portfolio-card ${visibleCards.includes(0) ? 'card-visible' : ''}`}>
                <div className="card-image">
                  <img src="/publi.jpeg" alt="Publication" />
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <span className="year">2023</span>
                  </div>
                  <h3>Crop Weed Detection, Depth Estimation, and Disease Diagnosis</h3>
                  <p>Published in Springer PCCDA 2023, advancing precision agriculture with AI-driven weed and disease detection.</p>
                  <div className="tech-stack">
                    <span className="tech-tag">Research</span>
                    <span className="tech-tag">ML</span>
                  </div>
                  <div className="card-actions">
                    <a href="https://link.springer.com/chapter/10.1007/978-981-99-4626-6_5" className="card-btn" target="_blank" rel="noopener noreferrer">
                      Read Paper
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;

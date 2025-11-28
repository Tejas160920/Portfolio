// Domains.js
import React, { useEffect, useRef, useState } from 'react';
import { Code, Globe, Database, Cpu, Server } from 'lucide-react';
import './Domains.css';
import {
  CodeBracket,
  CurlyBrace,
  Parenthesis,
  EqualSign,
  CodeDot,
  FloatingGraphic
} from './CodeGraphics';

const DomainsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stagger card animations
          const cards = document.querySelectorAll('.domain-card');
          cards.forEach((_, index) => {
            setTimeout(() => {
              setVisibleCards(prev => [...prev, index]);
            }, index * 120);
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

  const domains = [
    {
      icon: <Cpu className="domain-icon" />,
      name: "Machine Learning",
      description: "Deep Learning, Neural Networks, Computer Vision",
      color: "#4CAF50"
    },
    {
      icon: <Globe className="domain-icon" />,
      name: "Web Development",
      description: "Full Stack, React, Node.js, MongoDB",
      color: "#4CAF50"
    },
    {
      icon: <Database className="domain-icon" />,
      name: "Data Science",
      description: "Data Analysis, Visualization, Big Data",
      color: "#4CAF50"
    },
    {
      icon: <Code className="domain-icon" />,
      name: "Software Development",
      description: "Python, Java, C++, System Design",
      color: "#4CAF50"
    },
    {
      icon: <Server className="domain-icon" />,
      name: "Cloud Computing",
      description: "AWS, Azure, Docker, Kubernetes",
      color: "#4CAF50"
    },
  ];

  return (
    <section id="domain" className="domains-section" ref={sectionRef}>
      {/* Animated Code Decorations */}
      {isVisible && (
        <div className="code-decorations">
          {/* Top right - Curly brace */}
          <FloatingGraphic amplitude={18} duration={5} style={{ top: '5%', right: '5%' }}>
            <CurlyBrace direction="right" size={100} delay={0.3} />
          </FloatingGraphic>

          {/* Top left - Parenthesis */}
          <FloatingGraphic amplitude={15} duration={6} delay={0.5} style={{ top: '10%', left: '3%' }} className="hide-mobile">
            <Parenthesis direction="left" size={80} delay={0.5} />
          </FloatingGraphic>

          {/* Bottom left - Code bracket */}
          <FloatingGraphic amplitude={12} duration={5.5} delay={1} style={{ bottom: '10%', left: '5%' }}>
            <CodeBracket direction="left" size={90} delay={0.7} />
          </FloatingGraphic>

          {/* Bottom right - Equal sign */}
          <FloatingGraphic amplitude={10} duration={4} delay={0.8} style={{ bottom: '15%', right: '8%' }} className="hide-tablet">
            <EqualSign size={60} delay={1} />
          </FloatingGraphic>

          {/* Decorative dots */}
          <FloatingGraphic amplitude={8} duration={3} style={{ top: '40%', right: '3%' }} className="hide-mobile">
            <CodeDot size={12} delay={1.2} color="#FFEA00" />
          </FloatingGraphic>
          <FloatingGraphic amplitude={6} duration={3.5} style={{ bottom: '40%', left: '2%' }} className="hide-tablet">
            <CodeDot size={10} delay={1.5} color="#7C4DFF" />
          </FloatingGraphic>
        </div>
      )}

      <div className="domains-container">
        <h2 className={`domains-title ${isVisible ? 'title-visible' : ''}`}>
          Domains I <span className="title-highlight">Work With</span>
        </h2>

        <div className="domains-grid">
          {domains.map((domain, index) => (
            <div
              key={domain.name}
              className={`domain-card ${visibleCards.includes(index) ? 'card-visible' : ''}`}
              style={{"--card-index": index}}
            >
              <div className="domain-content">
                <div className="domain-icon-wrapper">
                  {domain.icon}
                </div>
                <h3 className="domain-name">
                  {domain.name}
                </h3>
                <p className="domain-description">
                  {domain.description}
                </p>
              </div>
              <div className="card-glow"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DomainsSection;

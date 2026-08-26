import React, { useEffect, useRef, useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import './Resume.css';
import {
  CodeSlash,
  HashSymbol,
  Semicolon,
  ArrowFunction,
  CodeDot,
  GlowRing,
  FloatingGraphic
} from './CodeGraphics';

const Resume = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stagger timeline items
          const items = document.querySelectorAll('.timeline-item');
          items.forEach((_, index) => {
            setTimeout(() => {
              setVisibleItems(prev => [...prev, index]);
            }, index * 150);
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

  return (
    <section id="resume" className="resume-section" ref={sectionRef}>
      {/* Animated Code Decorations */}
      {isVisible && (
        <div className="code-decorations">
          {/* Top right - Hash symbol */}
          <FloatingGraphic amplitude={15} duration={5} style={{ top: '5%', right: '6%' }}>
            <HashSymbol size={80} delay={0.3} />
          </FloatingGraphic>

          {/* Top left - Arrow function */}
          <FloatingGraphic amplitude={12} duration={5.5} delay={0.5} style={{ top: '8%', left: '5%' }} className="hide-mobile">
            <ArrowFunction size={70} delay={0.5} />
          </FloatingGraphic>

          {/* Bottom left - Code slash */}
          <FloatingGraphic amplitude={18} duration={6} delay={1} style={{ bottom: '8%', left: '4%' }}>
            <CodeSlash size={90} delay={0.8} />
          </FloatingGraphic>

          {/* Bottom right - Semicolon */}
          <FloatingGraphic amplitude={10} duration={4.5} delay={0.8} style={{ bottom: '15%', right: '5%' }} className="hide-tablet">
            <Semicolon size={60} delay={1} />
          </FloatingGraphic>

          {/* Decorative elements */}
          <FloatingGraphic amplitude={8} duration={3} style={{ top: '35%', right: '3%' }} className="hide-mobile">
            <CodeDot size={14} delay={1.2} color="#4CAF50" />
          </FloatingGraphic>
          <GlowRing size={70} delay={1.5} style={{ top: '60%', left: '2%' }} className="hide-tablet" />
        </div>
      )}

      <div className="resume-container">
        <div className="resume-header">
          <h2 className={`resume-title ${isVisible ? 'title-visible' : ''}`}>
            My <span className="title-highlight">Resume</span>
          </h2>
          <a
            href="/Tejas_Gaikwad_Resume.pdf"
            download="Tejas_Gaikwad_Resume.pdf"
            className={`download-resume-btn ${isVisible ? 'btn-visible' : ''}`}
          >
            <FiDownload className="download-icon" />
            <span>Download CV</span>
          </a>
        </div>

        <div className="resume-content">
          {/* Education Column */}
          <div className={`resume-column ${isVisible ? 'column-visible' : ''}`} style={{ '--column-delay': '0.1s' }}>
            <div className="column-header">
              <h3>Education</h3>
              <div className="header-line"></div>
            </div>

            <div className="timeline">
              <div className={`timeline-item ${visibleItems.includes(0) ? 'item-visible' : ''}`}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="time-badge">Dec 2025</div>
                  <div className="content-card">
                    <h4>Master of Science in Computer Science &amp; Engineering</h4>
                    <p className="institution">State University of New York at Buffalo, USA</p>
                    <p className="duration">GPA: 3.6</p>
                  </div>
                </div>
              </div>

              <div className={`timeline-item ${visibleItems.includes(1) ? 'item-visible' : ''}`}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="time-badge">Aug 2024</div>
                  <div className="content-card">
                    <h4>Bachelor of Technology in Electronics &amp; Telecommunication</h4>
                    <p className="institution">Vishwakarma Institute of Technology, Pune, India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Column */}
          <div className={`resume-column ${isVisible ? 'column-visible' : ''}`} style={{ '--column-delay': '0.3s' }}>
            <div className="column-header">
              <h3>Work Experience</h3>
              <div className="header-line"></div>
            </div>

            <div className="timeline">
              <div className={`timeline-item ${visibleItems.includes(2) ? 'item-visible' : ''}`}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="time-badge">Mar 2026 - Present</div>
                  <div className="content-card">
                    <h4>Software Engineer</h4>
                    <p className="institution">DoorDash, New York, USA</p>
                    <ul className="experience-points">
                      <li>Build cloud infrastructure on AWS and Kubernetes for production LLM and vision model workloads.</li>
                      <li>Automate deployments with Terraform and CI/CD, and tune model serving for better GPU utilization.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={`timeline-item ${visibleItems.includes(3) ? 'item-visible' : ''}`}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="time-badge">Jul 2025 - Dec 2025</div>
                  <div className="content-card">
                    <h4>Software Engineer</h4>
                    <p className="institution">Capital One, USA</p>
                    <ul className="experience-points">
                      <li>Built Python backend services and REST APIs with FastAPI, PostgreSQL, and DynamoDB.</li>
                      <li>Worked on RAG pipelines and Redis caching to improve search relevance and response times.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={`timeline-item ${visibleItems.includes(4) ? 'item-visible' : ''}`}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="time-badge">Feb 2022 - Jul 2024</div>
                  <div className="content-card">
                    <h4>Software Engineer</h4>
                    <p className="institution">Hexaware Technologies, India</p>
                    <ul className="experience-points">
                      <li>Developed REST APIs and backend features using Java, Spring Boot, and SQL.</li>
                      <li>Refactored a monolith into microservices and set up CI/CD pipelines for faster releases.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;

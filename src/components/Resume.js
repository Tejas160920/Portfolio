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
                  <div className="time-badge">August 2024 - Present</div>
                  <div className="content-card">
                    <h4>Master of Computer Science</h4>
                    <p className="institution">State University of New York at Buffalo</p>
                    <p className="duration">Fall 2024 - Present</p>
                    <div className="courses">
                      <span className="course-tag">Machine Learning</span>
                      <span className="course-tag">Analysis of Algorithms</span>
                      <span className="course-tag">Data Intensive Computing</span>
                      <span className="course-tag">Computer Security</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`timeline-item ${visibleItems.includes(1) ? 'item-visible' : ''}`}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="time-badge">June 2020 - June 2024</div>
                  <div className="content-card">
                    <h4>Bachelor of Technology in Electronics and Telecommunication Engineering</h4>
                    <p className="institution">Vishwakarma Institute of Technology, Pune, India</p>
                    <p className="duration">July 2020 - August 2024</p>
                    <div className="courses">
                      <span className="course-tag">Programming and Data Science in Python</span>
                      <span className="course-tag">Data Science</span>
                      <span className="course-tag">Computer Vision</span>
                      <span className="course-tag">Data Structures and Algorithms</span>
                      <span className="course-tag">Object-Oriented Programming (Java)</span>
                      <span className="course-tag">Web Technology</span>
                      <span className="course-tag">IoT</span>
                    </div>
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
                  <div className="time-badge">June 2025 - Present</div>
                  <div className="content-card">
                    <h4>Full Stack Developer Intern</h4>
                    <p className="institution">FindMe (Remote, USA)</p>
                    <ul className="experience-points">
                      <li>Built responsive and interactive user interfaces using Next.js, React, Tailwind CSS, and Zod with modern component architecture and state management using Zustand.</li>
                      <li>Developed RESTful APIs using Node.js, Express.js, and MongoDB with proper validation, error handling, and secure user data management.</li>
                      <li>Collaborated on feature development using Git version control, pull requests, and testing to ensure maintainable and production-ready code.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={`timeline-item ${visibleItems.includes(3) ? 'item-visible' : ''}`}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="time-badge">July 2023 - June 2024</div>
                  <div className="content-card">
                    <h4>Software Development Intern</h4>
                    <p className="institution">SmartLeaven Digital Systems Pvt Ltd, Pune, India</p>
                    <ul className="experience-points">
                      <li>Developed real-time detection systems using YOLO (v7, v8) for object detection and OpenCV for lane detection.</li>
                      <li>Generated high-definition datasets of over 7GB of images for machine learning model training.</li>
                      <li>Optimized YOLO for Jetson Orin, achieving a 30% increase in processing speed for live-video analysis.</li>
                      <li>Developed voice models using RVC and created a voice cloning app with an integrated Text-to-Speech engine.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={`timeline-item ${visibleItems.includes(4) ? 'item-visible' : ''}`}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="time-badge">June 2023 - August 2023</div>
                  <div className="content-card">
                    <h4>Summer Research Intern</h4>
                    <p className="institution">BARC (Bhabha Atomic Research Centre), Mumbai, India</p>
                    <ul className="experience-points">
                      <li>Researched and implemented machine learning solutions that improved industrial efficiency by 30%.</li>
                      <li>Engineered a data simulator for Nuclear Power Plants (NPPS) to generate timestamped data.</li>
                      <li>Created a feedforward neural network to predict liquid levels for the next five timestamps.</li>
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

import React from 'react';
import { FiDownload } from 'react-icons/fi';
import './Resume.css';
import Reveal from './Reveal';

const Resume = () => {
  return (
    <section id="resume" className="resume-section">
      <div className="resume-container">
        <Reveal animation="up" className="resume-header">
          <div>
            <span className="section-eyebrow">Background</span>
            <h2 className="resume-title">
              My <span className="title-highlight">Resume</span>
            </h2>
          </div>
          <a
            href="/Tejas_Gaikwad_Resume.pdf"
            download="Tejas_Gaikwad_Resume.pdf"
            className="download-resume-btn"
          >
            <FiDownload className="download-icon" />
            <span>Download CV</span>
          </a>
        </Reveal>

        <div className="resume-content">
          {/* Education Column */}
          <div className="resume-column">
            <div className="column-header">
              <h3>Education</h3>
              <div className="header-line"></div>
            </div>

            <div className="timeline">
              <Reveal animation="left" delay={0} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="time-badge">Dec 2025</div>
                  <div className="content-card">
                    <h4>Master of Science in Computer Science &amp; Engineering</h4>
                    <p className="institution">State University of New York at Buffalo, USA</p>
                    <p className="duration">GPA: 3.6</p>
                  </div>
                </div>
              </Reveal>

              <Reveal animation="left" delay={110} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="time-badge">Aug 2024</div>
                  <div className="content-card">
                    <h4>Bachelor of Technology in Electronics &amp; Telecommunication</h4>
                    <p className="institution">Vishwakarma Institute of Technology, Pune, India</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Experience Column */}
          <div className="resume-column">
            <div className="column-header">
              <h3>Work Experience</h3>
              <div className="header-line"></div>
            </div>

            <div className="timeline">
              <Reveal animation="left" delay={0} className="timeline-item">
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
              </Reveal>

              <Reveal animation="left" delay={110} className="timeline-item">
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
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;

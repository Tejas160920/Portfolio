import React, { useState } from 'react';
import { FiExternalLink } from "react-icons/fi"; // Import the icon
import './Portfolio.css';

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('projects');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <section id="portfolio" className="portfolio-section">
      <div className="portfolio-container">
        <h2 className="portfolio-title">
          Featured <span>Portfolio</span>
        </h2>

        {/* Tabs */}
        <div className="portfolio-tabs">
          {['projects', 'certifications', 'hackathons', 'publications'].map((tab) => (
            <a
              key={tab}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleTabClick(tab);
              }}
              className={`tab-heading ${activeTab === tab ? 'active' : ''}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </a>
          ))}
        </div>

        {/* Content */}
        <div className="portfolio-content">
          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="tab-content active">
              {/* Project 1 */}
              <div className="portfolio-card">
                <div className="card-image">
                  <img src="/agribot1.jpeg" alt="Agribot" />
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <span className="year">2023</span>
                  </div>
                  <h3>AgriBot</h3>
                  <p>Developed a precision farming robot for weed detection, depth estimation, and autonomous navigation.</p>
                  <div className="tech-stack">
                    <span className="tech-tag">YOLOv7</span>
                    <span className="tech-tag">OpenCV</span>
                    <span className="tech-tag">Stereo Vision</span>
                  </div>
                  <div className="card-actions">
                    <button
                      className="card-btn"
                      onClick={() => window.location.href="https://github.com/Tejas160920/Agribot"}
                    >
                      View Project
                    </button>
                  </div>
                </div>
              </div>

              {/* Project 2 */}
              <div className="portfolio-card">
                <div className="card-image">
                  <img src="/p2.jpeg" alt="Community Tracker" />
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <span className="year">2023</span>
                  </div>
                  <h3>Google Extension</h3>
                  <p>Engineered an impactful IoT solution, streamlining community alerts and notifications.</p>
                  <div className="tech-stack">
                    <span className="tech-tag">IoT</span>
                    <span className="tech-tag">Python</span>
                    <span className="tech-tag">AWS</span>
                  </div>
                  <div className="card-actions">
                    <button className="card-btn" onClick={() => window.location.href='#'}>View Project</button>
                  </div>
                </div>
              </div>

              {/* Project 3 */}
              <div className="portfolio-card">
                <div className="card-image">
                  <img src="/soil_analysis.jpeg" alt="Soil Analysis Device" />
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <span className="year">2024</span>
                  </div>
                  <h3>Bird Floping</h3>
                  <p>Designed a device using Raspberry Pi and sensors to optimize irrigation, reducing costs by 25%.</p>
                  <div className="tech-stack">
                    <span className="tech-tag">Raspberry Pi</span>
                    <span className="tech-tag">Sensors</span>
                    <span className="tech-tag">Data Analysis</span>
                  </div>
                  <div className="card-actions">
                    <button className="card-btn" onClick={() => window.location.href='#'}>View Project</button>
                  </div>
                </div>
              </div>

              {/* Project 4 */}
              <div className="portfolio-card">
                <div className="card-image">
                  <img src="/brain.jpeg" alt="Drone AI" />
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <span className="year">2024</span>
                  </div>
                  <h3>Brain Tumor</h3>
                  <p>Developed a deep learning model for brain tumor classification, achieving 75% accuracy on test data using CNNs.</p>
                  <div className="tech-stack">
                    <span className="tech-tag">Deep Learning</span>
                    <span className="tech-tag">CNN</span>
                  </div>
                  <div className="card-actions">
                    <button className="card-btn" onClick={() => window.location.href='#'}>View Project</button>
                  </div>
                </div>
              </div>

              {/* Project 5 */}
              <div className="portfolio-card">
                <div className="card-image">
                  <img src="/smart_irrigation.jpeg" alt="Smart Irrigation System" />
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <span className="year">2024</span>
                  </div>
                  <h3>portfolio</h3>
                  <p>Built an IoT-enabled irrigation system to automate water delivery based on soil moisture levels.</p>
                  <div className="tech-stack">
                    <span className="tech-tag">IoT</span>
                    <span className="tech-tag">NodeMCU</span>
                    <span className="tech-tag">C++</span>
                  </div>
                  <div className="card-actions">
                    <button className="card-btn" onClick={() => window.location.href='#'}>View Project</button>
                  </div>
                </div>
              </div>

              {/* Project 6 */}
              <div className="portfolio-card">
              <div className="card-image">
  <img src="/demo.gif" alt="Energy Monitoring System" />
</div>
                <div className="card-content">
                  <div className="card-header">
                    <span className="year">2024</span>
                  </div>
                  <h3>HoverMorph</h3>
                  <p>A React library for animated, customizable cursors with responsive hover effects, enhancing UI interactions.</p>
                  <div className="tech-stack">
                    <span className="tech-tag">IoT</span>
                    <span className="tech-tag">Python</span>
                    <span className="tech-tag">Data Visualization</span>
                  </div>
                  <div className="card-actions">
                    <button className="card-btn" onClick={() => window.location.href='https://github.com/Tejas160920/HoverMorph'}>View Project</button>
                    <button className="card-btn" onClick={() => window.location.href='https://www.npmjs.com/package/circledot-cursor?activeTab=readme'}>Try   <FiExternalLink /></button>

                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Tabs Content Remains */}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;

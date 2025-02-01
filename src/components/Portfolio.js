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
  onClick={() => window.open("https://github.com/Tejas160920/Agribot", "_blank")}
>
  View Project
                    </button>
                  </div>
                </div>
              </div>

              {/* Project 2 */}
              <div className="portfolio-card">
                <div className="card-image">
                  <img src="/tryonn.jpg" alt="Community Tracker" />
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <span className="year">2024</span>
                  </div>
                  <h3>Virtual Try-On</h3>
                  <p>This Chrome extension lets you try on clothes virtually while shopping online, providing a fun and interactive way to see how outfits look on you.</p>
                  <div className="tech-stack">
                    <span className="tech-tag">Chrome extension</span>
                    
                  </div>
                  <div className="card-actions">
                  <button className="card-btn" onClick={() => window.open('https://github.com/Tejas160920/Virtual-Try-On', '_blank')}>View Project</button>
<button className="card-btn" onClick={() => window.open('https://chromewebstore.google.com/detail/Virtual%20Clothes%20Try-on/hpogkihhfoglihcgmhfhhngefkjgehjf', '_blank')}>
  Try <FiExternalLink />
</button>

                  </div>
                </div>
              </div>

              {/* Project 3 */}
              <div className="portfolio-card">
                <div className="card-image">
                  <img src="/bird.gif" alt="FlockFlow: Parallel Flocking Simulation" />
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <span className="year">2024</span>
                  </div>
                  <h3>FlockFlow: Parallel Flocking Simulation</h3>
                  <p>This project uses parallel processing to simulate flocking behavior, making the simulation run faster and smoother.</p>
                  <div className="tech-stack">
                    <span className="tech-tag">Apache Spark</span>
                    
                  </div>
                  <div className="card-actions">
                  <button className="card-btn" onClick={() => window.open('https://github.com/Tejas160920/FlockFlow-Parallel-Flocking-Simulation/tree/main', '_blank')}>View Project</button>

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
                    <span className="year">2023</span>
                  </div>
                  <h3>Brain Tumor</h3>
                  <p>Developed a deep learning model for brain tumor classification, achieving 75% accuracy on test data using CNNs.</p>
                  <div className="tech-stack">
                    <span className="tech-tag">Deep Learning</span>
                    <span className="tech-tag">CNN</span>
                  </div>
                  <div className="card-actions">
                  <button className="card-btn" onClick={() => window.open('https://github.com/Tejas160920/Brain-Tumor-Classification', '_blank')}>View Project</button>
                  </div>
                </div>
              </div>

              {/* Project 5 */}
              <div className="portfolio-card">
                <div className="card-image">
                  <img src="/portfolio.jpeg" alt="portfolio" />
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <span className="year">2024</span>
                  </div>
                  <h3>Personal Portfolio</h3>
                  <p>A personal portfolio site to showcase my projects, skills, and experience.</p>
                  <div className="tech-stack">
                    <span className="tech-tag">React</span>
                    <span className="tech-tag">Javascript</span>
                    
                  </div>
                  <div className="card-actions">
                  <button className="card-btn" onClick={() => window.location.href = '#'}>View Project</button>
                  <button className="card-btn" onClick={() => window.open('https://www.npmjs.com/package/circledot-cursor?activeTab=readme', '_blank')}>Visit <FiExternalLink /></button>

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
                  <button className="card-btn" onClick={() => window.open('https://github.com/Tejas160920/HoverMorph', '_blank')}>View Project</button>
<button className="card-btn" onClick={() => window.open('https://www.npmjs.com/package/circledot-cursor?activeTab=readme', '_blank')}>Try <FiExternalLink /></button>


                  </div>
                </div>
              </div>
            </div>
          )}
{/* Certifications Tab */}
{activeTab === 'certifications' && (
  <div className="tab-content active">
    <div className="portfolio-card">
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
    <div className="portfolio-card">
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
              <div className="portfolio-card">
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


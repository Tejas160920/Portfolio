import React from 'react';
import './Resume.css';

const Resume = () => {
  return (
    <section id="resume" className="resume-section">
      <div className="resume-container">
        <h2 className="resume-title">
          My <span>Resume</span>
        </h2>

        <div className="resume-content">
          {/* Education Column */}
          <div className="resume-column">
            <div className="column-header">
              <h3>Education</h3>
              <div className="header-line"></div>
            </div>

            <div className="timeline">
              {/* NCSU */}
              <div className="timeline-item">
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

              {/* VIT */}
              <div className="timeline-item">
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
          <div className="resume-column">
            <div className="column-header">
              <h3>Work Experience</h3>
              <div className="header-line"></div>
            </div>

            <div className="timeline">
              {/* FindMe Internship */}
              <div className="timeline-item">
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

              <div className="timeline-item">
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
              
              {/* Add more experience items here */}


              
  <div className="timeline-item">
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
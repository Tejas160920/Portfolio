// Domains.js
import React from 'react';
import { Code, Globe, Database, Cpu, Server, Lock } from 'lucide-react';
import './Domains.css';

const DomainsSection = () => {
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
    {
      icon: <Lock className="domain-icon" />,
      name: "Cybersecurity",
      description: "Network Security, Cryptography, Ethical Hacking",
      color: "#4CAF50"
    }
  ];

  return (
    <section section id="domain" className="domains-section">
      <div className="domains-container">
        <h2 className="domains-title">
          Domains I <span className="highlight">Work With</span>
        </h2>
        
        <div className="domains-grid">
          {domains.map((domain, index) => (
            <div
              key={domain.name}
              className="domain-card"
              style={{"--delay": `${index * 0.1}s`}}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DomainsSection;
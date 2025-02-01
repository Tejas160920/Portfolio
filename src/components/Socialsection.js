import React, { useState } from 'react';
import { Mail, Github, Linkedin, Check } from 'lucide-react';
import './Socialsection.css';

const SocialMediaSection = () => {
  const [copied, setCopied] = useState(false);

  const copyEmailToClipboard = () => {
    const email = 'tejasgaikwad16092002@gmail.com';
    navigator.clipboard.writeText(email)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy email: ', err);
      });
  };

  const socialLinks = [
    {
      name: 'Email',
      icon: copied ? <Check /> : <Mail />,
      action: copyEmailToClipboard,
      isButton: true
    },
    {
      name: 'GitHub',
      icon: <Github />,
      url: 'https://github.com/Tejas160920',
      isButton: false
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin />,
      url: 'https://www.linkedin.com/in/tejas-gaikwad-342199297/',
      isButton: false
    }
  ];

  return (
    <section className="social-media-section">
      <div className="social-container">
        <h2 className="social-title">
          Let's <span className="highlight">Connect</span>
        </h2>
        
        <div className="social-icons">
  {socialLinks.map((social) => (
    <div className="social-item-wrapper" key={social.name}>
      <button
        onClick={() => {
          if (social.isButton) {
            social.action();
          } else {
            window.open(social.url, "_blank", "noopener,noreferrer");
          }
        }}
        className="social-item"
        aria-label={social.name}
      >
        {social.icon}
        <span className="tooltip">
          {social.isButton ? (copied ? "Copied!" : "Copy Email") : social.name}
        </span>
      </button>
    </div>
  ))}
</div>


        <p className="social-text">
          Feel free to reach out for collaborations or just a friendly chat!
        </p>
      </div>
    </section>
  );
};

export default SocialMediaSection;
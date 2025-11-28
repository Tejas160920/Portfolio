import React, { useState, useEffect, useRef } from 'react';
import { Mail, Github, Linkedin, Check } from 'lucide-react';
import { FiSend, FiUser, FiMessageSquare, FiMail } from 'react-icons/fi';
import './Contact.css';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const sectionRef = useRef(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission - replace with actual endpoint
    try {
      // You can integrate with EmailJS, Formspree, or your own backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    }

    setIsSubmitting(false);
    setTimeout(() => setSubmitStatus(null), 3000);
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
    <section id="contact" className="contact-section" ref={sectionRef}>
      {/* Background elements */}
      <div className="contact-bg-elements">
        <div className="contact-orb contact-orb-1"></div>
        <div className="contact-orb contact-orb-2"></div>
        <div className="contact-grid-pattern"></div>
      </div>

      <div className="contact-container">
        <h2 className={`contact-title ${isVisible ? 'visible' : ''}`}>
          Let's get <span className="highlight">connected!</span>
        </h2>

        <div className={`contact-content ${isVisible ? 'visible' : ''}`}>
          {/* Left side - Contact Form */}
          <div className="contact-form-wrapper">
            <div className="form-header">
              <h3>Send me a Hi!</h3>
              <p>and I'll reach out to you</p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Enter your name</label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Enter your email</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Write a Message (Optional)</label>
                <div className="input-wrapper textarea-wrapper">
                  <FiMessageSquare className="input-icon" />
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading-spinner"></span>
                ) : (
                  <>
                    <FiSend className="btn-icon" />
                    Send Message
                  </>
                )}
              </button>

              {submitStatus === 'success' && (
                <div className="submit-message success">
                  Message sent successfully!
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="submit-message error">
                  Something went wrong. Please try again.
                </div>
              )}
            </form>
          </div>

          {/* Right side - Social Links & Avatar */}
          <div className="contact-right">
            <div className="social-section">
              <h3>Find me on my socials</h3>
              <p>and drop me a hey</p>

              <div className="social-links">
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
                      className="social-button social-item"
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
            </div>

            {/* Avatar Section */}
            <div className="contact-avatar-wrapper">
              <div className="avatar-glow-contact"></div>
              <img
                src="/contact-avatar.png"
                alt="Contact Avatar"
                className="contact-avatar-img"
              />
              {/* Signature style name tag */}
              <div className="signature-sticker">
                <span className="signature-name">Tejas</span>
                <span className="signature-subtitle">&lt;development&gt;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

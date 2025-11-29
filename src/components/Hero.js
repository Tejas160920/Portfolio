import React, { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import './Hero.css';
import {
  CodeBracket,
  CurlyBrace,
  CodeSlash,
  Semicolon,
  HashSymbol,
  ArrowFunction,
  CodeDot,
  GlowRing,
  FloatingGraphic
} from './CodeGraphics';

// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from "firebase/database";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_-GX9wXxmjmPecG7rOIrpQdQITRo-0Uo",
  authDomain: "portfolio-2998b.firebaseapp.com",
  databaseURL: "https://portfolio-2998b-default-rtdb.firebaseio.com/",
  projectId: "portfolio-2998b",
  storageBucket: "portfolio-2998b.appspot.com",
  messagingSenderId: "549229421327",
  appId: "1:549229421327:web:5e419b6b0d116a8683147a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Generate or retrieve unique user ID
const getUserId = () => {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = `user_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem("userId", userId);
  }
  return userId;
};

// Function to get total likes from Firebase
const getTotalLikes = async () => {
  try {
    const snapshot = await get(ref(db, "likes/count"));
    return snapshot.exists() ? snapshot.val() : 0;
  } catch (error) {
    console.error("Error fetching likes:", error);
    return 0;
  }
};

// Function to get the user's previous like count from Firebase
const getUserLikes = async () => {
  const userId = getUserId();
  try {
    const snapshot = await get(ref(db, `likes/users/${userId}`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Handle both old format (just number) and new format (object)
      return typeof data === 'object' ? data.likes : data;
    }
    return 0;
  } catch (error) {
    console.error("Error fetching user likes:", error);
    return 0;
  }
};

// Function to update likes in Firebase
const updateLikes = async (userLikes, totalLikes, name = null) => {
  const userId = getUserId();
  try {
    const userData = {
      likes: userLikes,
      lastLiked: new Date().toISOString()
    };
    if (name) {
      userData.name = name;
    }
    await set(ref(db, `likes/users/${userId}`), userData);
    await set(ref(db, "likes/count"), totalLikes);
  } catch (error) {
    console.error("Error updating likes:", error);
  }
};

// Function to save user name
const saveUserName = async (name) => {
  const userId = getUserId();
  try {
    const snapshot = await get(ref(db, `likes/users/${userId}`));
    const currentData = snapshot.exists() ? snapshot.val() : { likes: 0 };
    await set(ref(db, `likes/users/${userId}`), {
      ...currentData,
      name: name,
      lastLiked: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error saving name:", error);
  }
};

const Hero = () => {
  const [likes, setLikes] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [visitorInfo, setVisitorInfo] = useState({
    name: '',
    role: '',
    company: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const heroRef = useRef(null);
  const namePromptTimerRef = useRef(null);
  const emojis = ['😊', '😃', '😄', '😁', '🤩'];

  // Fetch total likes & user likes from Firebase on mount
  useEffect(() => {
    setIsVisible(true);
    const fetchData = async () => {
      const userLikes = await getUserLikes();
      const total = await getTotalLikes();
      setLikes(userLikes);
      setTotalLikes(total);
    };
    fetchData();
  }, []);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        setParallaxOffset(rate);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Like Click
  const handleLike = async () => {
    let newLikes, newTotalLikes;

    if (likes < 5) {
      newLikes = likes + 1;
      newTotalLikes = totalLikes + 1;
    } else {
      newLikes = 0;
      newTotalLikes = totalLikes - 5;
    }

    setLikes(newLikes);
    setTotalLikes(newTotalLikes);
    setShowEmoji(true);
    setTimeout(() => setShowEmoji(false), 2000);

    await updateLikes(newLikes, newTotalLikes);

    // Show name prompt 4 seconds after user stops liking (only once per session)
    const hasAskedName = sessionStorage.getItem('askedForName');
    if (newLikes > 0 && !hasAskedName) {
      // Clear any existing timer
      if (namePromptTimerRef.current) {
        clearTimeout(namePromptTimerRef.current);
      }
      // Set new timer - will trigger 4 seconds after last like
      namePromptTimerRef.current = setTimeout(() => {
        setShowNamePrompt(true);
        sessionStorage.setItem('askedForName', 'true');
      }, 4000);
    }
  };

  // Handle visitor info submission
  const handleNameSubmit = async () => {
    const hasAnyInfo = visitorInfo.name.trim() || visitorInfo.role.trim() || visitorInfo.company.trim();

    if (hasAnyInfo) {
      setIsSubmitting(true);

      // Save to Firebase
      await saveUserName(visitorInfo.name.trim() || 'Anonymous');

      // Send email notification
      try {
        await fetch('/api/visitor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: visitorInfo.name.trim() || 'Anonymous',
            role: visitorInfo.role.trim() || 'Not specified',
            company: visitorInfo.company.trim() || 'Not specified',
            likes: likes
          })
        });
      } catch (error) {
        console.error('Failed to send visitor info:', error);
      }

      setIsSubmitting(false);
    }

    setShowNamePrompt(false);
    setVisitorInfo({ name: '', role: '', company: '' });

    // Reset cursor visibility after modal closes
    setTimeout(() => {
      const cursorDot = document.querySelector('.cursor-dot');
      const cursorCircle = document.querySelector('.cursor-circle');
      if (cursorDot) cursorDot.classList.remove('cursor-dot-hidden');
      if (cursorCircle) {
        cursorCircle.classList.remove('hovered');
        cursorCircle.style = '';
      }
    }, 100);
  };

  // Handle skip
  const handleSkipName = () => {
    setShowNamePrompt(false);

    // Reset cursor visibility after modal closes
    setTimeout(() => {
      const cursorDot = document.querySelector('.cursor-dot');
      const cursorCircle = document.querySelector('.cursor-circle');
      if (cursorDot) cursorDot.classList.remove('cursor-dot-hidden');
      if (cursorCircle) {
        cursorCircle.classList.remove('hovered');
        cursorCircle.style = '';
      }
    }, 100);
    setVisitorInfo({ name: '', role: '', company: '' });
  };

  return (
    <div id="home" className="hero" ref={heroRef}>
      {/* Animated Code Decorations */}
      <div className="code-decorations">
        {/* Top left - Large bracket with floating */}
        <FloatingGraphic amplitude={15} duration={5} style={{ top: '10%', left: '5%' }}>
          <CodeBracket direction="left" size={140} delay={0.2} />
        </FloatingGraphic>

        {/* Top right - Curly brace */}
        <FloatingGraphic amplitude={20} duration={6} delay={1} style={{ top: '8%', right: '8%' }}>
          <CurlyBrace direction="right" size={120} delay={0.4} />
        </FloatingGraphic>

        {/* Mid left - Arrow function */}
        <FloatingGraphic amplitude={12} duration={4.5} delay={0.5} style={{ top: '45%', left: '3%' }} className="hide-mobile">
          <ArrowFunction size={90} delay={0.8} />
        </FloatingGraphic>

        {/* Mid right - Hash symbol */}
        <FloatingGraphic amplitude={18} duration={5.5} delay={2} style={{ top: '50%', right: '5%' }} className="hide-mobile">
          <HashSymbol size={70} delay={1} />
        </FloatingGraphic>

        {/* Bottom left - Slash and bracket combo */}
        <FloatingGraphic amplitude={15} duration={5} delay={1.5} style={{ bottom: '20%', left: '8%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <CodeSlash size={80} delay={0.6} />
            <CodeBracket direction="right" size={100} delay={0.7} />
          </div>
        </FloatingGraphic>

        {/* Bottom right - Semicolon */}
        <FloatingGraphic amplitude={10} duration={4} delay={0.8} style={{ bottom: '25%', right: '10%' }} className="hide-tablet">
          <Semicolon size={70} delay={1.2} />
        </FloatingGraphic>

        {/* Decorative dots */}
        <FloatingGraphic amplitude={8} duration={3} style={{ top: '30%', left: '15%' }} className="hide-mobile">
          <CodeDot size={15} delay={1.5} color="#4CAF50" />
        </FloatingGraphic>
        <FloatingGraphic amplitude={10} duration={3.5} delay={0.5} style={{ top: '65%', right: '15%' }} className="hide-mobile">
          <CodeDot size={12} delay={1.8} color="#FFEA00" />
        </FloatingGraphic>
        <FloatingGraphic amplitude={6} duration={2.5} delay={1} style={{ bottom: '40%', left: '20%' }} className="hide-tablet">
          <CodeDot size={10} delay={2} color="#FF4081" />
        </FloatingGraphic>

        {/* Glow rings */}
        <GlowRing size={80} delay={0.5} style={{ top: '20%', right: '20%' }} className="hide-tablet" />
        <GlowRing size={60} delay={1} style={{ bottom: '35%', left: '25%' }} className="hide-mobile" />
      </div>

      <div className="stats-bar">
        {/* Optional Stats */}
      </div>

      <div className="like-container">
        <div className="like-content">
          <button
            onClick={handleLike}
            className="like-button border-2 border-gray-700 rounded-full ripple-container"
          >
            <Heart
              size={32}
              className={`heart-icon ${likes > 0 ? 'active' : ''}`}
              style={{ fillOpacity: likes / 5 }}
            />
          </button>
          {showEmoji && <span className="emoji">{emojis[likes - 1] || '😆'}</span>}
        </div>
        <span className="like-count mt-2">{totalLikes}</span>
      </div>

      {/* Visitor Info Modal */}
      {showNamePrompt && (
        <div className="name-prompt-overlay">
          <div className="name-prompt-modal">
            <h3>Thanks for the love! 💚</h3>
            <p>I'd love to know who's visiting!</p>
            <div className="visitor-form">
              <input
                type="text"
                value={visitorInfo.name}
                onChange={(e) => setVisitorInfo({...visitorInfo, name: e.target.value})}
                placeholder="Your name"
                maxLength={50}
                autoFocus
              />
              <input
                type="text"
                value={visitorInfo.role}
                onChange={(e) => setVisitorInfo({...visitorInfo, role: e.target.value})}
                placeholder="Your role (e.g. Recruiter, Developer, Student)"
                maxLength={50}
              />
              <input
                type="text"
                value={visitorInfo.company}
                onChange={(e) => setVisitorInfo({...visitorInfo, company: e.target.value})}
                placeholder="Company / Organization"
                maxLength={100}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
              />
            </div>
            <p className="optional-note">All fields are optional</p>
            <div className="name-prompt-buttons">
              <button onClick={handleSkipName} className="skip-btn">Skip</button>
              <button onClick={handleNameSubmit} className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="hero-background" style={{ transform: `translateY(${parallaxOffset}px)` }}>
        <div className="gradient-overlay"></div>
        <div className="particles">
          {[...Array(window.innerWidth <= 768 ? 15 : 50)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="content-container hero-split">
        <div className={`main-content ${isVisible ? 'visible' : ''}`}>
          <h1 className="title">
            Hey, I'm <span className="highlight name-highlight">Tejas Gaikwad</span>
          </h1>
          <h2 className="subtitle">
            A <span className="highlight">Software Developer & CS Graduate Student</span>
          </h2>
          <p className="description">
            I'm a graduate student at SUNY Buffalo currently working as a Software Developer Intern at FindMe.
            I specialize in building scalable applications, exploring AI/ML solutions, and solving diverse challenges in technology.
          </p>
        </div>

        {/* 3D Avatar Section */}
        <div className={`avatar-container ${isVisible ? 'visible' : ''}`}>
          <div className="avatar-glow"></div>
          <img
            src="/avatar.png"
            alt="3D Developer Avatar"
            className="avatar-image"
          />
          {/* Floating elements around avatar */}
          <div className="avatar-orbit">
            <div className="orbit-dot orbit-dot-1"></div>
            <div className="orbit-dot orbit-dot-2"></div>
            <div className="orbit-dot orbit-dot-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

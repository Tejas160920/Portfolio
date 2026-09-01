import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, ArrowDown, ArrowUpRight, Download } from 'lucide-react';
import './Hero.css';
import Reveal from './Reveal';
import { useMagnetic } from '../hooks/useMagnetic';

// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, runTransaction } from "firebase/database";

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

// Atomically apply a delta to the global like counter on the server.
// Why: previous code did `set(count, localState + delta)`, which wiped
// the real count whenever a user clicked before the initial fetch resolved.
const applyGlobalLikeDelta = async (delta) => {
  const result = await runTransaction(ref(db, "likes/count"), (current) => {
    const next = (current || 0) + delta;
    return next < 0 ? 0 : next;
  });
  return result.snapshot.exists() ? result.snapshot.val() : 0;
};

// Persist this user's personal like count (does not touch the global counter).
const saveUserLikes = async (userLikes) => {
  const userId = getUserId();
  try {
    const snapshot = await get(ref(db, `likes/users/${userId}`));
    const existing = snapshot.exists() ? snapshot.val() : {};
    const userData = typeof existing === 'object' ? existing : {};
    await set(ref(db, `likes/users/${userId}`), {
      ...userData,
      likes: userLikes,
      lastLiked: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error saving user likes:", error);
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

// Roles cycled through under the name
const ROLES = [
  'Software Engineer',
  'Backend Developer',
  'AI Systems Engineer',
  'Cloud Engineer'
];

/* Two taps, no typing. Free-text fields are why nobody answers this. */
const VISITOR_ROLES = [
  'Recruiter',
  'Engineer',
  'Hiring manager',
  'Founder',
  'Student',
  'Just curious'
];

const VISITOR_REASONS = [
  'A role for you',
  'Your projects',
  'The AI assistant',
  'We have met',
  'Just browsing'
];

/* Reflected back after a tap, so answering feels acknowledged rather than
   like the form just grew. */
const REACTIONS = {
  'Recruiter': "A recruiter! Now you have my attention 👀",
  'Engineer': "An engineer, we'll get along 🤝",
  'Hiring manager': "A hiring manager! Hello 👋",
  'Founder': "A founder, building something good? 🚀",
  'Student': "A student! Ask me anything 🎓",
  'Just curious': "Curiosity is underrated 🔍"
};

const STATS = [
  { value: '3+', label: 'Years building' },
  { value: '10+', label: 'Projects shipped' },
  { value: 'MS', label: 'CS, SUNY Buffalo' }
];

const Hero = () => {
  const [likes, setLikes] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [showEmoji, setShowEmoji] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [visitorRole, setVisitorRole] = useState('');
  const [visitorReason, setVisitorReason] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorContact, setVisitorContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const namePromptTimerRef = useRef(null);
  const emojiTimerRef = useRef(null);
  const emojis = ['😊', '😃', '😄', '😁', '🤩'];

  const primaryCtaRef = useMagnetic({ strength: 0.28 });
  const secondaryCtaRef = useMagnetic({ strength: 0.28 });

  // Fetch total likes & user likes from Firebase on mount
  useEffect(() => {
    const fetchData = async () => {
      const userLikes = await getUserLikes();
      const total = await getTotalLikes();
      setLikes(userLikes);
      setTotalLikes(total);
    };
    fetchData();
  }, []);

  // Cycle the role line
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduceMotion) return;

    const id = setInterval(() => {
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  // Clean up pending timers on unmount
  useEffect(() => () => {
    if (namePromptTimerRef.current) clearTimeout(namePromptTimerRef.current);
    if (emojiTimerRef.current) clearTimeout(emojiTimerRef.current);
  }, []);

  // Handle Like Click
  const handleLike = async () => {
    let newLikes, delta;

    if (likes < 5) {
      newLikes = likes + 1;
      delta = 1;
    } else {
      newLikes = 0;
      delta = -5;
    }

    setLikes(newLikes);
    setShowEmoji(true);
    if (emojiTimerRef.current) clearTimeout(emojiTimerRef.current);
    emojiTimerRef.current = setTimeout(() => setShowEmoji(false), 2000);

    const serverTotal = await applyGlobalLikeDelta(delta);
    setTotalLikes(serverTotal);
    await saveUserLikes(newLikes);

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
    // Either answer on its own is worth sending; requiring both would just
    // reintroduce the friction the chips are meant to remove.
    if (!visitorRole && !visitorReason) {
      setShowNamePrompt(false);
      return;
    }

    setIsSubmitting(true);

    await saveUserName(visitorName.trim() || visitorRole || 'Visitor');

    try {
      await fetch('/api/visitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: visitorRole || 'Not specified',
          reason: visitorReason || 'Not specified',
          name: visitorName.trim(),
          contact: visitorContact.trim(),
          likes: likes
        })
      });
    } catch (error) {
      console.error('Failed to send visitor info:', error);
    }

    setIsSubmitting(false);
    setShowNamePrompt(false);
    setVisitorRole('');
    setVisitorReason('');
    setVisitorName('');
    setVisitorContact('');
  };

  const handleSkipName = () => {
    setShowNamePrompt(false);
    setVisitorRole('');
    setVisitorReason('');
    setVisitorName('');
    setVisitorContact('');
  };

  const picked = Boolean(visitorRole || visitorReason);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section id="home" className="hero">
      <div className="hero-inner">
        {/* ---------------------------------------------------------------- */}
        <div className="hero-copy">
          <Reveal animation="up" delay={100}>
            <span className="hero-badge">
              <span className="hero-badge-dot" />
              Open to Software Engineering roles
            </span>
          </Reveal>

          <Reveal animation="up" delay={180}>
            <h1 className="hero-title">
              <span className="hero-title-line">Tejas</span>
              <span className="hero-title-line hero-title-accent">Gaikwad</span>
            </h1>
          </Reveal>

          {/* Role rotator: fixed height so nothing below it shifts */}
          <Reveal animation="up" delay={260}>
            <div className="hero-roles" aria-live="polite">
              <span className="hero-roles-prefix">I build as a</span>
              <span className="hero-roles-viewport">
                {ROLES.map((role, i) => (
                  <span
                    key={role}
                    className={`hero-role ${i === roleIndex ? 'active' : ''}`}
                    aria-hidden={i !== roleIndex}
                  >
                    {role}
                  </span>
                ))}
              </span>
            </div>
          </Reveal>

          <Reveal animation="up" delay={340}>
            <p className="hero-description">
              Software Engineer at <strong>DoorDash</strong>, building scalable
              backend systems and the cloud infrastructure behind production AI
              workloads. MS in Computer Science from SUNY Buffalo.
            </p>
          </Reveal>

          <Reveal animation="up" delay={420}>
            <div className="hero-actions">
              <button
                ref={primaryCtaRef}
                className="hero-cta hero-cta-primary"
                onClick={() => scrollTo('portfolio')}
              >
                <span>View my work</span>
                <ArrowUpRight size={18} strokeWidth={2.2} />
              </button>

              <a
                ref={secondaryCtaRef}
                className="hero-cta hero-cta-ghost"
                href="/Tejas_Gaikwad_Resume.pdf"
                download="Tejas_Gaikwad_Resume.pdf"
              >
                <Download size={17} strokeWidth={2.2} />
                <span>Resume</span>
              </a>
            </div>
          </Reveal>

          <Reveal animation="up" delay={500}>
            <dl className="hero-stats">
              {STATS.map((stat) => (
                <div className="hero-stat" key={stat.label}>
                  <dt className="hero-stat-value">{stat.value}</dt>
                  <dd className="hero-stat-label">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* ---------------------------------------------------------------- */}
        <Reveal animation="scale" delay={300} className="hero-visual">
          <div className="avatar-stage">
            <div className="avatar-ring avatar-ring-1" />
            <div className="avatar-ring avatar-ring-2" />
            <div className="avatar-glow" />
            <img
              src="/avatar.png"
              alt="Illustrated portrait of Tejas Gaikwad"
              className="avatar-image"
            />
          </div>

          {/* Like button lives with the avatar so it reads as a reaction */}
          <div className="like-container">
            <button
              onClick={handleLike}
              className="like-button"
              aria-label={`Like this portfolio. ${totalLikes} likes so far.`}
            >
              <Heart
                size={20}
                className={`heart-icon ${likes > 0 ? 'active' : ''}`}
                style={{ fillOpacity: likes / 5 }}
              />
              <span className="like-count">{totalLikes}</span>
            </button>
            {showEmoji && (
              <span className="emoji">{emojis[likes - 1] || '😆'}</span>
            )}
          </div>
        </Reveal>
      </div>

      {/* Scroll cue ------------------------------------------------------- */}
      <button
        className="scroll-cue"
        onClick={() => scrollTo('skills')}
        aria-label="Scroll to skills"
      >
        <span className="scroll-cue-text">Scroll</span>
        <span className="scroll-cue-line">
          <ArrowDown size={13} strokeWidth={2.4} />
        </span>
      </button>

      {/* Visitor Info Modal ----------------------------------------------- */}
      {showNamePrompt && (
        <div className="name-prompt-overlay" role="dialog" aria-modal="true">
          <div className="name-prompt-modal">
            <h3>Thanks for the love! 💚</h3>
            <p>Two taps and I'll know who stopped by.</p>

            <div className="visitor-form">
              <fieldset className="visitor-group">
                <legend className="visitor-legend">You are a…</legend>
                <div className="visitor-chips">
                  {VISITOR_ROLES.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`visitor-chip ${visitorRole === option ? 'selected' : ''}`}
                      aria-pressed={visitorRole === option}
                      /* Tapping the current choice clears it, so a mis-tap
                         is one tap to undo rather than a locked-in answer */
                      onClick={() =>
                        setVisitorRole((prev) => (prev === option ? '' : option))
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="visitor-group">
                <legend className="visitor-legend">Here for…</legend>
                <div className="visitor-chips">
                  {VISITOR_REASONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`visitor-chip ${visitorReason === option ? 'selected' : ''}`}
                      aria-pressed={visitorReason === option}
                      onClick={() =>
                        setVisitorReason((prev) => (prev === option ? '' : option))
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>

              {picked && (
                <div className="visitor-reveal">
                  <p className="visitor-reaction">
                    {REACTIONS[visitorRole] || "Good to have you here 👋"}
                  </p>

                  <label className="visitor-field">
                    <span className="visitor-legend">Who do I thank?</span>
                    <input
                      type="text"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="First name is plenty"
                      maxLength={50}
                      autoComplete="given-name"
                    />
                  </label>

                  <label className="visitor-field">
                    <span className="visitor-legend">Where do I find you?</span>
                    <input
                      type="text"
                      value={visitorContact}
                      onChange={(e) => setVisitorContact(e.target.value)}
                      placeholder="Email or LinkedIn"
                      maxLength={120}
                      autoComplete="email"
                      onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                    />
                  </label>

                  <p className="visitor-note">
                    Both optional. I just like knowing who dropped by.
                  </p>
                </div>
              )}
            </div>

            <div className="name-prompt-buttons">
              <button onClick={handleSkipName} className="skip-btn">
                Maybe later
              </button>
              <button
                onClick={handleNameSubmit}
                className="submit-btn"
                disabled={isSubmitting || (!visitorRole && !visitorReason)}
              >
                {isSubmitting ? 'Sending…' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;

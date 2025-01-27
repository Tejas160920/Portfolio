import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import './Hero.css';

const Hero = () => {

  const [likes, setLikes] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const emojis = ['😊', '😃', '😄', '😁', '🤩'];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLike = () => {
    if (likes < 5) {
      setLikes((prev) => prev + 1);
      setShowEmoji(true);
      setTimeout(() => {
        setShowEmoji(false);
      }, 2000);
    } else {
      setLikes(0); // Reset likes to 0 when it reaches 5
    }
  };
  

  return (
    
    <div section id="home" className="hero">
              <div className="stats-bar">
          <button className="stat-item border-2 border-gray-700">Followers 1.5k</button>
          <button className="stat-item border-2 border-gray-700">Stars 4.3k</button>
        </div>
              <div className="like-container">
          <div className="like-content">
            <button
              onClick={handleLike}
              className="like-button border-2 border-gray-700 rounded-full"
              // disabled={likes >= 5}
            >
              <Heart
                size={32}
                className={`heart-icon ${likes > 0 ? 'active' : ''}`}
                style={{ fillOpacity: likes / 5 }}
              />
            </button>
            {showEmoji && (
              <span className="emoji">{emojis[likes - 1]}</span>
            )}
          </div>
          <span className="like-count mt-2">{likes}</span>
        </div>
      <div className="hero-background">
        <div className="gradient-overlay"></div>
        <div className="particles">
          {[...Array(50)].map((_, i) => (
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

      <div className="content-container">


        <div className={`main-content ${isVisible ? 'visible' : ''}`}>
        <h1 className="title">
  Hey, I'm <span className="highlight">Tejas Gaikwad</span>
</h1>
<h2 className="subtitle">
  A <span className="highlight">Computer Science Student</span>
</h2>
<p className="description">
  I'm a graduate student at SUNY Buffalo with experience working on real-world projects at BARC and SmartLeaven.  
  I specialize in developing efficient systems, exploring AI applications, and solving diverse challenges in technology.  
</p>

        </div>
      </div>
    </div>
  );
};

export default Hero;
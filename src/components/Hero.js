import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import './Hero.css';

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

// 🔹 Generate or retrieve unique user ID
const getUserId = () => {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = `user_${Math.random().toString(36).substr(2, 9)}`; // Unique ID
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
    return snapshot.exists() ? snapshot.val() : 0;
  } catch (error) {
    console.error("Error fetching user likes:", error);
    return 0;
  }
};

// Function to update likes in Firebase
const updateLikes = async (userLikes, totalLikes) => {
  const userId = getUserId();
  try {
    await set(ref(db, `likes/users/${userId}`), userLikes);
    await set(ref(db, "likes/count"), totalLikes);
  } catch (error) {
    console.error("Error updating likes:", error);
  }
};

const Hero = () => {
  const [likes, setLikes] = useState(0); // User's personal likes
  const [totalLikes, setTotalLikes] = useState(0); // Total global likes in Firebase
  const [isVisible, setIsVisible] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
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

  // Handle Like Click (with reset at 6th click)
  const handleLike = async () => {
    let newLikes, newTotalLikes;

    if (likes < 5) {
      // Increment likes normally
      newLikes = likes + 1;
      newTotalLikes = totalLikes + 1;
    } else {
      // If user reaches 5, reset back to 0 and remove 5 from total count
      newLikes = 0;
      newTotalLikes = totalLikes - 5;
    }

    setLikes(newLikes);
    setTotalLikes(newTotalLikes);
    setShowEmoji(true);
    setTimeout(() => setShowEmoji(false), 2000);

    // Update user-specific & total likes in Firebase
    await updateLikes(newLikes, newTotalLikes);
  };

  return (
    <div id="home" className="hero">
      <div className="stats-bar">
        {/* Optional Stats */}
      </div>
      <div className="like-container">
        <div className="like-content">
          <button
            onClick={handleLike}
            className="like-button border-2 border-gray-700 rounded-full"
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

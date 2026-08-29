import React, { useState, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Atmosphere from './components/Atmosphere';
import Preloader from './components/Preloader';
import ScrollProgress from './components/ScrollProgress';
import AnimationGovernor from './components/AnimationGovernor';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import MobileTopBar from './components/MobileTopBar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Portfolio from './components/Portfolio';
import Resume from './components/Resume';
import DomainsSection from './components/Domains';
import Currently from './components/Currently';
import CustomCursor from './components/CustomCursor';
import SkillWheel from './components/Skillwheel';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';
import Chatbot from './components/Chatbot';
import './App.css';
import './styles/mobile.css';

function App() {
  const [introDone, setIntroDone] = useState(false);
  const handleIntroDone = useCallback(() => setIntroDone(true), []);

  return (
    <ThemeProvider>
      {/* The one background for the whole page — sections are transparent
          frames laid over it, which is what removes the seams between them. */}
      <Atmosphere />

      <Preloader onDone={handleIntroDone} />
      <ScrollProgress />
      <AnimationGovernor />
      <CustomCursor />
      <ThemeToggle />
      <Navbar />
      <MobileTopBar />
      <MobileNav />

      <main className={`page ${introDone ? 'intro-done' : ''}`}>
        <Hero />
        <Marquee />
        <SkillWheel />
        <Portfolio />
        <Resume />
        <DomainsSection />
        <Currently />
        <Contact />
        <Footer />
      </main>

      <Chatbot />
    </ThemeProvider>
  );
}

export default App;

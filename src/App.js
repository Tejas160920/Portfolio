import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Resume from './components/Resume';
import DomainsSection from './components/Domains';
import CustomCursor from './components/CustomCursor';
import SkillWheel from './components/Skillwheel';
import Contact from './components/Contact';
import ThemeToggle from './components/ThemeToggle';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <ThemeProvider>
      <div>
        <CustomCursor/>
        <ThemeToggle />
        <Navbar />
        <Hero />
        <SkillWheel/>
        <Portfolio/>
        <Resume />
        <DomainsSection/>
        <Contact />
        <Chatbot />
      </div>
    </ThemeProvider>
  );
}

export default App;

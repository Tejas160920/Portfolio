import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Resume from './components/Resume';
import DomainsSection from './components/Domains';
import CustomCursor from './components/CustomCursor';
import SkillWheel from './components/Skillwheel';
import Contact from './components/Contact';

function App() {
  return (
    <div>
      <CustomCursor/>
      <Navbar />
      <Hero />
      <SkillWheel/>
      <Portfolio/>
      <Resume />
      <DomainsSection/>
      <Contact />
    </div>
  );
}

export default App;

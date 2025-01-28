import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Resume from './components/Resume';
import DomainsSection from './components/Domains';
import SocialMediaSection from './components/Socialsection';
import CustomCursor from './components/CustomCursor';
import SkillWheel from './components/Skillwheel';

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
      <SocialMediaSection />
    </div>
  );
}

export default App;

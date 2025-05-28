import React, { useEffect, useState } from 'react';
import './App.css';
import Background from './components/Background';
import Header from './components/Header/Header';
import About from './components/About/About';
import Projects from './components/projects/Projects';
import Experience from './components/experience/Experience';
import Skills from './components/skills/Skills';
import Navigation from './components/navigation/Navigation';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [activeSection, setActiveSection] = useState(null);

  // Log active section changes
  useEffect(() => {
    console.log('Active Section:', activeSection);
    console.log('Navigation State:', activeSection ? 'Active' : 'Inactive');
  }, [activeSection]);

  useEffect(() => {
    // Initialize background animation
    const bg = new Background();
    bg.init();

    return () => {
      bg.dispose();
    };
  }, []);

  const handleNavClick = (section) => {
    console.log('Navigation clicked - Changing to section:', section);
    // If clicking the same section that's active, deactivate it
    if (section === activeSection) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  return (
    <ThemeProvider>
      {/* Background div for Three.js animation */}
      <div id="bg"></div>
      
      {/* Main wrapper */}
      <div id="wrap" className={activeSection ? 'content-active' : ''}>
        <div id="inner">
          {/* Header component */}
          <Header activeSection={activeSection} />

          {/* Navigation - Moved before main content */}
          <Navigation onNavClick={handleNavClick} activeSection={activeSection} />
        </div>
        {/* Content Container */}
        {activeSection && (
          <div className="content-container">
            {activeSection === 'work' && (
              <div className="section-content">
                <Experience />
                <Skills />
              </div>
            )}
            
            {activeSection === 'project' && (
              <div className="section-content">
                <Projects />
              </div>
            )}
            
            {activeSection === 'about' && (
              <div className="section-content">
                <About />
              </div>
            )}
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;

import React, { useEffect } from 'react';
import './App.css';
import Background from './components/Background';
import Header from './components/Header/Header';
import About from './components/About/About';
import Projects from './components/projects/Projects';
import Experience from './components/experience/Experience';
import Skills from './components/skills/Skills';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  useEffect(() => {
    // Initialize background animation
    const bg = new Background();
    bg.init();

    return () => {
      bg.dispose();
    };
  }, []);

  return (
    <ThemeProvider>
      {/* Background div for Three.js animation */}
      <div id="bg"></div>
      
      {/* Main wrapper */}
      <div id="wrap">
        {/* Header component */}
        <Header />

        {/* Main Content */}
        <main className="main-content">
          <About />
          <Experience />
          <Skills />
          <Projects />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;

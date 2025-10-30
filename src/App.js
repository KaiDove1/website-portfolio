import React from 'react';
import "./App.css";
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/header/Header';
import Home from './components/home/Home';
import About from './components/about/About';
import Skills from './components/skills/Skills';
import GitHubStats from './components/github/GitHubStats';
import Projects from './components/projects/Projects';
import Qualification from './components/qualification/Qualification';
import Certifications from './components/certifications/Certifications';
import Contact from './components/contact/Contact';
import Footer from './components/footer/Footer';
import ScrollUp from './components/scrollup/ScrollUp';
import ThemeToggle from './components/theme/ThemeToggle';

const App = () => {
  return (
    <ThemeProvider>
      <Header />

      <main className='main'>
        <Home />
        <About />
        <Skills />
        <GitHubStats />
        <Projects />
        <Qualification />
        <Certifications />
        <Contact />
      </main>

      <Footer />
      <ScrollUp/>
      <ThemeToggle />
    </ThemeProvider>
  )
}

export default App;

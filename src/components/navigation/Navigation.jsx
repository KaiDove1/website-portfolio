import React from 'react';
import './Navigation.css';

const Navigation = ({ onNavClick, activeSection }) => {
  const handleClick = (section) => {
    console.log('Navigation clicked:', section);
    onNavClick(section);
  };

  // Add section-active class when any section is active
  const navClassName = `gnav ${activeSection ? 'section-active' : ''}`;

  return (
    <nav className={navClassName}>
      <ul>
        <li>
          <a 
            href="#work" 
            onClick={(e) => {
              e.preventDefault();
              handleClick('work');
            }}
            className={activeSection === 'work' ? 'active' : ''}
          >
            EXPERIENCE
          </a>
        </li>
        <li>
          <a 
            href="#project"
            onClick={(e) => {
              e.preventDefault();
              handleClick('project');
            }}
            className={activeSection === 'project' ? 'active' : ''}
          >
            PROJECT
          </a>
        </li>
        <li>
          <a 
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              handleClick('about');
            }}
            className={activeSection === 'about' ? 'active' : ''}
          >
            ABOUT ME 
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation; 
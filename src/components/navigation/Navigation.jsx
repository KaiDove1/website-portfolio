import React from 'react';
import './Navigation.css';

const Navigation = ({ onNavClick, activeSection }) => {
  const handleClick = (section) => {
    console.log('Navigation clicked:', section);
    onNavClick(section);
  };

  return (
    <nav className="main-nav">
      <ul>
        <li className="nav-item">
          <button 
            className={`nav-button ${activeSection === 'work' ? 'active' : ''}`}
            onClick={() => handleClick('work')}
          >
            WORK
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-button ${activeSection === 'about' ? 'active' : ''}`}
            onClick={() => handleClick('about')}
          >
            ABOUT
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-button ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={() => handleClick('contact')}
          >
            CONTACT
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation; 
import React from 'react';
import './Header.css';
import ThemeToggle from '../theme/ThemeToggle';
import { FaGithub, FaLinkedinIn, FaEnvelope, FaFileAlt } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';

const Header = ({ activeSection }) => {
  return (
    <header id="head">
      <div className="inner">
        {/* Left section - Website info */}
        <div className="leftHead">
          <p className="readA">KAIDOVE.GITHUB.IO<br />©KAI DOVE</p>
          <p className="readB">SOFTWARE ENGINEER / FULL STACK DEVELOPER</p>
        </div>

        {/* Right section - Theme toggle and Social links */}
        <div className="rightHead">
          <ThemeToggle />
          <ul className="sns">
            <li>
              <a 
                href="https://github.com/KaiDove1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="github"
                title="GitHub"
              >
                <FaGithub />
              </a>
            </li>
            <li>
              <a 
                href="https://linkedin.com/in/kaidove" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="linkedin"
                title="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </li>
            <li>
              <a 
                href="mailto:kaidove.tech@gmail.com" 
                className="email"
                title="Email"
              >
                <FaEnvelope />
              </a>
            </li>
            <li>
              <a 
                href="/path-to-your-resume.pdf" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="resume"
                title="Resume/CV"
              >
                <FaFileAlt />
              </a>
            </li>
            <li>
              <a 
                href="https://leetcode.com/KaiDove" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="leetcode"
                title="LeetCode"
              >
                <SiLeetcode />
              </a>
            </li>
          </ul>
        </div>

        {/* Center section - Logo and tagline */}
        <div className={`centerArea ${activeSection ? 'section-active' : ''}`}>
          <h1 className="logo"><a href="/">KAI DOVE</a></h1>
          <p className="state">SEARCH FOR INNOVATIVE SOLUTIONS</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
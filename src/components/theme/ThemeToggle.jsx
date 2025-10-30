import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './themeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
    >
      {theme === 'light' ? (
        <i className="uil uil-moon"></i>
      ) : (
        <i className="uil uil-sun"></i>
      )}
    </button>
  );
};

export default ThemeToggle;

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A modern, responsive personal portfolio website built with React.js showcasing projects, skills, and experience. The site features a unique navigation system that reveals content sections on-demand, with an animated Three.js background and theme switching capabilities.

Deployed on GitHub Pages at: https://kaidove.github.io/website-portfolio

## Development Commands

### Local Development
```bash
npm install          # Install dependencies
npm start            # Start development server at localhost:3000
npm run build        # Production build to /build directory
npm test             # Run tests with React Testing Library
```

### Deployment
```bash
npm run deploy       # Build and deploy to GitHub Pages (gh-pages branch)
```

Note: The `deploy` command runs `predeploy` (build) automatically before deploying.

## Architecture

### State Management & Navigation
- **ThemeContext** (`src/context/ThemeContext.jsx`): Global theme state (light/dark mode)
- **App-level state**: Navigation is managed through `activeSection` state in `App.js`
  - Clicking a nav item shows that section's content
  - Clicking the same nav item again hides the content
  - Only one section can be active at a time
  - Three main sections: 'work', 'project', 'about'

### Component Structure
```
App.js (root component)
├── Background.js (Three.js animated wireframe)
├── Header/ (logo and branding)
├── Navigation/ (nav buttons that control activeSection)
└── Content sections (conditionally rendered based on activeSection):
    ├── Experience + Skills (when activeSection === 'work')
    ├── Projects (when activeSection === 'project')
    └── About (when activeSection === 'about')
```

### Three.js Background Animation
The `Background.js` class creates an animated icosahedron wireframe:
- Initialized in `App.js` on mount, disposed on unmount
- Automatically adjusts color/opacity based on theme (via MutationObserver)
- Light mode: darker grey (0x666666), higher opacity (0.15)
- Dark mode: lighter grey (0xcccccc), lower opacity (0.1)
- Handles window resize events

### Content Management
All text content is centralized in `src/content.json`:
- Portfolio information (name, bio, description)
- Project details with icons, descriptions, and feature lists
- Skills and language proficiency levels
- Header navigation labels

When updating content, edit this JSON file rather than individual components.

### EmailJS Integration
Contact form uses EmailJS (`@emailjs/browser`) in `src/components/contact/Contact.jsx`:
- Service ID: `service_rbeh4f4`
- Template ID: `template_tp658as`
- Public Key: `865Kd8FFdMX3gMGLy`

Form fields: name, email, project (message textarea)

### Key Dependencies
- **React 18.2.0**: Core framework
- **Three.js**: 3D background animation
- **Swiper 10.2.0**: Carousel components (used in testimonials/projects)
- **EmailJS**: Contact form email service
- **GSAP 3.13.0**: Animation library
- **react-icons 5.5.0**: Icon components

### Theme System
Theme is controlled via:
1. `ThemeContext` React Context (src/context/ThemeContext.jsx)
2. `data-theme` attribute on `<html>` element (set by ThemeContext)
3. CSS variables respond to `[data-theme="dark"]` and `[data-theme="light"]`
4. Background.js observes theme changes and updates Three.js material accordingly

Access theme state in components:
```javascript
import { useTheme } from './context/ThemeContext';
const { isDark, toggleTheme } = useTheme();
```

### File Structure Conventions
- Components follow folder-per-component pattern: `/components/[name]/[Name].jsx`
- Each component folder contains its CSS: `/components/[name]/[name].css`
- Case-sensitive: Component files use PascalCase, CSS files use lowercase
- Data/helper components may also exist in component folders (e.g., `Data.jsx`, `Info.jsx`)

## Important Notes

- This is a Create React App project (react-scripts 5.0.1)
- Homepage is configured for GitHub Pages subdirectory: `https://kaidove.github.io/website-portfolio`
- All builds go to `/build` directory (gitignored)
- The site uses boxicons (`bx` classes) for icons throughout the UI
- Navigation state controls content visibility with CSS class `content-active` on wrapper

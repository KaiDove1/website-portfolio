# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A single-page personal portfolio built with React (Create React App). Every section renders on one scrolling page and the header links are in-page `#anchors`. There is no client-side router; adding one (for example `HashRouter`) breaks the anchor navigation.

Deployed on GitHub Pages at: https://kaidove1.github.io/website-portfolio

## Development Commands

```bash
npm install          # Install dependencies
npm start            # Dev server at http://localhost:3000/website-portfolio
npm run build        # Production build to /build
npm test             # React Testing Library (no tests exist yet)
```

### Deployment

```bash
npm run deploy       # predeploy runs the build, then pushes /build to the gh-pages branch
```

Only deploy when explicitly asked. The `gh-pages` branch is a build artifact; never edit it directly. The site is served from the `/website-portfolio` subdirectory (`homepage` in package.json), so links to files in `public/` must use `process.env.PUBLIC_URL`.

## Architecture

- `src/index.js` renders `<App />` inside `React.StrictMode`.
- `src/App.js` wraps everything in `ThemeProvider` and renders, in order: `Header`, then `<main>` with `Home`, `About`, `Skills`, `GitHubStats`, `Projects`, `Qualification`, `Certifications`, `Contact`, then `Footer`, `ScrollUp`, `ThemeToggle`.

Component notes:

- **Header** (`components/header`): anchor links to `#home`, `#about`, `#skills`, `#github`, `#projects`, `#qualification`, `#certifications`, `#contact`. Mobile menu is toggled with local state; a scroll listener adds `.scroll-header`.
- **Home** (`components/home`): hero with `Social` links, `Data` (name, headline, bio, "Say Hello" and "Download CV" buttons) and `ScrollDown`.
- **About** (`components/about`): headshot from `src/assets`, `Info` boxes, bio paragraph.
- **Skills** (`components/skills`): `Languages` and `Tools` lists rendered from `content.json`.
- **GitHubStats** (`components/github`): calls the public GitHub API for user `KaiDove1` (two unauthenticated requests per visit, 60/hour rate limit per IP) and renders `LeetCodeStats` inside the same section.
- **LeetCodeStats** (`components/leetcode`): calls a third-party LeetCode stats API; the catch block provides a fallback when that API is down.
- **Projects** (`components/projects`): cards from `content.json` → `projects`; each card opens a modal with details, `demoUrl` and `githubUrl`.
- **Qualification** (`components/qualification`): Education / Experience tabs. The timeline text is hardcoded in the JSX, not in `content.json`.
- **Certifications** (`components/certifications`): achievements list hardcoded in the component.
- **Contact** (`components/contact`): EmailJS form plus email / LinkedIn / Messenger cards.

### Content Management

Most copy lives in `src/content.json`: `Header` nav labels, `Biograph` (hero), `About`, `Info` boxes, `Languages`, `ToolsAndTechnologies`, and `projects`. `Qualification.jsx` and `Certifications.jsx` keep their own text. Edit the JSON rather than components where possible.

### EmailJS Integration

`Contact.jsx` uses `@emailjs/browser` with `REACT_APP_EMAILJS_SERVICE_ID`, `REACT_APP_EMAILJS_TEMPLATE_ID` and `REACT_APP_EMAILJS_PUBLIC_KEY` from `.env` (template in `.env.example`). CRA inlines `REACT_APP_*` values into the public bundle at build time, so these are not secrets. Form fields: `name`, `email`, `project`.

### Theme System

`src/context/ThemeContext.jsx` keeps `'light' | 'dark'` in localStorage under `portfolio-theme` and sets `data-theme` on `<html>`. CSS variables in `src/App.css` switch under `[data-theme="dark"]`. Components read the theme with:

```javascript
import { useTheme } from './context/ThemeContext';
const { theme, isDark, toggleTheme } = useTheme();
```

### File Structure Conventions

- Folder-per-component: `src/components/<name>/<Name>.jsx` with `<name>.css` beside it (PascalCase JSX, lowercase CSS; the filesystem on CI is case-sensitive).
- Global variables, base styles and the `.section`, `.container`, `.grid`, `.button` utilities live in `src/App.css`. Do not define global class names like `.grid` in a component stylesheet; every component CSS file is bundled into one global stylesheet.
- Icons come from Boxicons (`bx` classes) and Unicons (`uil` classes), both loaded from CDNs in `public/index.html`.

## Important Notes

- Create React App (react-scripts 5.0.1); builds go to `/build` (gitignored).
- Key dependencies: React 18, `@emailjs/browser`, `web-vitals`, `gh-pages` (dev).
- `valentines-photos/` is a gitignored local folder of personal photos; nothing in `main` uses it and it must never be copied into `public/`.

import { createContext, useContext, useEffect, useState } from 'react';

/**
 * Two independent presentation switches, mirrored as attributes on <html> so CSS can
 * react to them:
 *   theme: 'light' | 'dark'   → data-theme
 *   font:  'sans'  | 'mono'   → data-font    (Monospaced mode)
 * Nothing is written to localStorage until the visitor picks something: until then the
 * theme follows the OS setting, live. index.html applies the same logic before first
 * paint to avoid a flash, so the two must stay in sync.
 */
const ThemeContext = createContext(null);

const THEME_KEY = 'portfolio-theme';
const FONT_KEY = 'portfolio-font';

function readStored(key, allowed) {
  try {
    const saved = localStorage.getItem(key);
    if (allowed.includes(saved)) return saved;
  } catch {
    /* localStorage unavailable (private mode, etc.) */
  }
  return null;
}

function persist(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

const osPrefersDark = () => Boolean(window.matchMedia?.('(prefers-color-scheme: dark)').matches);

export function ThemeProvider({ children }) {
  const storedTheme = readStored(THEME_KEY, ['light', 'dark']);
  const [theme, setThemeState] = useState(() => storedTheme ?? (osPrefersDark() ? 'dark' : 'light'));
  const [themeChosen, setThemeChosen] = useState(() => storedTheme !== null);
  const [font, setFontState] = useState(() => readStored(FONT_KEY, ['sans', 'mono']) ?? 'sans');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-font', font);
  }, [font]);

  // Follow the OS until the visitor chooses a theme themselves.
  useEffect(() => {
    if (themeChosen || !window.matchMedia) return undefined;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event) => setThemeState(event.matches ? 'dark' : 'light');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [themeChosen]);

  const setTheme = (next) => {
    setThemeState(next);
    setThemeChosen(true);
    persist(THEME_KEY, next);
  };

  const setFont = (next) => {
    setFontState(next);
    persist(FONT_KEY, next);
  };

  const value = {
    theme,
    isDark: theme === 'dark',
    setTheme,
    toggleTheme: () => setTheme(theme === 'light' ? 'dark' : 'light'),
    font,
    isMono: font === 'mono',
    setFont,
    toggleFont: () => setFont(font === 'sans' ? 'mono' : 'sans'),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}

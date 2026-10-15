import { ThemeProvider } from './context/ThemeContext';
import Hero from './components/hero/Hero';

export default function App() {
  return (
    <ThemeProvider>
      <Hero />
    </ThemeProvider>
  );
}

import { ThemeProvider } from './context/ThemeContext';
import Shell from './components/shell/Shell';

export default function App() {
  return (
    <ThemeProvider>
      <Shell />
    </ThemeProvider>
  );
}

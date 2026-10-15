import content from '../../content/content.json';
import { useTheme } from '../../context/ThemeContext';

/**
 * The LIGHT / DARK / MONOSPACED row that reads upward in the left gutter. The row is
 * laid out horizontally and then rotated -90deg around its bottom-left corner, so it
 * ends up standing on the bottom gutter and climbing the left one. Labels come from
 * `site.theme`; state comes from ThemeContext. A filled square marks the active option.
 */
const BUTTON =
  'inline-flex items-center gap-x-[3px] uppercase font-normal cursor-pointer transition-opacity duration-[400ms] ease-smooth motion-reduce:transition-none hover:opacity-25 focus-visible:outline-1 focus-visible:outline-white focus-visible:outline-offset-4';

function Glyph({ on }) {
  return <span aria-hidden="true">{on ? '■' : '□'}</span>;
}

export default function ThemeSwitch() {
  const { theme, setTheme, isMono, toggleFont } = useTheme();
  const labels = content.site.theme;

  // Clicking the option that is already active is a no-op (no re-render, no storage write).
  const pick = (next) => () => {
    if (theme !== next) setTheme(next);
  };

  return (
    <div className="absolute z-40 left-[calc(var(--pad)-0.15em)] bottom-(--pad) origin-bottom-left -rotate-90 flex gap-x-[15px] whitespace-nowrap mix-blend-difference text-white">
      <button type="button" aria-pressed={theme === 'light'} onClick={pick('light')} className={BUTTON}>
        <Glyph on={theme === 'light'} />
        {labels.light}
      </button>
      <button type="button" aria-pressed={theme === 'dark'} onClick={pick('dark')} className={BUTTON}>
        <Glyph on={theme === 'dark'} />
        {labels.dark}
      </button>
      <button type="button" aria-pressed={isMono} onClick={toggleFont} className={BUTTON}>
        <Glyph on={isMono} />
        {labels.mono}
      </button>
    </div>
  );
}

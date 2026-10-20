import { useEffect, useRef, useState } from 'react';
import { BACKGROUND } from '../../config.js';
import content from '../../content/content.json';
import { useTheme } from '../../context/ThemeContext';
import { PreviewProvider } from '../../context/PreviewContext.jsx';
import { usePage } from '../../hooks/usePage';
import NoiseBackground from '../background/NoiseBackground.js';
import IcosahedronBackground from '../background/IcosahedronBackground.js';
import GlitchBackground from '../background/GlitchBackground.js';
import SiteHeader from './SiteHeader.jsx';
import ThemeSwitch from './ThemeSwitch.jsx';
import QuickLinks from './QuickLinks.jsx';
import EnterOverlay from './EnterOverlay.jsx';
import PageOutlet from './PageOutlet.jsx';
import PreviewLayer from './PreviewLayer.jsx';

/**
 * The fixed, framed viewport everything lives in. Layers, bottom to top:
 *   0  canvas host      the WebGL background, inset by --pad (same box as the frame)
 *   10 page layer       the in-frame scroller holding the current page; blended with
 *                       `difference` so white text reads dark on light and light on dark
 *   15 preview layer    a hovered project's screenshot, unblended (PreviewLayer.jsx)
 *   20 gutter masks    opaque surface strips so scrolled content never shows in the gutters
 *   30 frame            the 1px line, 50% white under the same blend
 *   40 header / switch / quick links / copyright
 *   50 enter overlay    the first-load curtain
 * `--pad` is defined once here; every child measures from it.
 * The header, switch and quick links come first in the JSX so keyboard users reach the nav
 * before the page content; z-index, not DOM order, decides what paints on top.
 * The scroller's inner box is a one-cell grid: a grid item stretches to the box's full
 * (min-)height, whereas a plain `min-h-full` child of a min-height-only parent computes
 * to 0 and every absolutely positioned block in the pages would collapse to the top.
 * The scroller is focusable (tabIndex -1) and receives focus after the curtain lifts and on
 * every page change, so arrow keys and space scroll the frame without a click first.
 * Which background class mounts is decided by `BACKGROUND` in src/config.js. The class is
 * created once, told about theme/font changes through setTheme/setStyle, paused while the
 * tab is hidden, and disposed on unmount (StrictMode runs this twice in dev; that is fine).
 * With 'none' nothing mounts and the frame shows the plain surface color.
 */
const BACKGROUNDS = {
  noise: NoiseBackground,
  glitch: GlitchBackground,
  icosahedron: IcosahedronBackground,
  none: null,
};

export default function Shell() {
  const { isDark, isMono } = useTheme();
  const page = usePage();
  const hostRef = useRef(null);
  const scrollerRef = useRef(null);
  const bgRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [preview, setPreview] = useState(null);

  // Mount the background once; pause it while the tab is hidden.
  useEffect(() => {
    const Background = BACKGROUND in BACKGROUNDS ? BACKGROUNDS[BACKGROUND] : BACKGROUNDS.noise;
    const host = hostRef.current;
    if (!host || !Background) return undefined;

    const bg = new Background(host);
    bgRef.current = bg;
    bg.init();

    const onVisibility = () => {
      if (document.hidden) bg.stop();
      else bg.start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      bg.dispose();
      if (bgRef.current === bg) bgRef.current = null;
    };
  }, []);

  useEffect(() => {
    bgRef.current?.setTheme?.(isDark);
  }, [isDark]);

  useEffect(() => {
    bgRef.current?.setStyle?.(isMono);
  }, [isMono]);

  // Once the curtain lifts, keyboard focus goes to the scroller.
  useEffect(() => {
    if (ready) scrollerRef.current?.focus({ preventScroll: true });
  }, [ready]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-surface isolate transition-colors duration-[900ms] ease-smooth [--pad:max(20px,4vmin)]">
      {/* 0: WebGL canvas, sized by its host */}
      <div ref={hostRef} aria-hidden="true" className="absolute inset-(--pad) z-0 pointer-events-none *:size-full" />

      {/* 40: chrome (first in DOM order so Tab reaches the nav before the page content) */}
      <SiteHeader />
      <ThemeSwitch />
      <QuickLinks />

      {/* 10: blended page layer with the in-frame scroller */}
      <main
        className={`absolute inset-0 z-10 mix-blend-difference text-white transition-opacity duration-[600ms] ease-smooth motion-reduce:transition-none ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          ref={scrollerRef}
          tabIndex={-1}
          className="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-none overscroll-contain outline-none"
        >
          <div className="relative min-h-full grid">
            <PreviewProvider value={setPreview}>
              <PageOutlet page={page} scrollerRef={scrollerRef} />
            </PreviewProvider>
          </div>
        </div>
      </main>

      {/* 15: hovered project's screenshot, outside the blend */}
      <PreviewLayer src={preview} />

      {/* 20: gutter masks */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-0 h-(--pad) bg-surface z-20 transition-colors duration-[900ms] ease-smooth"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 bottom-0 h-(--pad) bg-surface z-20 transition-colors duration-[900ms] ease-smooth"
      />

      {/* 30: the frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-(--pad) z-30 border border-white/50 mix-blend-difference"
      />

      {/* 40: copyright in the bottom gutter */}
      <p className="absolute z-40 left-(--pad) bottom-[calc(var(--pad)*0.5-0.5em)] text-[80%] opacity-50 mix-blend-difference text-white max-sm:hidden">
        {content.site.copyright}
      </p>

      {/* 50: first-load curtain */}
      <EnterOverlay onLeave={() => setReady(true)} />
    </div>
  );
}

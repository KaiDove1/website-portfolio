import { useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import Background from "./Background";
import content from "../../content/content.json";

/**
 * Hero: the first screen. Outer square = the viewport, inner square = a 1px frame
 * inset by --pad, with the Three.js wireframe rendered inside it.
 * Owns the Background lifecycle (create on mount, dispose on unmount).
 *
 * Why the odd classes:
 *  - `isolate` + an opaque `bg-surface` keep `mix-blend-difference` inside this section,
 *    so white reads near-black on the light background and near-white on the dark one.
 *  - the --pad custom property is defined once on the section; children use it for their inset.
 *  - `h-svh` keeps the bottom frame line above mobile browser toolbars.
 */
export default function Hero() {
  const canvasHostRef = useRef(null);
  const bgRef = useRef(null);
  const { isDark } = useTheme();

  // Create the Three.js scene once and tear it down on unmount.
  // StrictMode mounts twice in dev; dispose() removes the first canvas so only one survives.
  useEffect(() => {
    const bg = new Background(canvasHostRef.current);
    bg.init();
    bgRef.current = bg;
    return () => {
      bg.dispose();
      bgRef.current = null;
    };
  }, []);

  // Wireframe color follows the theme (also runs on mount, so the first frame is right).
  useEffect(() => {
    bgRef.current?.setTheme(isDark);
  }, [isDark]);

  return (
    <section
      id="home"
      className="relative isolate h-svh overflow-hidden bg-surface [--pad:max(20px,4vmin)] transition-colors duration-[900ms] ease-smooth"
    >
      {/* Layer 0: Three.js canvas host, inset by --pad. The canvas fills it. */}
      <div
        ref={canvasHostRef}
        aria-hidden="true"
        className="absolute inset-(--pad) z-0 *:size-full"
      />

      {/* Layer 1: the inner square. 50% white under difference = the same mid-grey in both themes. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-(--pad) z-10 border border-white/50 mix-blend-difference"
      />

      <div className="absolute z-20 top-[calc(var(--pad)*2)] left-[calc(var(--pad)*2)] text-white mix-blend-difference whitespace-nowrap">
        <h1>{content.Biograph.title}</h1>

        <p>{content.Biograph.subtitle}</p>

        <nav aria-label="Page Section">
          <ul></ul>
        </nav>
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import content from '../../content/content.json';

/**
 * Full-screen opaque curtain shown on first load: "Kai Dove  Portfolio" centered on the
 * surface color. It holds for ~900 ms, fades out over ~700 ms, then unmounts itself.
 * `onLeave` fires the moment the fade starts so the shell can fade its page layer in
 * underneath. With prefers-reduced-motion the curtain never renders at all (the initial
 * phase is already 'gone', so not even one frame of it is painted).
 * Text comes from `site.enter`.
 */
const HOLD_MS = 900;
const FADE_MS = 700;

const prefersReducedMotion = () =>
  Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

export default function EnterOverlay({ onLeave }) {
  // 'shown' -> 'leaving' (fading) -> 'gone' (unmounted)
  const [phase, setPhase] = useState(() => (prefersReducedMotion() ? 'gone' : 'shown'));

  useEffect(() => {
    if (phase === 'gone') {
      onLeave?.();
      return undefined;
    }
    const leave = setTimeout(() => {
      setPhase('leaving');
      onLeave?.();
    }, HOLD_MS);
    const done = setTimeout(() => setPhase('gone'), HOLD_MS + FADE_MS);
    return () => {
      clearTimeout(leave);
      clearTimeout(done);
    };
    // The sequence runs once per mount; onLeave only flips a flag in the shell.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === 'gone') return null;

  const { name, word } = content.site.enter;
  const leaving = phase === 'leaving';

  return (
    <div
      aria-hidden={leaving ? 'true' : undefined}
      className={`fixed inset-0 z-50 flex items-center justify-center gap-x-[0.5em] bg-surface text-ink text-[30px] transition-opacity duration-[700ms] ease-smooth motion-reduce:transition-none ${
        leaving ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <span className="font-normal">{name}</span>
      <span className="font-extralight">{word}</span>
    </div>
  );
}

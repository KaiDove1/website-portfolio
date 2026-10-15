import { useEffect, useState } from 'react';
import HomePage from '../pages/HomePage.jsx';
import ProjectsPage from '../pages/ProjectsPage.jsx';
import ExperiencePage from '../pages/ExperiencePage.jsx';
import InfoPage from '../pages/InfoPage.jsx';
import ContactPage from '../pages/ContactPage.jsx';

/**
 * Renders the page for the current id inside the in-frame scroller and cross-fades
 * between pages. Two slots: `current` (in normal flow, `relative min-h-full`) and
 * `outgoing` (lifted out of flow with `absolute`, fading down and out over 400 ms).
 * Both slots are one-cell grids so the page root inside stretches to the slot's full
 * height (percentage heights alone do not chain through min-height). The outgoing slot
 * is sized to the viewport (`h-dvh`, the frame's height) rather than to the inner box,
 * so blocks pinned to the frame's bottom stay where they were while it fades.
 * Elements are keyed by page id, so the page that was `current` keeps its DOM node
 * when it moves to the `outgoing` slot, and its class change triggers the transition.
 * `scrollerRef` is the scroll container; on every change it is reset to the top and
 * given keyboard focus (so focus leaves the now-invisible nav link and arrow keys
 * scroll the new page).
 */
const COMPONENTS = {
  home: HomePage,
  projects: ProjectsPage,
  experience: ExperiencePage,
  info: InfoPage,
  contact: ContactPage,
};

const OUT_MS = 400;

export default function PageOutlet({ page, scrollerRef }) {
  const [slots, setSlots] = useState({ current: page, outgoing: null });
  const [entered, setEntered] = useState(true);

  // Page changed: demote the current page to outgoing, mount the new one hidden.
  useEffect(() => {
    if (page === slots.current) return;
    setSlots((s) => ({ current: page, outgoing: s.current }));
    setEntered(false);
    const scroller = scrollerRef?.current;
    if (scroller) {
      scroller.scrollTop = 0;
      scroller.focus({ preventScroll: true });
    }
  }, [page, slots.current, scrollerRef]);

  // Two frames later flip the incoming page to visible, so the browser has painted
  // its hidden state first (otherwise there is nothing to transition from).
  useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [slots.current]);

  // Drop the outgoing page once its fade has finished. A rapid switch replaces
  // the outgoing slot and restarts this timer, so nothing lingers.
  useEffect(() => {
    if (!slots.outgoing) return undefined;
    const t = setTimeout(() => setSlots((s) => ({ ...s, outgoing: null })), OUT_MS);
    return () => clearTimeout(t);
  }, [slots.outgoing, slots.current]);

  const Current = COMPONENTS[slots.current] ?? HomePage;
  const Outgoing = slots.outgoing ? COMPONENTS[slots.outgoing] : null;

  return (
    <>
      {Outgoing && (
        <div
          key={slots.outgoing}
          aria-hidden="true"
          className="absolute top-0 left-0 w-full h-dvh grid pointer-events-none opacity-0 translate-y-[10px] transition-[opacity,translate] duration-[400ms] ease-smooth motion-reduce:transition-none"
        >
          <Outgoing />
        </div>
      )}
      <div
        key={slots.current}
        className={`relative min-h-full grid transition-[opacity,translate] duration-[600ms] ease-smooth motion-reduce:transition-none ${
          entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[10px]'
        }`}
      >
        <Current />
      </div>
    </>
  );
}

# Architecture

> **Living document.** This is the source of truth for how the site is built. Read it before changing
> structure, and update it in the same commit as any structural change (new page, new dependency,
> new convention). `CLAUDE.md` tells Claude Code to load this file at the start of every session.
>
> Last updated: 2026-10-16 (first deploy from `redesign`; top-right GitHub quick link; background switched off).

## 1. What this is

A personal portfolio for Kai Dove, built as **one fixed, framed viewport**: the browser window is the outer
square, a 1px line inset from every edge is the inner square, a WebGL grain field can fill it (switched off for
now, see §8), and the five
"pages" (Home, Projects, Experience, Info, Contact) swap *inside* the square. Nothing scrolls except page
content inside the frame. The layout is modelled on p5aholic.me (Keita Yamada); the code is original.

Fully static: no backend, no database, no router library. Deployed to GitHub Pages at
<https://kaidove1.github.io/website-portfolio/>. Because it lives in a subdirectory, every asset URL carries
the `/website-portfolio/` base path (see §9).

## 2. Branches

| Branch | State |
|---|---|
| `main` | The legacy Create React App site. Frozen. No longer deployed since 2026-10-16; waiting for the merge from `redesign`. |
| `redesign` | The v3 rebuild described here. Live on GitHub Pages since 2026-10-16; merges into `main` next. |
| `gh-pages` | Build artifact pushed by `npm run deploy`. Never edit by hand. |
| `master`, `old-version`, `WIP` | Historical. Ignore. |

Old components are still useful as content references: `git show main:src/components/<name>/<File>.jsx`.

## 3. Stack and why

| Piece | Choice | Why |
|---|---|---|
| Build / dev server | Vite 8 | Create React App is retired; Vite starts instantly and needs one config line. |
| UI | React 19, function components + hooks | Known already; a one-screen site needs nothing heavier (Next/Astro were considered and rejected). |
| Styling | Tailwind CSS v4 (utility classes in JSX) with tokens in `@theme` | Markup and styling in one file, no jumping between JSX and CSS. Tokens stay in one place. |
| Background | Three.js 0.186, one full-screen fragment shader | Original GLSL stippled-grain field (`NoiseBackground.js`); the old wireframe is kept as an alternative. |
| Type | Inter 200/300/400/600 and JetBrains Mono 200/400/600 from Google Fonts | Free; Inter is the closest free geometric sans to the reference, JetBrains Mono powers "Monospaced" mode. |
| Deploy | `gh-pages` package to GitHub Pages | Same as before; free, no server. |
| Visual checks | Playwright script in `scripts/` (not a dependency) | Screenshots every page/mode and runs behaviour checks; see §9. |

Design reference notes and measurements: `inspiration.md`, section 3 (kept local, not committed).

## 4. Repository layout

```
index.html                     Vite entry: meta, pre-paint script that applies the saved theme/font, Google Fonts,
                               <div id="root">, loads src/main.jsx
vite.config.js                 React plugin + Tailwind plugin + base: '/website-portfolio/'
package.json                   scripts: dev, build, preview, deploy
public/                        Copied verbatim into dist/: resume.pdf, images/
scripts/screenshots.js         Playwright visual + behaviour harness (see §9)
src/
  main.jsx                     createRoot + StrictMode. Imports styles/app.css and App
  App.jsx                      <ThemeProvider><Shell /></ThemeProvider>
  config.js                    BACKGROUND = 'noise' | 'icosahedron' | 'none' (currently 'none')
  hooks/usePage.js             PAGES, usePage() (page id from the URL hash), pageHref(id)
  context/ThemeContext.jsx     theme (light|dark) and font (sans|mono) state → <html data-theme data-font>
  styles/app.css               THE ONLY stylesheet: Tailwind import, color tokens, dark:/mono: variants,
                               @theme block, base rules, scrollbar-none utility
  content/content.json         All copy and data (§6). Components never hardcode text
  components/
    shell/Shell.jsx            The fixed framed viewport: layers, background mounting, focus handling
    shell/SiteHeader.jsx       Name, label, vertical nav with the active-page dot (top-left)
    shell/ThemeSwitch.jsx      LIGHT / DARK / MONOSPACED, rotated to read upward in the left gutter
    shell/QuickLinks.jsx       Icon links top-right inside the frame (site.quickLinks), inline SVG icons
    shell/EnterOverlay.jsx     First-load curtain ("Kai Dove  Portfolio") that fades out
    shell/PageOutlet.jsx       Maps page id → page component, cross-fades on change, resets scroll
    pages/HomePage.jsx         Bio lines pinned bottom-right
    pages/ProjectsPage.jsx     Big-title list (also exports TitleList, shared with Experience)
    pages/ExperiencePage.jsx   Same list for work + education
    pages/InfoPage.jsx         Links, skills, achievements (three pinned blocks at xl, one column below)
    pages/ContactPage.jsx      Arrow links pinned bottom-right
    ui/ArrowLink.jsx           "{label} ↗" link + linkProps() (external / file / mailto rules)
    background/NoiseBackground.js        Grain-field shader (default)
    background/IcosahedronBackground.js  Rotating wireframe (alternative)
  assets/                      Leftover images from the old site; nothing imports them (safe to delete)
ARCHITECTURE.md, CLAUDE.md     This file and the short rules for Claude Code
.env, .env.example             Leftover EmailJS keys from the old contact form; unused now
```

## 5. Runtime flow

**Boot.** `index.html` runs a tiny inline script that sets `data-theme` and `data-font` on `<html>` from
localStorage (falling back to the OS color scheme) *before* anything paints, then loads `src/main.jsx` →
`App.jsx` → `Shell`. StrictMode is on, so effects run twice in dev; anything that creates a resource must
clean it up (the background classes do).

**Page state.** There is no router library. `usePage()` reads the URL hash: `#/` is home, `#/projects`,
`#/experience`, `#/info`, `#/contact` are the others; anything else falls back to home. Nav links are plain
anchors to those hashes, so they work as links, in history, and when shared. A `hashchange` event re-renders.

**Theme and font.** `ThemeContext` holds `theme` and `font`, mirrors them to `<html>` attributes, and exposes
`useTheme()` → `{ theme, isDark, setTheme, toggleTheme, font, isMono, setFont, toggleFont }`. Nothing is written
to localStorage until the visitor clicks a switch; until then the theme follows the OS setting live. CSS reacts
through the `dark:` and `mono:` variants and the `--surface` / `--ink` tokens; the shader is told separately via
`setTheme(isDark)` and `setStyle(isMono)` because WebGL cannot read CSS variables.

**Shell lifecycle.** Shell creates the background class named by `config.BACKGROUND` once, calls `init()`, pauses it
with `stop()` while the tab is hidden, and `dispose()`s on unmount. After the enter overlay lifts, and on every page
change, the in-frame scroller receives keyboard focus so arrow keys and space scroll it.

**Page change.** `PageOutlet` keeps two slots: the current page in flow and the outgoing page lifted out of flow
with `absolute`, fading down and out over 400 ms while the new page fades up over 600 ms. The scroller resets to
the top on each change. The nav dot moves to the new page.

## 6. The frame: layers and the blend trick

```
┌──────────────────── viewport = Shell root (fixed inset-0) ──────────────────────┐
│ ← --pad →                                                                       │
│   ┌──────────── frame: 1px line (inner square) ────────────────────────────┐    │
│   │   canvas host (same inset) → NoiseBackground draws the grain field     │    │
│   │                                                                        │    │
│   │   Kai Dove / label / nav   at 2 × --pad     quick-link icons, top-right│    │
│   │                                                 page content           │    │
│   │                                             (right-aligned lists,      │    │
│   │                                              bio or links bottom-right)│    │
│   └────────────────────────────────────────────────────────────────────────┘    │
│ LIGHT DARK MONOSPACED reads upward in the left gutter;  © sits in the bottom gutter │
└─────────────────────────────────────────────────────────────────────────────────┘
```

| z | Element | Classes that matter |
|---|---|---|
| 0 | canvas host | `absolute inset-(--pad) *:size-full` |
| 10 | page layer (`<main>`) | `absolute inset-0 mix-blend-difference text-white`; inside it the scroller `overflow-y-auto overflow-x-hidden scrollbar-none` with a `relative min-h-full grid` inner box |
| 20 | gutter masks | two `h-(--pad) bg-surface/90` strips, top and bottom, so scrolled content fades under the gutters |
| 30 | frame | `absolute inset-(--pad) border border-white/50 mix-blend-difference pointer-events-none` |
| 40 | header, switch, quick links, copyright | all `mix-blend-difference text-white` |
| 50 | enter overlay | `fixed inset-0 bg-surface text-ink` |

Rules, and why they exist:

- `[--pad:max(20px,4vmin)]` on the Shell root defines the inset once; children use `inset-(--pad)` and
  `calc(var(--pad)*2)` for text blocks.
- The root has `isolate` **and** an opaque `bg-surface`. The difference blend subtracts the element from its
  backdrop: white text reads near-black on the light surface (|255 − 230|) and near-white on the dark one
  (|255 − 13|), and a 50 % white line reads the same mid-grey in both. Remove either class and light-mode text
  turns white. Every page component therefore uses *no* color classes at all.
- Page roots are `relative min-h-full w-full` inside a one-cell grid, so blocks pinned with `absolute bottom-…`
  measure against the full frame, not a collapsed box.
- Below `xl`, page content stays right-aligned and every row keeps `max-w-[calc(100%-120px)]` so the rows that
  share height with the nav column on phones never run into it (the reference makes the same compromise).

## 7. content.json schema

```
site:        { name, label, copyright, enter: { name, word }, theme: { light, dark, mono },
               labels: { github, quickLinks },                  // quickLinks = the list's aria-label
               quickLinks: [{ label, href | file, icon }] }     // top-right icons, in display order
nav:         [{ id: 'home'|'projects'|'experience'|'info'|'contact', label }]
home:        { bio: string[] }                               // one short line per entry
projects:    [{ id, name, year: string|null, stack, summary, details[], demoUrl, githubUrl }]
experience:  [{ title, org, period, kind: 'work'|'education' }]   // newest first
info:        { headings: { links, skills, achievements },    // aria-labels only, never shown
               links: [{ label, href } | { label, file, download }],
               achievements: [{ title, detail }],
               skills: [{ label, items: string[] }] }
contact:     { links: [{ label, href }] }
```

Rendering rules: a project title links to `demoUrl || githubUrl`; its info line is `year / stack` (year omitted
when null) plus a GitHub arrow link when both URLs exist; `summary` and `details` are kept for a future detail
view and not rendered. `ArrowLink.linkProps()` decides link attributes: `http(s)` → new tab with
`rel="noopener noreferrer"`, `file` → `import.meta.env.BASE_URL + file` with `download`, `mailto:` → neither.
Quick links render icon-only: `icon` picks an SVG from `ICONS` in `QuickLinks.jsx`, `label` becomes the link's
`aria-label`, and an `icon` with no entry falls back to the label as text so a link is never invisible.

## 8. Background classes

`BACKGROUND` in `src/config.js` picks the class. `'none'` mounts nothing (the canvas host stays empty and the
frame shows the plain surface); it is the current setting. Three.js is still bundled because both classes are
imported statically; delete them and the `three` dependency if the background is dropped for good.

Both classes expose the same lifecycle so `Shell` can mount either one:

| Method | Does |
|---|---|
| `new X(containerEl)` | Binds handlers once so `dispose` removes the same references. |
| `init()` | Creates the renderer and canvas inside the container, observes the container with `ResizeObserver`, draws one frame, starts the loop. Guards double init and missing WebGL (frame stays empty). |
| `setTheme(isDark)` | Recolors. Noise: dark-grey dots on light, light-grey on dark. Wireframe: `0x666666`/`0xcccccc`. |
| `setStyle(isMono)` | Noise: samples the field on a 50×50 grid for a blocky look. Wireframe: no-op. |
| `start()` / `stop()` | rAF loop control; `start` is idempotent; never runs under `prefers-reduced-motion` (one static frame instead). |
| `dispose()` | Cancels rAF, disconnects observers, disposes GPU objects, forces context loss, removes the canvas. |

**How the noise field works** (explained in plain language at the top of `NoiseBackground.js`): one full-screen
quad; for every pixel the shader computes a *density* from a large feathered disc (centre near 75 % across and
30 % down, radius ≈ 0.62 of the shorter side) with a gentle rim band, multiplied by hand-written value-noise
fbm and drifted over a 75 s loop; then each pixel rolls a hash and is painted only when the roll falls under
the density, which produces stippled grain instead of a smooth gradient. The seed steps 12 times per second
so the grain shimmers subtly. Pixel ratio is capped at 1.5, there are no render targets and one draw call.

## 9. Conventions

**Styling (Tailwind v4)**
- Utility classes in JSX only. No per-component CSS files. Comments at the top of each component explain what it
  renders, what data it reads and anything non-obvious. No per-component Markdown.
- Colors live only in `styles/app.css`: `--surface` and `--ink` per theme, exposed as `bg-surface` / `text-ink`.
  Page components set no colors at all (they inherit white under the blend). Pure white/black utilities are
  allowed only under blend modes (`text-white`, `border-white/50`).
- `dark:` and `mono:` key off the `<html>` attributes, not the OS, via `@custom-variant` in `app.css`.
- Arbitrary values are fine (`inset-(--pad)`, `top-[calc(var(--pad)*2)]`, `duration-[900ms]`,
  `[text-box:trim-both_cap_alphabetic]`). Promote a combination to `@utility` in `app.css` after its third use.
- Tailwind scans `src/` only (`source("../")` in `app.css`), so class-like strings in Markdown or comments at the
  root never leak into the CSS. Keep class strings whole (no runtime concatenation of fragments).
- Class order: layout → box → typography → color → effects → transitions → responsive and state variants.
- Mobile-first breakpoints: base = phones, `sm:` 640, `md:` 768, `xl:` 1280. Hover styles use `hover:` (already
  pointer-only in v4). Everything that moves also gets `motion-reduce:transition-none` or a reduced-motion check.
- The "Tailwind CSS IntelliSense" VS Code extension shows the CSS for every class on hover; use it.

**Content**
- All copy and data in `src/content/content.json` (§7). Adding a page means adding its data first.
- Files in `public/` are referenced through `import.meta.env.BASE_URL`, never as a bare `/` path.

**Components**
- Function components, default export, folder per role (`shell/`, `pages/`, `ui/`, `background/`), PascalCase `.jsx`.
- Every page component returns `<div className="relative min-h-full w-full">…</div>` and reads content.json itself.
- Icons are inline SVG components (`fill="currentColor"`, `aria-hidden`) picked by an `icon` key from content.json
  through an `ICONS` map; no icon library. They live in `QuickLinks.jsx` until a second component needs them, then
  move to `ui/`. Brand paths come from Simple Icons (CC0). currentColor is what lets them blend like the text.
- Accessibility: `aria-current="page"` on the active nav link (which also leaves the tab order while invisible),
  `aria-pressed` on the switch buttons, `aria-label` on lists, a visible `focus-visible` ring on every control.

## 10. Recipe: adding a page

1. Add its data under a new key in `src/content/content.json` and an entry in `nav` (`{ id, label }`).
2. Add the id to `PAGES` in `src/hooks/usePage.js`.
3. Create `src/components/pages/<Name>Page.jsx` returning the standard page root; use `TitleList` from
   `ProjectsPage.jsx` for list pages or pin blocks with `absolute` + `calc(var(--pad)*2)` like Home/Contact.
4. Register it in `COMPONENTS` in `src/components/shell/PageOutlet.jsx`.
5. Update §4 and §7 of this file, then run the screenshot script.

## 11. Build, verify, deploy

| Command | Effect |
|---|---|
| `npm run dev` | Dev server at <http://localhost:5173/website-portfolio/> |
| `npm run build` | Production bundle in `dist/` (gitignored) |
| `npm run preview` | Serves `dist/` locally |
| `node scripts/screenshots.js [name]` | Builds, serves, screenshots every page in light/dark/mono and phone/tablet sizes into `screenshots/<name>/`, clicks through the nav and switches, and prints a JSON summary. One-time setup: `npm install --no-save playwright && npx playwright install chromium`. It is an ES module (`import`, not `require`) because package.json sets `"type": "module"`. |
| `npm run deploy` | Build, then push `dist/` to the `gh-pages` branch. Only when explicitly asked. |

Expected harness checks: one canvas (zero while `BACKGROUND = 'none'`), overlay gone, active nav item invisible (dot shown), `#/projects` after
clicking Projects, dark/mono applied and persisted after clicking, focus reaches the nav after a few Tabs, the
body never scrolls while the frame does, stored preferences apply on load, one canvas under reduced motion (zero
while `'none'`), the quick link opens in a new tab, and `quickLinksOverlap` reads `clear` for every page at
1440×900, 1280×720 and 390×844.

`base: '/website-portfolio/'` in `vite.config.js` is what makes the subdirectory work. Three.js makes the main
chunk about 775 KB minified (210 KB gzipped); the noise shader uses only a sliver of the library, so a later
optimisation is to render it with raw WebGL and drop `three` entirely.

## 12. Roadmap

| Item | Status |
|---|---|
| Vite scaffold, tokens, theme context | Done 2026-10-14 |
| Framed shell: frame, masks, header with dot nav, rotated switch, copyright, enter overlay, page transitions | Done 2026-10-15 |
| Five pages from content.json | Done 2026-10-15 |
| Original grain-field shader, light/dark/mono | Done 2026-10-15 |
| Screenshot harness and behaviour checks | Done 2026-10-15 |
| Top-right quick links (GitHub icon) | Done 2026-10-15 |
| More socials / cool things in `site.quickLinks` (each needs an SVG in `ICONS`) | Owner |
| Fill in `year` for MedQuery, Beli, Investiverse in content.json | Owner |
| Decide whether `inspiration.md` is committed or ignored | Owner |
| Delete unused `src/assets/*` and the leftover `.env` files | Owner |
| First `npm run deploy` from `redesign` | Done 2026-10-16 |
| Merge `redesign` into `main` | When Kai says so |
| Optional: project detail view using `summary`/`details`; drop Three.js for raw WebGL | Later |

## 13. Decision log

- **2026-10-14. Rebuild from scratch rather than restyle.** CRA is retired, the old code was a YouTube template whose
  global CSS fought the new design, and nearly all content was already in JSON.
- **2026-10-14. Vite + React, not Next.js or Astro.** A one-screen static site needs no server rendering or routing.
- **2026-10-15. Tailwind v4 instead of plain CSS files.** Kai found switching between JSX and CSS files hard to follow.
- **2026-10-15. Pages inside the frame, hash-based page state, no router library.** The reference keeps everything
  inside the square; hashes work on GitHub Pages without a 404 fallback and keep links shareable.
- **2026-10-15. Original noise-field shader as the default background**, with the old icosahedron kept behind the
  `config.js` switch. The reference's code is private; this is an independent implementation of the same idea.
- **2026-10-15. Contact is links only.** The EmailJS form was dropped to match the reference's minimal contact page.
- **2026-10-15. Monospaced mode** switches the whole site to JetBrains Mono and tells the shader to quantize its field.
- **2026-10-15. Theme follows the OS until the visitor chooses.** Nothing is persisted on first visit.
- **2026-10-15. Background switched off for now** (`BACKGROUND = 'none'`). Kai wanted a plain frame; the shader
  classes stay in the repo so switching back is one line.
- **2026-10-15. Quick links: icons only, top-right inside the frame, GitHub first.** Kai chose this over text in the
  top gutter. The Info page's skills block moved down to nav level at xl (+125px, the TitleList offset) to clear the
  corner. Scrolled titles may pass under the icon, the same way they pass under the name.

## 14. Known gaps

- Project `year` is null for three projects, so their info line shows only the stack.
- `src/assets/*` (four files) and `.env` / `.env.example` are unused leftovers awaiting deletion.
- GitHub and LeetCode live stats from the old site are not part of v3; the numbers live as text in `info.achievements`.
- No automated unit tests; verification is the screenshot harness plus manual checks in the browser.

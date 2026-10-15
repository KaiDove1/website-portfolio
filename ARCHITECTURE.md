# Architecture

> **Living document.** This is the source of truth for how the site is built. Read it before changing
> structure, and update it in the same commit as any structural change (new section, new dependency,
> new convention). `CLAUDE.md` tells Claude Code to load this file at the start of every session.
>
> Last updated: 2026-10-15 (rebuild step 1 complete; styling switched to Tailwind).

## 1. What this is

A single-page personal portfolio for Kai Dove. Fully static: no backend, no database, no router.
Deployed to GitHub Pages at <https://kaidove1.github.io/website-portfolio/>. Because it lives in a
subdirectory, every asset URL carries the `/website-portfolio/` base path (see §9).

## 2. Branches

| Branch | State |
|---|---|
| `main` | The legacy Create React App site. Still deployed. Frozen. |
| `redesign` | The v3 rebuild described here (Vite + React 19). Replaces `main` when it reaches parity. |
| `gh-pages` | Build artifact pushed by `npm run deploy`. Never edit by hand. |
| `master`, `old-version`, `WIP` | Historical. Ignore. |

Old components are still useful as porting references: `git show main:src/components/<name>/<File>.jsx`.

## 3. Stack and why

| Piece | Choice | Why |
|---|---|---|
| Build / dev server | Vite 8 | Create React App is retired; Vite starts instantly and needs one config line. |
| UI | React 19, function components + hooks | Known already; a one-page site needs nothing heavier (Next/Astro were considered and rejected). |
| Styling | Tailwind CSS v4 (utility classes in JSX) with design tokens in `@theme` | Markup and styling in one file, so there is no jumping between JSX and CSS. Tokens stay in one place. No CSS-in-JS. |
| 3D | Three.js (wireframe icosahedron in the hero) | Carried over from the old site; sized to the hero frame. |
| Type | Inter 200 / 300 / 400 from Google Fonts | Free, geometric, closest to the reference site's PP Neue Montreal. |
| Deploy | `gh-pages` package to GitHub Pages | Same as before; free, no server. |
| Contact (planned) | `@emailjs/browser` | Form posts straight to EmailJS; no backend needed. |

Design reference: p5aholic.me (Keita Yamada). Notes and measurements are in `inspiration.md`, section 3.

## 4. Repository layout

```
index.html                 Vite entry. Meta tags, Google Fonts link, <div id="root">, loads src/main.jsx
vite.config.js             React plugin + Tailwind plugin + base: '/website-portfolio/'
package.json               scripts: dev, build, preview, deploy
public/                    Copied verbatim into dist/. resume.pdf, images/
src/
  main.jsx                 createRoot + StrictMode. Imports styles/app.css and App
  App.jsx                  <ThemeProvider> wrapping the page sections in scroll order
  styles/app.css           THE ONLY stylesheet: Tailwind import, color tokens (light + [data-theme="dark"]),
                           the @theme block that turns tokens into utilities, and a few base rules
  content/content.json     All copy and data. Components never hardcode text
  assets/                  Images imported by components (bundled and hashed by Vite)
  context/ThemeContext.jsx Theme state (see §5)
  components/<name>/       One folder per section: Name.jsx (styled with utility classes) + helpers
    hero/                  Hero.jsx, Background.js   ← the framed first screen
ARCHITECTURE.md            This file
CLAUDE.md                  Short rules for Claude Code; points here
inspiration.md             Reference-site research
.env / .env.example        VITE_* variables (EmailJS keys, planned). Inlined into the bundle, so not secrets
```

**Transitional note.** Until the old files are deleted, the legacy CRA tree still sits beside the new one
(`src/App.js`, `src/App.css`, `src/index.js`, `src/content.json`, `src/components/*` other than `hero/`,
`public/index.html`, `public/manifest.json`). Nothing imports them. `src/main.jsx` imports `./App.jsx`
with the extension because Vite would otherwise resolve `./App` to the old `App.js`.

## 5. Runtime flow

**Boot.** `index.html` → `src/main.jsx` → `App.jsx`. StrictMode is on, so effects run twice in dev;
anything that creates a resource must clean it up (the hero's `Background` does).

**Component tree** (page order top to bottom; status as of the last update):

| Component | Section id | Status |
|---|---|---|
| `hero/Hero` | `#home` | Built: frame + canvas. Nav, bio and theme switch are the next steps. |
| About | `#about` | Planned (port from `main`) |
| Skills | `#skills` | Planned |
| GitHub + LeetCode stats | `#github` | Planned (copy fetch logic from `main`) |
| Projects | `#projects` | Planned |
| Experience & Education | `#qualification` | Planned; data moves from JSX into `content.json` |
| Achievements | `#certifications` | Planned; same |
| Contact | `#contact` | Planned; EmailJS with `VITE_EMAILJS_*` |
| Footer, top bar after hero, scroll-to-top | | Planned |

**Data flow.** Components `import content from '../../content/content.json'` and read their own key.
The JSON is bundled at build time; there is no runtime fetch except the planned GitHub/LeetCode stats.

**Theme flow.**

```
ThemeContext (useState, default 'light', persisted in localStorage 'portfolio-theme')
   └─ sets <html data-theme="light|dark">
        └─ app.css swaps --surface / --ink / --heading
             └─ utilities like bg-surface and text-ink recolor automatically; `dark:` variants also key off data-theme
Hero additionally calls Background.setTheme(isDark) because WebGL cannot read CSS variables.
```

Use it with `const { theme, isDark, toggleTheme } = useTheme()`.

**Navigation.** One scrolling page with in-page `#anchor` links and `html { scroll-behavior: smooth }`.
There is deliberately no client-side router; adding one breaks the anchors.

## 6. The hero: outer square and inner square

```
┌──────────────────── viewport = .hero (outer square) ────────────────────┐
│ ← --pad →                                                               │
│   ┌──────────── .hero__frame  1px line = inner square ───────────────┐  │
│   │   .hero__canvas  (Three.js, same inset as the frame)             │  │
│   │                                                                  │  │
│   │   name / label / vertical nav   at 2 × --pad        [step 2]     │  │
│   │                                                                  │  │
│   │                                  bio + links  at 2 × --pad  [3]  │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│ LIGHT / DARK  rotated, in the left gutter [4]        © in bottom gutter │
└─────────────────────────────────────────────────────────────────────────┘
```

| Layer | Element | z | Utilities |
|---|---|---|---|
| 0 | canvas host `<div>` | `z-0` | `absolute inset-(--pad) *:size-full`. Hosts the WebGL canvas, which fills it. |
| 1 | frame `<div>` | `z-10` | `absolute inset-(--pad) border border-white/50 mix-blend-difference pointer-events-none`. |
| 2 | text blocks (planned) | `z-20` | `text-white mix-blend-difference`. |

Key rules, and why they exist:

- `[--pad:max(20px,4vmin)]` on the `<section>` defines the inset once; children use `inset-(--pad)` and
  `calc(var(--pad)*2)` for the text blocks.
- The section has `isolate` **and** an opaque `bg-surface`. The difference blend subtracts the element from
  its backdrop; with an opaque surface that means white reads near-black in light mode (|255 − 250|) and
  near-white in dark mode (|255 − 20|), and a 50 % white line reads the same mid-grey in both. Remove either
  class and light-mode text turns white.
- `h-svh` (100svh) keeps the bottom frame line above mobile browser toolbars.
- `overflow-hidden` so rotated or oversized children never create scrollbars.

**`Background.js`** is a plain class, not a React component, so Three.js objects are created once and
disposed deterministically:

| Method | Does |
|---|---|
| `new Background(containerEl)` | Binds handlers once (so `dispose` can remove the same references). |
| `init()` | Creates renderer (alpha, antialias, pixel ratio capped at 2), camera, icosahedron wireframe; appends the canvas to the container; observes the container with `ResizeObserver`; draws one frame; starts the loop. Guards against double init and missing WebGL. |
| `setTheme(isDark)` | Light: `0x666666` at 0.15 opacity. Dark: `0xcccccc` at 0.10. |
| `handleResize()` | Reads the **container** size (not the window), updates camera aspect, `renderer.setSize(w, h, false)` so CSS keeps owning the canvas box. |
| `start()` / `stop()` | rAF loop (`rotation.x += .001`, `rotation.y += .002`). Not started when `prefers-reduced-motion` is set; one static frame is drawn instead. |
| `dispose()` | Cancels rAF, disconnects observers, disposes geometry/material/renderer, forces GL context loss, removes the canvas. |

`Hero.jsx` owns the lifecycle: one effect creates/disposes it, a second effect with `[isDark]` forwards the theme.

## 7. Conventions

**Styling (Tailwind v4)**
- Components are styled with utility classes in their JSX. There are no per-component CSS files.
- Colors live only in `styles/app.css`: the `:root` / `[data-theme="dark"]` variables, exposed through
  `@theme inline` as `bg-surface`, `text-ink`, `text-heading` (plus `font-sans`, `ease-smooth`). Never use a
  raw hex or `text-gray-500` for site colors; add a token instead.
- `dark:` works off `data-theme`, not the OS, thanks to the `@custom-variant dark` line in `app.css`.
- Values Tailwind has no utility for use arbitrary syntax: `inset-(--pad)` for a variable, `[--pad:…]` to
  define one, `duration-[900ms]`, `[writing-mode:…]`. If the same arbitrary combination appears three times,
  promote it to a `@utility` in `app.css`.
- Class order: layout → box → typography → color → effects → transitions → responsive and state variants.
  Keep one long `className` string per element; split across lines only when it exceeds roughly 100 characters.
- Breakpoints: mobile-first. Base styles are for phones; `sm:` (640px), `md:` (768px), `xl:` (1280px) add on top.
- Hover styles use the `hover:` variant (Tailwind v4 already wraps it in `@media (hover: hover)`).
  Honor `motion-reduce:` for anything that moves.
- Install the "Tailwind CSS IntelliSense" VS Code extension: it autocompletes classes and shows the CSS on hover,
  which is the intended way to learn what each utility does.

**Content**
- All copy and data in `src/content/content.json`. Adding a section means adding a key first.
- Current keys: `Header` (legacy nav labels), `Biograph` (title, subtitle, description), `About`, `Info`
  (six title/subtitle pairs), `Languages` → `Programming Languages[]` (`name`, `icon`), `ToolsAndTechnologies`
  → `Tools[]`, `projects[]` (`id`, `icon`, `outsidetitle`, `insideTitle`, `description`, `details[]`,
  `demoUrl`, `githubUrl`). Icon strings are Boxicons class names from the old site; the icon approach for v3
  is still to be decided.
- Files in `public/` are referenced as `${import.meta.env.BASE_URL}resume.pdf`, never as `/resume.pdf`.

**Components**
- Function components, default export, folder per component, PascalCase `.jsx` beside lowercase `.css`.
  The filesystem in CI is case-sensitive; imports must match exactly.
- Every section is a `<section id="…">`; the id is the anchor target used by navigation.
- Decorative layers get `aria-hidden="true"`; navigation gets `aria-label`; interactive elements keep a
  visible `:focus-visible` style.

**Environment**
- Variables use the `VITE_` prefix and are read with `import.meta.env.VITE_…`. Vite inlines them into
  the public bundle, so nothing secret goes there. `.env.example` lists the expected keys.

## 8. Recipe: adding a section

1. Add the section's data to `src/content/content.json`.
2. Create `src/components/<name>/<Name>.jsx`; it imports the JSON and styles itself with utility classes.
3. Return `<section className="<name>" id="<anchor>">…</section>`.
4. Import it in `App.jsx` in page order.
5. Add a nav entry wherever the nav list lives (the hero nav once step 2 exists).
6. Update the component table in §5 of this file.

## 9. Build and deploy

| Command | Effect |
|---|---|
| `npm run dev` | Dev server at <http://localhost:5173/website-portfolio/> |
| `npm run build` | Production bundle in `dist/` (gitignored) |
| `npm run preview` | Serves `dist/` locally for a final check |
| `npm run deploy` | Runs the build, then pushes `dist/` to the `gh-pages` branch. Only when explicitly asked. |

`base: '/website-portfolio/'` in `vite.config.js` is what makes the subdirectory work; `import.meta.env.BASE_URL`
exposes it to code. Three.js makes the main chunk about 750 KB minified (200 KB gzipped); if that becomes a
problem, load `Background.js` with a dynamic `import()` so it ships as its own chunk.

## 10. Roadmap

| Step | What | Status |
|---|---|---|
| 1 | Vite scaffold, tokens, theme context, hero frame + wireframe | Done 2026-10-14 |
| 2 | Hero nav: name, title, vertical anchor list top-left | Next (Kai builds) |
| 3 | Bio + LeetCode / LinkedIn / GitHub / Resume links bottom-right | |
| 4 | LIGHT / DARK switch in the left gutter, © in the bottom gutter | |
| 5–12 | One section per step: About, Skills, GitHub + LeetCode stats, Projects, Experience & Education, Achievements, Contact, Footer | |
| 13 | Slim top bar that appears after the hero; scroll-to-top | |
| 14 | Responsive and accessibility pass, deploy, merge `redesign` into `main` | |

## 11. Decision log

- **2026-10-14. Rebuild from scratch rather than restyle.** CRA is retired, the old code was a YouTube template
  whose global CSS fought the new design, and nearly all content was already in JSON.
- **2026-10-14. Vite + React, not Next.js or Astro.** A one-page static site needs no server rendering or routing.
- **2026-10-14. Plain CSS with tokens, not Tailwind.** Superseded the next day, see below.
- **2026-10-15. Tailwind v4 instead of plain CSS files.** Kai found switching between JSX and CSS files hard to
  follow; keeping styling in the markup was worth more than hand-written CSS fidelity. Tokens remain in one place
  (`app.css` `@theme`). The hero was converted with no visual change.
- **2026-10-14. Hero copies p5aholic.me's framed layout.** Keep the icosahedron inside the frame; page content
  scrolls below the frame; the regular nav appears only after the hero leaves the screen.
- **2026-10-14. Text inverts with `mix-blend-mode: difference`** instead of per-theme colors, so one rule serves both themes.

## 12. Known gaps

- Legacy CRA files are still in the tree (see §4) and `package-lock.json` is the old one until `npm prune`
  and `npm install` run cleanly.
- No automated tests. Verification is manual in the browser (see the plan's per-step checklists).
- The GitHub stats call is unauthenticated (60 requests per hour per IP). The third-party LeetCode stats API
  used by the old site was unreliable; the ported component needs a fallback.

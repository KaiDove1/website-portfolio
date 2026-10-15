# CLAUDE.md

Guidance for Claude Code in this repository.

## Start here

**Read `ARCHITECTURE.md` first, every session.** It is the source of truth for the stack, file layout,
runtime flow, conventions and roadmap. If a change adds a section, a dependency, a convention or moves
files, update `ARCHITECTURE.md` in the same change. Do not duplicate its content here.

## Branch note

`redesign` is the v3 rebuild (Vite + React 19) that `ARCHITECTURE.md` describes. `main` still holds the
legacy Create React App site and is what is deployed; its own `CLAUDE.md` describes that version.

## Commands

```bash
npm install        # dependencies
npm run dev        # http://localhost:5173/website-portfolio/
npm run build      # production build to dist/
npm run preview    # serve dist/ locally
npm run deploy     # build and push dist/ to gh-pages. Only when explicitly asked.
```

## Rules

- All copy and data live in `src/content/content.json`. Never hardcode text in components.
- Styling is Tailwind v4 utility classes in JSX. No per-component CSS files.
- Colors are defined only in `src/styles/app.css` (tokens exposed as `bg-surface`, `text-ink`, `text-heading`). Never raw hex or default palette colors for site colors.
- Files in `public/` are referenced with `import.meta.env.BASE_URL`, never a bare `/` path.
- No client-side router. Navigation is in-page anchors.
- The `gh-pages` branch is a build artifact; never edit it directly.
- Env vars use the `VITE_` prefix and are public once built.

## Working agreements

- Work in small steps that each leave the site running, then stop so Kai can check in the browser.
- Kai builds some parts himself for practice. When he says so, give guidance and review his code instead of writing it.

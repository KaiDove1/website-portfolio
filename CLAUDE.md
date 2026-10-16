# CLAUDE.md

Guidance for Claude Code in this repository.

## Start here

**Read `ARCHITECTURE.md` first, every session.** It is the source of truth for the stack, file layout,
runtime flow, conventions and roadmap. If a change adds a page, a dependency, a convention or moves
files, update `ARCHITECTURE.md` in the same change. Do not duplicate its content here.

## Branch note

`redesign` is the v3 rebuild (Vite + React 19 + Tailwind v4, framed single-viewport layout) that
`ARCHITECTURE.md` describes, and the live site has been built from it since 2026-10-16. `main` still holds
the legacy Create React App site (its own `CLAUDE.md` describes it) until `redesign` is merged into it.

## Commands

```bash
npm install                     # dependencies
npm run dev                     # http://localhost:5173/website-portfolio/
npm run build                   # production build to dist/
npm run preview                 # serve dist/ locally
node scripts/screenshots.js     # visual + behaviour harness (needs a one-time playwright install, see the file)
npm run deploy                  # build and push dist/ to gh-pages. Only when explicitly asked.
```

## Rules

- All copy and data live in `src/content/content.json`. Never hardcode text in components.
- Styling is Tailwind v4 utility classes in JSX. No per-component CSS files.
- Colors are defined only in `src/styles/app.css` (`bg-surface`, `text-ink`). Page components set no colors;
  they inherit white under the shell's difference blend.
- Pages live inside the fixed frame and are selected by the URL hash (`#/projects`), via `src/hooks/usePage.js`.
  No router library, no in-page anchors, no body scrolling.
- Files in `public/` are referenced with `import.meta.env.BASE_URL`, never a bare `/` path.
- The `gh-pages` branch is a build artifact; never edit it directly.
- The layout is modelled on p5aholic.me; never fetch or copy that site's source. Work from `ARCHITECTURE.md`
  and screenshots only.

## Working agreements

- Kai's pace varies per task: when he asks for small steps or practice, stop after each change for his
  browser check and guide rather than write; when he says to go all the way, build it and verify with
  the screenshot harness before handing over.

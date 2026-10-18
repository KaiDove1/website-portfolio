# Inspiration

Portfolio sites to draw ideas from, with notes from inspecting each one (October 2026).

- https://antfu.me/
- https://www.dalelarroder.com/
- https://p5aholic.me/projects/
- https://www.undefined-shin.com/#/

---

## 1. antfu.me — Anthony Fu

**Who:** Anthony Fu, open-source developer at Vercel and Nuxt. Creator of Vitest, Slidev, VueUse, UnoCSS, Elk and Type Challenges; Vue, Nuxt and Vite core team; maintains Shiki, Twoslash and ESLint Stylistic.

**Stack:** Vite + Vue 3 with file-based routes, UnoCSS, TypeScript, pnpm, hosted on Netlify. Open source on GitHub (MIT for code, CC BY-NC-SA for words and photos).

**Layout**
- One narrow centered prose column (max 65ch) with generous whitespace.
- Small handwritten SVG signature top-left as the logo (fixed on large screens).
- Top-right plain text nav: Blog, Projects, Talks, Sponsors, Podcasts, Photos, Demos, then icon links for Bluesky, GitHub, RSS. Links sit at 60% opacity, 100% on hover. Several items hide on mobile.

**Home page copy**
- Large "Anthony Fu" heading, then markdown prose: "Hey! I'm Anthony Fu, a fanatical open sourceror and design engineer."
- Short lines: "Working at Vercel / Nuxt", "Creator of …", "Core team of …", "Maintaining …". Every project name is an inline pill (faint grey background, tiny icon, condensed font).
- Paragraphs on talks, blog, Mandarin podcast, YouTube/Bilibili streams, generative art at 100.antfu.me, photography, and a /use page.
- "Find me on" row: GitHub, Bluesky, Discord, three Twitter accounts (EN / 中文 / 日本語), email.
- Sponsor block: rose buttons for OpenCollective and GitHub Sponsors, yellow for Afdian.
- Footer: "CC BY-NC-SA 4.0 2021-PRESENT © Anthony Fu".

**Typography and color**
- Inter for body, DM Mono for code, Roboto Condensed for project pills, Bad Script handwriting font.
- Light: greys (#555 body, #222 deep, #888 light) on pure white. Dark: #bbb on #050505. Three tiers of grey for hierarchy, no accent color.

**Dark mode toggle:** View Transitions API. A circular clip-path reveal expands from the click point; falls back to an instant switch under prefers-reduced-motion.

**Entrance animation:** every child of the content block fades in and slides up ~10px over 1s, staggered ~90ms per element via a CSS custom property (`--enter-stage`). This is the signature feel of the site.

**Background art:** Blog, Notes and Podcasts pages draw a slow-growing fractal of thin branching lines ("plum") on a canvas behind the text, faint enough not to compete with reading.

**Subpages**
- Blog: posts grouped by year, each with date, reading time, language tag, event tag.
- Projects: 15 categories ("Current Focus", Nuxt, Vite, Vue, DevTools, …), each item a title plus one-line description linking to its repo, table of contents at the end.

**Takeaway:** staggered fade-up entrance, inline project pills, and the circular dark-mode reveal are all cheap to replicate in React.

---

## 2. dalelarroder.com — Dale Larroder

**Who:** software engineer at Aphex. The site calls itself "my playground on the web."

**Stack:** Next.js App Router with Turbopack, Tailwind CSS v4, MDX for posts, TypeScript, Bun, Biome, Husky, deployed on Vercel, self-hosted Umami analytics. Open source on GitHub (MIT). This is v2; v1 lives at v1.dalelarroder.com.

**Layout**
- Single full-viewport hero, no header bar. Dark-mode toggle floats top-right.
- Text block sits ~40% down the page on desktop.
- Heading: "Welcome to my personal portfolio — or, as I like to call it, my playground on the web." with "personal portfolio" bold and "playground" italic with a pink underline.
- Short bio paragraph ending "Right now, I'm building cool things at Aphex."
- "More about me:" row: icon buttons for LinkedIn, GitHub, X, email; thin vertical divider; path-style text links `/projects /thoughts /uses /stats`.

**Fonts and color:** Merriweather serif for the hero, Mukta sans elsewhere. White/black backgrounds by theme, Tailwind greys, one accent: hot pink `#de1d8d`.

**Magic underline:** the Aphex link has a pink gradient underline (0.2em). On hover it grows to fill the whole text background and the text turns white, 0.3s transition.

**Fluid background:** full-screen `<canvas id="fluid">` runs a WebGL fluid simulation (sim res 128, dye res 800, density dissipation 3.5, velocity dissipation 2, curl 3, splat radius 0.2, splat force 6000, transparent, shading on). Pointer movement injects colored dye that swirls and dissipates. Links carry `data-skip-splash-cursor` so clicks stay clean.

**Theme toggle:** View Transitions with a circle expanding from the top-right corner (`circle-top-right` keyframe, `html { view-transition-name: theme }`). The icon scales down and spins a full turn on click.

**Subpages** (each has only a "Home" link at top)
- /projects: "Here are some of my selected projects worth sharing" — vertical list of card links with title + role: Aphex Planner, Aphex Field, Aphex Publication (Fullstack), Spoken (Fullstack), Topography Health (Backend), SRI Big Data (Frontend), Mathgame, Snakegame (Frontend).
- /thoughts: 7 posts with dates and summaries, mostly React and monorepo topics; newest "React Under the Hood" (Feb 2026).
- /uses: editor (Cursor, Tokyo Night), terminal, desktop apps, desk hardware, four mechanical keyboards. "Inspired by Wes Bos."
- /stats: "Here are some personal stats that I managed to gather over different APIs." GitHub contribution heatmap, Wakatime totals and averages, Spotify top 5 + live "Now Playing".

**Takeaway:** strong one-screen hero with a single accent color, and a live Stats page driven by APIs. The fluid canvas would compete with the Three.js icosahedron, so pick one.

---

## 3. p5aholic.me — Keita Yamada

**Who:** designer and developer, born 1994 in Osaka. Awwwards Independent of the Year 2020 nominee, two Site of the Day awards.

**Stack:** hand-built, no framework. One static HTML file containing every page as a hidden section, one ~8KB CSS file, one JS bundle with three.js, GSAP (ScrollTrigger, Observer), Alpine.js, custom GLSL. Code is private and he does not allow reuse; a "Copycats" page lists seven sites that copied his source.

**Intro screen:** full-screen overlay with "Keita Yamada" (regular weight) next to "Portfolio" (thin weight), then fades out.

**Layout**
- Viewport is fixed, scroll is custom. A padding value `--pad: max(20px, 4vmin)` insets everything.
- WebGL canvas drawn inside that inset with a 1px white frame around it. Top and bottom masks in the background color fade content as it scrolls out.
- All text uses `mix-blend-mode: difference`, so it inverts against the shader beneath it.

**Header:** fixed top-left. "Keita Yamada" thin weight at 60px on large screens, "Designer & Developer" beneath, then a vertical nav: Home, Projects, Info, Contact, FAQ, Copycats. Active item hides its label and shows a dot. Hover drops opacity to 25%.

**Theme switcher:** bottom-left, rotated 90° to read upward: LIGHT / DARK / MONOSPACED with □/■ glyphs as checkboxes. Monospaced swaps the whole site to a mono typeface. Default follows OS color scheme. Light: `hsl(0,0%,90%)` bg / `hsl(0,0%,10%)` text. Dark: `hsl(0,0%,5%)` / `hsl(0,0%,95%)`. Background crossfades over 0.9s.

**Typography:** PP Neue Montreal and PP Neue Montreal Mono (Thin 200, Book 400, SemiBold 600). Base font size only 12px, which makes the huge project titles feel even larger.

**Projects page**
- Right-aligned list of 30 projects, March 2020 → April 2026.
- Each title at 60px thin weight (6.5vw on mobile) with cap-height trimming (`text-box: trim-both cap alphabetic`), linking to the live site.
- Under each: "April.2026 / Dev / Design: PUNCH" or "Design & Dev", collaborator names link to X profiles. Frequent collaborators: Hiroaki Nakano, PUNCH. Clients include COACH, MUSINSA, pixiv VISIONS, BNN.

**Other pages**
- Home: three-sentence bio bottom-right.
- Info: three positioned blocks — social links with ↗ arrows, two experiment subdomains, awards.
- Contact: a single Japanese link about commissions.
- FAQ: right-aligned Q&A. Background is three.js + GLSL; recommends The Book of Shaders, three.js journey, Codrops; libraries GSAP, three.js, Tweakpane, Alpine.

**Background shader**
- Full-screen plane under an orthographic camera, several render targets for feedback.
- Domain-warped 2D simplex noise (Inigo Quilez "pattern" technique: two nested warp passes), time drifting the coordinates slowly in two directions.
- Mixes in a tiled grain texture and a blurred capture of the page content (its alpha), so the field reacts to where text sits. Grain value → angle → displacement vector.
- Monospaced mode sets a `style` uniform that quantizes UVs into a 50×50 grid for a blocky pixel look.
- Theme switch writes CSS custom properties and tells the WebGL app to recolor; font toggle adds `body.is-monospaced` and sends a style change to the shader.

**Takeaway:** framed canvas, blend-mode text, tiny base font with giant thin titles, rotated theme switcher. The Projects list format is directly reusable.

---

## 4. undefined-shin.com — Seungyun Shin

**Who:** Seungyun Shin, Republic of Korea. AI developer at Chorock Soft (Seoul) since July 2019; sports-industry degree from Hankuk University of Foreign Studies; past marketing work in Manhattan; Asian Games work in Jakarta/Palembang. Brand "UNDEFINED": "'Undefined' refers to express my 'belief' and 'attitude' not to set limit for myself." Banner subtitle "- UNDEFINED CREATOR -".

**Stack:** Create React App (2021 era) with hash routing (hence `#/`), Redux, axios, react-bootstrap, styled-components, three.js (OrbitControls, GLTF loader, post-processing), GSAP ScrollTrigger, a typewriter lib, PayPal checkout, Font Awesome CDN, Roboto + custom "Romelio Sans". Images on an S3 bucket in Seoul (~1,800 files). MongoDB/Express backend with JWT login and admin screens. The shop is a MERN e-commerce tutorial fused with a 3D portfolio.

**Visual language**
- Pure black background, white text, scrollbars hidden, body hidden until assets load.
- Landing: 3D planet with glowing points for cities. Guide text "Click the Points or Planet" pulses in the display font above an animated mouse-scroll icon. Clicking a point shows the place name in large bold type with a springy transition.
- Other pages mount fixed full-screen three.js canvases (back, papaya, vibrant, digital screen, particle, sun). Assets: a GLB scene, a tunnel video, a particle texture.

**Sections**
- Main screen.
- About Me: dated timeline 2013 → present (university, military duty, Manhattan marketing, Asian Games, current AI team), "FRAME WORK - Skills" and "TOOLS - Skills" blocks (TensorFlow, PyTorch, Transformers, YOLOv4, OpenCV, Django, AWS Elastic Beanstalk, …).
- Certificate: Stanford and Michigan Coursera certificates, three patents.
- Work (WEB / ART / ETC screens, ~20 detail pages): crypto price prediction, recruitment recommendation, train demand forecasting (LSTM), real estate sentiment (BERT), posture analysis, tourist attraction recommender, facial mask/age detection, pictograms for the visually impaired, salary prediction research paper.
- ART: shader pieces "Deep Particle Drawing", "Infinite Cave Kernel", "Solar Athena Noise", "Unpredictable Beneficial Virus", "Path and Journey", "Francis Face Model", "Alien Richard Mattka", tagged THREE.JS / GLSL / NOISE / WEBGL.
- Memory: travel photo gallery grouped by city across Indonesia, the US, Europe and South America.
- Record: Korean-language sports-industry blog (Barclays Center, VAR, player salary regressions, e-sports).
- Shop: full store — product pages, cart, login/register, shipping, PayPal payment, order history, profile, admin lists for users/products/orders/records.

**Rough edges:** default CRA description meta never changed, viewport disables zooming, JS payload over 4MB before images, barely indexed by search engines.

**Takeaway:** the planet-with-points landing and the ART gallery of shader experiments are the inspiring parts. Also a cautionary example of bundle size and of mixing a shop into a portfolio.

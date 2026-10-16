/*
 * Visual + behaviour check. Builds the site, serves dist/ with `vite preview`, screenshots every
 * page in light / dark / monospaced and at phone + tablet sizes, clicks through the nav and the
 * theme switch, and prints a JSON summary as the last line of stdout.
 *
 * One-time setup (Playwright is not a project dependency on purpose; it is large):
 *   npm install --no-save playwright && npx playwright install chromium
 * Run:
 *   node scripts/screenshots.js            → screenshots/latest/*.png
 *   node scripts/screenshots.js round3     → screenshots/round3/*.png
 *   NO_SPAWN=1 node scripts/screenshots.js → use an already running `vite preview --port 4175`
 */
import path from 'path';
import fs from 'fs';
import { spawn, execSync } from 'child_process';
import { fileURLToPath } from 'url';

// package.json sets "type": "module", so this file is an ES module (import, not require).
let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('playwright is not installed. Run: npm install --no-save playwright && npx playwright install chromium');
  process.exit(2);
}

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(REPO, 'screenshots', process.argv[2] || 'latest');
const PORT = 4175;
const BASE = `http://localhost:${PORT}/website-portfolio/`;
const PAGES = ['home', 'projects', 'experience', 'info', 'contact'];
const hashFor = (p) => (p === 'home' ? '#/' : `#/${p}`);
const QUICK_LINKS_LABEL = JSON.parse(fs.readFileSync(path.join(REPO, 'src/content/content.json'), 'utf8')).site.labels.quickLinks;

fs.mkdirSync(OUT, { recursive: true });

function build() {
  try {
    const log = execSync('npx vite build', { cwd: REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { ok: true, log: log.split('\n').slice(-6).join('\n') };
  } catch (e) {
    return { ok: false, log: String(e.stdout || '') + String(e.stderr || '') };
  }
}

function startPreview() {
  return spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: REPO, shell: true, stdio: 'ignore', windowsHide: true,
  });
}

function killTree(pid) {
  try {
    if (process.platform === 'win32') execSync(`taskkill /PID ${pid} /T /F`, { stdio: 'ignore' });
    else process.kill(pid, 'SIGTERM');
  } catch { /* already gone */ }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const summary = { build: null, shots: [], console: [], checks: {} };
  const external = Boolean(process.env.NO_SPAWN);
  summary.build = external ? { ok: true, log: 'external' } : build();
  if (!summary.build.ok) { console.log(JSON.stringify(summary)); process.exit(1); }

  const preview = external ? null : startPreview();
  const browser = await chromium.launch();
  try {
    // One fresh browser context per screenshot so stored theme/font never leak between shots.
    async function newPage({ theme = 'light', font = 'sans', viewport = { width: 1440, height: 900 }, extra = {} } = {}) {
      const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, ...extra });
      await ctx.addInitScript(({ theme, font }) => {
        try {
          localStorage.setItem('portfolio-theme', theme);
          localStorage.setItem('portfolio-font', font);
        } catch (e) { /* about:blank has no storage; the real navigation does */ }
      }, { theme, font });
      const page = await ctx.newPage();
      page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) summary.console.push(`${m.type()}: ${m.text()}`); });
      page.on('pageerror', (e) => summary.console.push(`pageerror: ${e.message}`));
      return { ctx, page };
    }

    {
      const { ctx, page } = await newPage();
      let up = false;
      for (let i = 0; i < 40 && !up; i++) {
        try { const res = await page.goto(BASE, { waitUntil: 'load', timeout: 3000 }); up = Boolean(res && res.ok()); } catch { /* retry */ }
        if (!up) await sleep(500);
      }
      await ctx.close();
      if (!up) throw new Error('preview server did not start');
    }

    async function shot(name, { theme = 'light', font = 'sans', hash = '#/', viewport, scroll = 0 } = {}) {
      const { ctx, page } = await newPage({ theme, font, viewport });
      await page.goto(BASE + hash, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2600); // let the enter overlay finish and the first frames render
      if (scroll) {
        await page.evaluate((y) => document.querySelector('main [tabindex="-1"]').scrollBy(0, y), scroll);
        await page.waitForTimeout(100);
      }
      const file = path.join(OUT, `${name}.png`);
      await page.screenshot({ path: file });
      summary.shots.push(file);
      await ctx.close();
    }

    for (const p of PAGES) await shot(`${p}-light`, { hash: hashFor(p) });
    for (const p of ['home', 'projects', 'info']) await shot(`${p}-dark`, { theme: 'dark', hash: hashFor(p) });
    await shot('home-mono', { font: 'mono' });
    await shot('projects-mono-dark', { theme: 'dark', font: 'mono', hash: '#/projects' });
    await shot('home-mobile', { viewport: { width: 390, height: 844 } });
    await shot('projects-mobile', { viewport: { width: 390, height: 844 }, hash: '#/projects' });
    await shot('info-mobile', { viewport: { width: 390, height: 844 }, hash: '#/info' });
    await shot('home-tablet', { viewport: { width: 820, height: 1180 } });
    await shot('info-laptop', { viewport: { width: 1280, height: 720 }, hash: '#/info' });
    await shot('projects-scrolled', { hash: '#/projects', scroll: 240 });
    await shot('projects-mobile-scrolled', { viewport: { width: 390, height: 844 }, hash: '#/projects', scroll: 240 });

    // Behaviour checks at desktop size, light theme, in a fresh context
    const { page } = await newPage();
    await page.goto(BASE + '#/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2600);
    summary.checks.canvasCount = await page.locator('canvas').count();
    summary.checks.overlayGone = (await page.locator('text=Portfolio').count()) === 0;
    summary.checks.activeIsDot = await page.evaluate(() => {
      const cur = document.querySelector('nav a[aria-current="page"]');
      return cur ? getComputedStyle(cur).opacity : 'no aria-current';
    });
    await page.locator('nav a', { hasText: 'Projects' }).first().click();
    await page.waitForTimeout(900);
    summary.checks.hashAfterClick = await page.evaluate(() => location.hash);
    summary.checks.projectsRendered = await page.locator('h2').count();
    await page.screenshot({ path: path.join(OUT, 'after-click-projects.png') });
    await page.locator('button', { hasText: /dark/i }).first().click();
    await page.waitForTimeout(1200);
    summary.checks.themeAfterDarkClick = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    summary.checks.themePersisted = await page.evaluate(() => localStorage.getItem('portfolio-theme'));
    await page.locator('button', { hasText: /mono/i }).first().click();
    await page.waitForTimeout(600);
    summary.checks.fontAfterMonoClick = await page.evaluate(() => document.documentElement.getAttribute('data-font'));
    await page.screenshot({ path: path.join(OUT, 'after-dark-mono.png') });
    await page.goto(BASE + '#/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2600);
    for (let i = 0; i < 4; i++) await page.keyboard.press('Tab');
    summary.checks.focusedAfterTabs = await page.evaluate(() => {
      const a = document.activeElement;
      return a ? `${a.tagName} ${a.textContent.trim().slice(0, 20)}` : 'none';
    });
    await page.goto(BASE + '#/projects', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2600);
    summary.checks.bodyScrollable = await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight);
    summary.checks.innerScrollable = await page.evaluate(() => {
      const els = [...document.querySelectorAll('div')].filter((d) => getComputedStyle(d).overflowY === 'auto');
      return els.some((d) => d.scrollHeight - d.clientHeight > 0);
    });
    {
      const { ctx, page: sp } = await newPage({ theme: 'dark', font: 'mono' });
      await sp.goto(BASE + '#/', { waitUntil: 'networkidle' });
      await sp.waitForTimeout(1500);
      summary.checks.storedThemeApplied = await sp.evaluate(() => document.documentElement.getAttribute('data-theme'));
      summary.checks.storedFontApplied = await sp.evaluate(() => document.documentElement.getAttribute('data-font'));
      await ctx.close();
    }
    {
      const { ctx, page: rp } = await newPage({ extra: { reducedMotion: 'reduce' } });
      await rp.goto(BASE + '#/', { waitUntil: 'networkidle' });
      await rp.waitForTimeout(1500);
      summary.checks.reducedMotionCanvas = await rp.locator('canvas').count();
      await rp.screenshot({ path: path.join(OUT, 'home-reduced-motion.png') });
      await ctx.close();
    }
    // Quick links: attributes once, then on every page at three sizes list any page text whose
    // box overlaps the corner icons at load (scrolled overlap is expected and not counted).
    {
      const { ctx, page: qp } = await newPage();
      await qp.goto(BASE + '#/', { waitUntil: 'networkidle' });
      await qp.waitForTimeout(2600);
      summary.checks.quickLinks = await qp.evaluate((label) => [...document.querySelectorAll(`ul[aria-label="${label}"] a`)]
        .map((a) => `${a.getAttribute('aria-label')} ${a.href} target=${a.target} rel=${a.rel}`), QUICK_LINKS_LABEL);
      await ctx.close();
    }
    summary.checks.quickLinksOverlap = {};
    for (const viewport of [{ width: 1440, height: 900 }, { width: 1280, height: 720 }, { width: 390, height: 844 }]) {
      const { ctx, page: qp } = await newPage({ viewport });
      await qp.goto(BASE + '#/', { waitUntil: 'networkidle' });
      await qp.waitForTimeout(2600);
      for (const p of PAGES) {
        await qp.evaluate((h) => { location.hash = h; }, hashFor(p));
        await qp.waitForTimeout(900);
        const hits = await qp.evaluate((label) => {
          const list = document.querySelector(`ul[aria-label="${label}"]`);
          if (!list) return ['missing'];
          const r = list.getBoundingClientRect();
          return [...document.querySelectorAll('main a, main h2, main p, main li, main dt, main dd')]
            .filter((el) => {
              const b = el.getBoundingClientRect();
              return b.width && b.height && b.left < r.right && b.right > r.left && b.top < r.bottom && b.bottom > r.top;
            })
            .map((el) => el.textContent.trim().slice(0, 30));
        }, QUICK_LINKS_LABEL);
        summary.checks.quickLinksOverlap[`${viewport.width}x${viewport.height} ${p}`] = hits.length ? hits : 'clear';
      }
      await ctx.close();
    }
  } catch (e) {
    summary.error = String((e && e.stack) || e);
  } finally {
    await browser.close();
    if (preview) killTree(preview.pid);
  }
  console.log(JSON.stringify(summary));
})();

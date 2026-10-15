import * as THREE from 'three';

/**
 * NoiseBackground: a grainy, slowly drifting blob drawn with one full-screen shader.
 *
 * How it works, in plain language
 * --------------------------------
 * 1. Three.js draws a single rectangle that covers the whole canvas. Nothing is "3D": the
 *    camera and the plane exist only so Three can hand our fragment shader every pixel.
 * 2. For each pixel the fragment shader computes a DENSITY between 0 and 1: how likely a dot
 *    should land there. The density is a big soft disc (its edge feathered, with a denser band
 *    just inside the rim so an arc reads across the frame), multiplied by low-frequency noise
 *    so it looks cloudy instead of flat. The disc's centre and edge drift very slowly over time
 *    (one lap takes about 75 s), so the picture breathes without ever looking like it "plays".
 * 3. Instead of painting the density as a smooth grey, each pixel rolls a random number and a
 *    dot is painted only when the roll is below the density. Thousands of tiny yes/no decisions
 *    produce stippled grain, like film or a risograph print. The random seed changes about 12
 *    times a second, so the grain shimmers subtly rather than crawling every frame.
 * 4. The dot colour is dark grey in light mode and light grey in dark mode; everything else
 *    stays transparent so the CSS `bg-surface` shows through and the theme fade still works.
 * 5. The "mono" style snaps the sampling coordinates to a 50x50 grid before the density is
 *    computed, which turns the soft shape into blocky tiles. The grain itself stays per-pixel.
 *
 * All noise and hash functions below are written by hand; nothing is imported.
 * The class exposes the same lifecycle as IcosahedronBackground:
 * init / setTheme / setStyle / start / stop / dispose.
 */

const VERTEX_SHADER = /* glsl */ `
  void main() {
    // The 2x2 plane already spans clip space (-1..1), so no camera math is needed.
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;        // seconds since init
  uniform vec2  uResolution;  // drawing-buffer size in device pixels
  uniform float uDark;        // 0 = light theme, 1 = dark theme
  uniform float uStyle;       // 0 = smooth field, 1 = quantized (mono) field
  uniform float uSeed;        // per-instance offset so reloads differ
  uniform float uGrain;       // grain cell size in device pixels (1.0 to 1.5)

  // Density tuning. The reference reads as a sparse grey stipple that text stays legible
  // over; at 0.55 coverage with near-opaque dots the band turned solid at 1x pixel ratio.
  const float MAX_COVERAGE = 0.32;  // share of pixels painted at the densest spot (the rim)
  const float ALPHA_MIN = 0.35;     // dot opacity where the field is thinnest...
  const float ALPHA_MAX = 0.60;     // ...and at the densest spot (grey, never solid)
  const float DRIFT_PERIOD = 75.0;  // seconds for one full drift cycle
  const float SHIMMER_RATE = 12.0;  // grain reseeds per second

  // Hash: scramble a 2D coordinate into a pseudo-random number in [0, 1).
  // Inputs are first scaled down so large pixel coordinates keep their float precision.
  float hash21(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
  }

  // Same idea for a 3D coordinate (pixel cell + frame seed).
  float hash31(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.zyx + 31.32);
    return fract((p.x + p.y) * p.z);
  }

  // Value noise: random values at integer corners, smoothly blended in between.
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f); // smooth curve so the blend has no visible seams
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  // Fractal Brownian motion: three layers of value noise, each finer and fainter.
  float fbm(vec2 p) {
    float sum = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 3; i++) {
      sum += amp * vnoise(p);
      p = p * 2.03 + vec2(17.0, 9.0);
      amp *= 0.5;
    }
    return sum / 0.875; // normalise to roughly [0, 1]
  }

  void main() {
    vec2 res = uResolution;
    float shortSide = min(res.x, res.y);

    // Normalised position in the frame, 0..1 on both axes (y = 0 at the bottom).
    vec2 uv = gl_FragCoord.xy / res;
    if (uStyle > 0.5) {
      uv = floor(uv * 50.0) / 50.0; // mono style: sample the field on a 50x50 grid
    }

    // Aspect-correct position: origin at the frame centre, shorter side spans -0.5..0.5.
    // Working in these units keeps the disc round at any window size.
    vec2 p = (uv - 0.5) * res / shortSide;

    // Blob centre as frame fractions (x from the left, y from the top), nudged in a slow loop.
    float w = 6.28318 / DRIFT_PERIOD;
    vec2 centreFrac = vec2(0.75, 0.30) + 0.06 * vec2(cos(uTime * w), sin(uTime * w * 0.7));
    vec2 centre = (vec2(centreFrac.x, 1.0 - centreFrac.y) - 0.5) * res / shortSide;

    // Radius relative to the shorter side. Portrait screens get a larger disc so an arc
    // still sweeps across the narrow frame instead of sitting as a small circle.
    float portrait = smoothstep(1.0, 0.5, res.x / res.y);
    float radius = 0.62 * mix(1.0, 1.45, portrait);

    // Distance from the centre, with the edge pushed in and out by slow-moving noise.
    vec2 drift = vec2(uTime * 0.012, -uTime * 0.009);
    float edgeWarp = fbm(p * 1.6 + drift + uSeed) - 0.5;
    float r = (length(p - centre) + edgeWarp * 0.18 * radius) / radius;

    // Shape: a filled disc, feathered to nothing over the outer 28% of the radius...
    float body = 1.0 - smoothstep(0.72, 1.0, r);
    // ...with a gentle band near the rim so the edge reads as an arc. (Squared by hand:
    // GLSL's pow() is undefined for a negative base, and r - 0.84 is negative inside.)
    float rimT = (r - 0.84) / 0.18;
    float rimBand = exp(-rimT * rimT);
    // Cloudy variation across the disc.
    float mottle = fbm(p * 3.0 + vec2(-uTime * 0.008, uTime * 0.011) + uSeed * 1.7);

    // Interior stays light (about 0.45 of the rim) so text over the mist remains readable.
    float density = body * (0.55 + 0.45 * rimBand) * mix(0.55, 1.0, mottle);
    density = clamp(density, 0.0, 1.0);

    // Stipple: one random roll per grain cell; the seed steps a few times a second.
    vec2 cell = floor(gl_FragCoord.xy / uGrain);
    float frameSeed = mod(floor(uTime * SHIMMER_RATE), 4096.0) + uSeed;
    float roll = hash31(vec3(cell, frameSeed));
    float painted = step(roll, density * MAX_COVERAGE);

    // Dots fade with density so sparse areas feel soft rather than speckled.
    float alpha = painted * mix(ALPHA_MIN, ALPHA_MAX, density);
    vec3 rgb = mix(vec3(0.15), vec3(0.85), uDark); // dark grey dots on light, light grey on dark
    gl_FragColor = vec4(rgb, alpha);
  }
`;

class NoiseBackground {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.resizeObserver = null;
    this.rafId = 0;
    this.initialized = false;
    this.disposed = false;
    this.startTime = 0;
    this.isDark = false;
    this.isMono = false;
    this.seed = Math.random() * 100;
    this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Bind once so dispose() can remove the exact same listener references.
    this.handleResize = this.handleResize.bind(this);
    this.handleMotionChange = this.handleMotionChange.bind(this);
    this.animate = this.animate.bind(this);
  }

  init() {
    if (this.initialized || !this.container) return;
    this.initialized = true;
    this.disposed = false;

    try {
      // No antialiasing: a full-screen quad has no edges to smooth, and the grain is meant to be crisp.
      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
    } catch {
      this.renderer = null; // No WebGL: the frame still renders, just without the grain.
      return;
    }
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.autoClear = true;
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.geometry = new THREE.PlaneGeometry(2, 2);
    this.material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uDark: { value: this.isDark ? 1 : 0 },
        uStyle: { value: this.isMono ? 1 : 0 },
        uSeed: { value: this.seed },
        uGrain: { value: pixelRatio }, // one grain cell per CSS pixel
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.frustumCulled = false;
    this.scene.add(this.mesh);

    this.startTime = performance.now();
    this.handleResize();
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(this.handleResize);
      this.resizeObserver.observe(this.container);
    } else {
      window.addEventListener('resize', this.handleResize);
    }
    this.motionQuery.addEventListener('change', this.handleMotionChange);

    this.renderFrame(); // Always draw one frame, even when motion is reduced.
    this.start();
  }

  setTheme(isDark) {
    this.isDark = Boolean(isDark);
    if (!this.material) return;
    this.material.uniforms.uDark.value = this.isDark ? 1 : 0;
    if (!this.rafId) this.renderFrame();
  }

  setStyle(isMono) {
    this.isMono = Boolean(isMono);
    if (!this.material) return;
    this.material.uniforms.uStyle.value = this.isMono ? 1 : 0;
    if (!this.rafId) this.renderFrame();
  }

  handleResize() {
    if (!this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (!width || !height) return;
    this.renderer.setSize(width, height, false); // CSS owns the canvas box
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    this.material.uniforms.uResolution.value.copy(size);
    if (!this.rafId) this.renderFrame();
  }

  handleMotionChange() {
    if (this.motionQuery.matches) this.stop();
    else this.start();
  }

  renderFrame() {
    if (!this.renderer) return;
    this.material.uniforms.uTime.value = (performance.now() - this.startTime) / 1000;
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    if (this.rafId || this.disposed || !this.renderer || this.motionQuery.matches) return;
    this.rafId = requestAnimationFrame(this.animate);
  }

  stop() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  animate() {
    this.rafId = requestAnimationFrame(this.animate);
    this.renderFrame();
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.initialized = false;
    this.stop();

    if (this.resizeObserver) this.resizeObserver.disconnect();
    window.removeEventListener('resize', this.handleResize);
    this.motionQuery.removeEventListener('change', this.handleMotionChange);

    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      const canvas = this.renderer.domElement;
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.resizeObserver = null;
  }
}

export default NoiseBackground;

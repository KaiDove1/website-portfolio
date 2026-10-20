import NoiseBackground, { NOISE_GLSL } from './NoiseBackground.js';

/**
 * GlitchBackground: an abstract mass of horizontal bars that tears, splits into RGB and
 * corrupts in short bursts, drawn with one full-screen shader.
 *
 * How it works, in plain language
 * --------------------------------
 * 1. The frame is cut into thin rows (ROW_HEIGHT CSS px). Each row is a bar or a gap. A bar's
 *    length comes from a round envelope (long in the middle, short at the top and bottom),
 *    stretched and nudged sideways by slow noise, so the rows together read as a soft orb
 *    built from scanlines that slowly reshapes. Noise along each bar breaks it into segments.
 * 2. Time is cut into slots (SLOT_RATE per second). A hash of the slot decides whether it is a
 *    BURST (about BURST_CHANCE of slots). During a burst:
 *      - groups of rows are torn sideways by random amounts,
 *      - the red and blue channels are sampled further apart (chromatic split),
 *      - a few rectangular blocks on a coarse grid flash in as scanlined slabs.
 *    Outside bursts the picture is calm apart from a small constant RGB split.
 * 3. A soft distortion band rolls down the frame every ROLL_PERIOD seconds and wobbles the
 *    rows it passes, like a bad VHS tracking line. A sparse speckle reseeds 12 times a second.
 * 4. Everything is drawn at most MAX_ALPHA strong so the difference-blended text on top keeps
 *    its contrast. Colours are the theme's ink over its surface, per channel, so the
 *    split edges come out as faint red and cyan fringes and the rest stays grey.
 * 5. The "mono" style snaps bar ends to a coarse column grid and turns the colour split off.
 *
 * Lifecycle, resizing, theme/style uniforms and disposal come from NoiseBackground; this
 * class only supplies the fragment shader.
 */

const FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;        // seconds since init
  uniform vec2  uResolution;  // drawing-buffer size in device pixels
  uniform float uDark;        // 0 = light theme, 1 = dark theme
  uniform float uStyle;       // 0 = normal, 1 = mono (blocky, no colour split)
  uniform float uSeed;        // per-instance offset so reloads differ
  uniform float uGrain;       // device pixels per CSS pixel (1.0 to 1.5)

  const float MAX_ALPHA = 0.30;      // strongest ink coverage; keeps text over it legible
  const float ROW_HEIGHT = 6.0;      // CSS px per row (bar + gap)
  const float BAR_FILL = 0.5;        // share of each row that is bar
  const float DRIFT_PERIOD = 60.0;   // seconds for the orb's slow loop
  const float SLOT_RATE = 10.0;      // glitch decisions per second
  const float BURST_CHANCE = 0.14;   // share of slots that glitch
  const float ROLL_PERIOD = 9.0;     // seconds for the tracking band to cross the frame
  const float SPLIT_BASE = 0.003;    // constant RGB offset, in short-side units
  const float SPLIT_BURST = 0.03;    // extra RGB offset during a burst (at most)
  const float BLOCK_GRID = 10.0;     // corruption cells per short side (square cells)
  const float BLOCK_CHANCE = 0.035;  // share of grid cells that flash during a burst
  const float SPECK_CHANCE = 0.012;  // share of pixels speckled each shimmer step
  const float SHIMMER_RATE = 12.0;   // speckle reseeds per second

  // Surface and ink greys of app.css (hsl 90% / 10% light, 5% / 95% dark); WebGL cannot
  // read CSS variables, so they are mirrored here.
  const vec2 SURFACE = vec2(0.90, 0.05);
  const vec2 INK = vec2(0.10, 0.95);

${NOISE_GLSL}
  // Coverage (0..1) of row k, whose centre sits at height yk, at horizontal position x.
  // All positions are in aspect units: origin at the frame centre, short side = 1.
  float bars(float k, float yk, float x, float t, vec2 centre, float radius) {
    float dy = yk - centre.y;
    float halfWidth = sqrt(max(radius * radius - dy * dy, 0.0));
    float stretch = vnoise(vec2(k * 0.31 + uSeed, t * 0.22));
    float sway = vnoise(vec2(k * 0.17 - uSeed, t * 0.15 + 9.0)) - 0.5;
    halfWidth *= mix(0.35, 1.2, stretch);
    float cx = centre.x + sway * 0.3 * radius;
    float inside = step(abs(x - cx), halfWidth);
    float segment = step(0.28, vnoise(vec2(x * 14.0 + k * 3.1, t * 0.4)));
    float shade = mix(0.45, 1.0, hash21(vec2(k, 3.0 + uSeed)));
    return inside * segment * shade;
  }

  void main() {
    vec2 res = uResolution;
    float shortSide = min(res.x, res.y);
    vec2 uv = gl_FragCoord.xy / res;
    float t = uTime;

    // Which row this pixel is in, whether it is on the bar part, and the row's centre height.
    float rowPx = ROW_HEIGHT * uGrain;
    float k = floor(gl_FragCoord.y / rowPx);
    float onBar = step(fract(gl_FragCoord.y / rowPx), BAR_FILL);
    float yk = ((k + 0.5) * rowPx / res.y - 0.5) * res.y / shortSide;
    float x = (uv.x - 0.5) * res.x / shortSide;

    // The orb: centre as frame fractions (x from the left, y from the top) on a slow loop.
    // Portrait screens centre it and make it a little larger.
    float portrait = smoothstep(1.0, 0.5, res.x / res.y);
    float w = 6.28318 / DRIFT_PERIOD;
    vec2 centreFrac = vec2(mix(0.40, 0.50, portrait), 0.52) + 0.05 * vec2(cos(t * w), sin(t * w * 0.7));
    vec2 centre = (vec2(centreFrac.x, 1.0 - centreFrac.y) - 0.5) * res / shortSide;
    float radius = 0.36 * mix(1.0, 1.3, portrait);

    // Glitch clock: one random decision per slot.
    float slot = floor(t * SLOT_RATE);
    float burst = step(1.0 - BURST_CHANCE, hash21(vec2(slot, uSeed)));

    // Tear: rows are grouped into bands of 2-8; some bands slide sideways during a burst.
    float bandSize = 2.0 + floor(hash21(vec2(slot, 5.0)) * 7.0);
    float band = floor(k / bandSize);
    float tear = step(0.62, hash21(vec2(band, slot + 13.0)));
    x += (hash21(vec2(band, slot + 29.0)) - 0.5) * 0.4 * radius * burst * tear;

    // Tracking band: a soft stripe rolling down the frame that wobbles the rows it covers.
    // (Squared by hand: pow() is undefined for a negative base.)
    float rollT = (uv.y - (1.0 - fract(t / ROLL_PERIOD))) / 0.025;
    x += exp(-rollT * rollT) * 0.03 * sin(k * 1.7 + t * 30.0);

    if (uStyle > 0.5) {
      x = floor(x * 48.0) / 48.0; // mono: bar ends snap to a column grid
    }

    // Chromatic split: red and blue read the bars a little left and right of green.
    float split = (1.0 - step(0.5, uStyle)) * (SPLIT_BASE + burst * hash21(vec2(slot, 41.0)) * SPLIT_BURST);
    vec3 cover = onBar * vec3(
      bars(k, yk, x + split, t, centre, radius),
      bars(k, yk, x, t, centre, radius),
      bars(k, yk, x - split, t, centre, radius)
    );

    // Corrupted blocks: during a burst a few cells of a coarse grid flash as scanlined slabs.
    // Cells are square and sized from the short side, so phones get as few as desktops.
    vec2 cellId = floor((uv - 0.5) * res / shortSide * BLOCK_GRID);
    float block = burst * step(1.0 - BLOCK_CHANCE, hash21(cellId + slot * 1.37 + uSeed));
    float scan = step(fract(gl_FragCoord.y / (2.0 * uGrain)), 0.5);
    cover = max(cover, vec3(block * 0.6 * scan));

    // Speckle: sparse single pixels that reseed a few times a second.
    vec2 grainCell = floor(gl_FragCoord.xy / uGrain);
    float frameSeed = mod(floor(t * SHIMMER_RATE), 4096.0) + uSeed;
    cover = max(cover, vec3(0.5 * step(hash31(vec3(grainCell, frameSeed)), SPECK_CHANCE)));

    // Per-channel ink over the surface: alpha is the strongest channel and each channel is
    // scaled so that, after normal blending, it lands at surface + (ink - surface) * coverage.
    vec3 d = cover * MAX_ALPHA;
    float a = max(max(d.r, d.g), d.b);
    if (a <= 0.0) {
      gl_FragColor = vec4(0.0);
      return;
    }
    float surface = mix(SURFACE.x, SURFACE.y, uDark);
    float ink = mix(INK.x, INK.y, uDark);
    gl_FragColor = vec4(surface + (ink - surface) * d / a, a);
  }
`;

class GlitchBackground extends NoiseBackground {
  fragmentShader() {
    return FRAGMENT_SHADER;
  }
}

export default GlitchBackground;

import * as THREE from 'three';

const THEME = {
  light: { color: 0x666666, opacity: 0.15 },
  dark: { color: 0xcccccc, opacity: 0.1 },
};

/**
 * Rotating icosahedron wireframe rendered into a container element.
 * Sizes itself to the container (not the window), so it fits the hero's inner frame.
 */
class Background {
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
    this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Bind once so dispose() can remove the exact same listener references.
    this.handleResize = this.handleResize.bind(this);
    this.handleMotionChange = this.handleMotionChange.bind(this);
    this.animate = this.animate.bind(this);
  }

  init() {
    if (this.initialized || !this.container) return;
    this.initialized = true;

    try {
      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      this.renderer = null; // No WebGL: the frame still renders, just without the wireframe.
      return;
    }
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.z = 5;

    this.geometry = new THREE.IcosahedronGeometry(2, 1);
    this.material = new THREE.MeshBasicMaterial({
      color: THEME.light.color,
      opacity: THEME.light.opacity,
      wireframe: true,
      transparent: true,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

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
    if (!this.material) return;
    const theme = isDark ? THEME.dark : THEME.light;
    this.material.color.setHex(theme.color);
    this.material.opacity = theme.opacity;
    if (!this.rafId) this.renderFrame();
  }

  handleResize() {
    if (!this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (!width || !height) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false); // CSS owns the canvas box
    if (!this.rafId) this.renderFrame();
  }

  handleMotionChange() {
    if (this.motionQuery.matches) this.stop();
    else this.start();
  }

  renderFrame() {
    if (this.renderer) this.renderer.render(this.scene, this.camera);
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
    this.mesh.rotation.x += 0.001;
    this.mesh.rotation.y += 0.002;
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
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
  }
}

export default Background;

import * as THREE from 'three';

class Background {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.isPlaying = true;
  }

  init() {
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
    
    // Add renderer to DOM
    const container = document.getElementById('bg');
    if (container) {
      container.appendChild(this.renderer.domElement);
    }

    // Create geometry
    this.geometry = new THREE.IcosahedronGeometry(2, 1);
    
    // Create material with theme-appropriate color
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    this.material = new THREE.MeshBasicMaterial({
      color: isDark ? 0xcccccc : 0x666666, // Light grey in dark mode, darker grey in light mode
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.1 : 0.15, // Slightly higher opacity in light mode for better visibility
    });
    
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    // Handle window resize
    window.addEventListener('resize', this.handleResize.bind(this));

    // Handle theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
          this.material.color.setHex(isDark ? 0xcccccc : 0x666666);
          this.material.opacity = isDark ? 0.1 : 0.15;
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    // Start animation
    this.animate();
  }

  handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    if (!this.isPlaying) return;

    requestAnimationFrame(this.animate.bind(this));

    if (this.mesh) {
      this.mesh.rotation.x += 0.001;
      this.mesh.rotation.y += 0.002;
    }

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.isPlaying = false;
    window.removeEventListener('resize', this.handleResize.bind(this));
    
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
    if (this.renderer) this.renderer.dispose();
  }
}

export default Background; 
import * as THREE from 'three';

export class Cyber3DScene {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.targetScroll = 0;
    this.clock = new THREE.Clock();

    this.init();
    this.createBackgroundGrid();
    this.createHeroArtifact();
    this.createFloatingDust();
    this.addEventListeners();
    this.animate();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x070709, 0.0018);

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
    this.camera.position.set(0, 0, 100);

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.container.appendChild(this.renderer.domElement);

    // Ambient & Point lights for dark/grey mood
    const ambientLight = new THREE.AmbientLight(0x22222a, 1.5);
    this.scene.add(ambientLight);

    this.mainLight = new THREE.PointLight(0xa0a5b5, 2.5, 300);
    this.mainLight.position.set(40, 50, 60);
    this.scene.add(this.mainLight);

    this.accentLight = new THREE.PointLight(0x606575, 2, 250);
    this.accentLight.position.set(-50, -40, 40);
    this.scene.add(this.accentLight);
  }

  createBackgroundGrid() {
    // 3D dynamic undulating particle terrain
    const cols = 75;
    const rows = 75;
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const baseColor = new THREE.Color(0x282c37);
    const highlightColor = new THREE.Color(0x8a92a6);

    let idx = 0;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = (i - cols / 2) * 16;
        const z = (j - rows / 2) * 16;
        const y = Math.sin(i * 0.2) * Math.cos(j * 0.2) * 8 - 40;

        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;

        const mixRatio = Math.sin((i + j) * 0.1) * 0.5 + 0.5;
        const c = baseColor.clone().lerp(highlightColor, mixRatio * 0.4);
        colors[idx * 3] = c.r;
        colors[idx * 3 + 1] = c.g;
        colors[idx * 3 + 2] = c.b;

        idx++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.terrainParticles = new THREE.Points(geometry, material);
    this.terrainPositions = positions;
    this.terrainCols = cols;
    this.terrainRows = rows;
    this.scene.add(this.terrainParticles);
  }

  createHeroArtifact() {
    this.heroGroup = new THREE.Group();

    // Central Wireframe Holographic Polyhedron (Icosahedron)
    const icoGeo = new THREE.IcosahedronGeometry(22, 1);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x111116,
      roughness: 0.15,
      metalness: 0.9,
      wireframe: false,
      flatShading: true
    });
    this.heroCore = new THREE.Mesh(icoGeo, icoMat);
    this.heroGroup.add(this.heroCore);

    // Glowing wireframe outer cage
    const wireGeo = new THREE.IcosahedronGeometry(24, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x8a94a8,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    this.heroWire = new THREE.Mesh(wireGeo, wireMat);
    this.heroGroup.add(this.heroWire);

    // Concentric Cyber Rings (Gyroscopic 3D Rings)
    const createRing = (radius, tube, color) => {
      const ringGeo = new THREE.TorusGeometry(radius, tube, 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.8,
        roughness: 0.2,
        wireframe: true,
        transparent: true,
        opacity: 0.7
      });
      return new THREE.Mesh(ringGeo, ringMat);
    };

    this.ring1 = createRing(32, 0.4, 0x6e7687);
    this.ring2 = createRing(38, 0.3, 0x474e5d);
    this.ring3 = createRing(44, 0.2, 0x2e3440);

    this.heroGroup.add(this.ring1);
    this.heroGroup.add(this.ring2);
    this.heroGroup.add(this.ring3);

    // Position in hero area
    this.heroGroup.position.set(38, 5, 0);
    this.scene.add(this.heroGroup);
  }

  createFloatingDust() {
    const count = 400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 600;
      positions[i + 1] = (Math.random() - 0.5) * 500;
      positions[i + 2] = (Math.random() - 0.5) * 400;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x9ca3af,
      size: 1.5,
      transparent: true,
      opacity: 0.35
    });

    this.dust = new THREE.Points(geometry, material);
    this.scene.add(this.dust);
  }

  addEventListeners() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('scroll', () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      this.targetScroll = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    }, { passive: true });

    window.addEventListener('resize', () => {
      if (!this.container) return;
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);

      // Adjust hero 3D core position based on viewport
      if (window.innerWidth < 900) {
        this.heroGroup.position.set(0, 15, -20);
        this.heroGroup.scale.set(0.65, 0.65, 0.65);
      } else {
        this.heroGroup.position.set(38, 5, 0);
        this.heroGroup.scale.set(1, 1, 1);
      }
    });

    // Initial check for mobile
    if (window.innerWidth < 900) {
      this.heroGroup.position.set(0, 15, -20);
      this.heroGroup.scale.set(0.65, 0.65, 0.65);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // Smooth cursor interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Smooth scroll interpolation
    this.scrollProgress += (this.targetScroll - this.scrollProgress) * 0.06;

    // Undulating terrain ripple animation
    if (this.terrainParticles) {
      const posAttr = this.terrainParticles.geometry.attributes.position;
      const pos = posAttr.array;
      let idx = 0;
      for (let i = 0; i < this.terrainCols; i++) {
        for (let j = 0; j < this.terrainRows; j++) {
          const wave1 = Math.sin(i * 0.25 + elapsedTime * 1.2) * 5;
          const wave2 = Math.cos(j * 0.25 + elapsedTime * 0.9) * 5;
          const mouseDist = Math.hypot((i - this.terrainCols / 2) - this.mouse.x * 20, (j - this.terrainRows / 2) - this.mouse.y * 20);
          const mouseEffect = Math.max(0, 15 - mouseDist) * 1.2;

          pos[idx * 3 + 1] = -40 + wave1 + wave2 + mouseEffect;
          idx++;
        }
      }
      posAttr.needsUpdate = true;
      this.terrainParticles.rotation.y = elapsedTime * 0.03 + this.mouse.x * 0.1;
    }

    // Floating Dust slow rotation
    if (this.dust) {
      this.dust.rotation.y = elapsedTime * 0.015;
      this.dust.rotation.x = elapsedTime * 0.008;
    }

    // Hero Core Holographic rotation & scroll reactions
    if (this.heroGroup) {
      this.heroCore.rotation.x = elapsedTime * 0.4 + this.mouse.y * 0.4;
      this.heroCore.rotation.y = elapsedTime * 0.5 + this.mouse.x * 0.4;

      this.heroWire.rotation.x = -elapsedTime * 0.3;
      this.heroWire.rotation.y = -elapsedTime * 0.35;

      this.ring1.rotation.x = elapsedTime * 0.6;
      this.ring1.rotation.y = elapsedTime * 0.4;

      this.ring2.rotation.y = -elapsedTime * 0.5;
      this.ring2.rotation.z = elapsedTime * 0.35;

      this.ring3.rotation.x = elapsedTime * 0.3;
      this.ring3.rotation.z = -elapsedTime * 0.5;

      // 3D parallax on hero element
      const targetHeroY = (window.innerWidth < 900 ? 15 : 5) - this.scrollProgress * 80;
      const targetHeroZ = -this.scrollProgress * 120;
      this.heroGroup.position.y += (targetHeroY - this.heroGroup.position.y) * 0.08;
      this.heroGroup.position.z += (targetHeroZ - this.heroGroup.position.z) * 0.08;
    }

    // 3D Camera scroll fly-through depth effect
    this.camera.position.z = 100 - this.scrollProgress * 45;
    this.camera.position.y = this.mouse.y * 6 - this.scrollProgress * 25;
    this.camera.position.x = this.mouse.x * 8;
    this.camera.lookAt(0, -this.scrollProgress * 20, 0);

    // Light tracking mouse
    if (this.mainLight) {
      this.mainLight.position.x = 40 + this.mouse.x * 30;
      this.mainLight.position.y = 50 + this.mouse.y * 30;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

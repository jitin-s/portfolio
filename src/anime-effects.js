// Japanese Anime Animation Engine: Lightning Arcs, Katana Spark Slashes, Anime Action Cut-Ins & Speedlines
export class AnimeEffectsEngine {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'anime-fx-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '4';
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.width = (this.canvas.width = window.innerWidth);
    this.height = (this.canvas.height = window.innerHeight);

    // States
    this.auraAwakened = false;
    this.petals = [];
    this.lightningBolts = [];
    this.slashTrails = [];
    this.impactRings = [];
    this.speedlinesActive = false;
    this.speedlinesProgress = 0;
    this.actionCutInActive = false;
    this.actionCutInProgress = 0;

    this.initPetals();
    this.addEvents();
    this.animate();
  }

  initPetals() {
    const count = window.innerWidth < 768 ? 22 : 40;
    this.petals = [];
    for (let i = 0; i < count; i++) {
      this.petals.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 5 + 3,
        speedY: Math.random() * 1.2 + 0.6,
        speedX: Math.random() * 0.8 - 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        opacity: Math.random() * 0.55 + 0.35,
        color: Math.random() > 0.5 ? '#00f0ff' : '#ff0055' // Cyber cyan & anime crimson embers
      });
    }
  }

  addEvents() {
    window.addEventListener('resize', () => {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
      this.initPetals();
    });

    // Interactive Katana Slash Spark on click
    window.addEventListener('pointerdown', (e) => {
      this.createSlashSparks(e.clientX, e.clientY);
      this.createImpactRing(e.clientX, e.clientY);
    });
  }

  // Toggle Anime Awakening Aura mode
  toggleAwakening() {
    this.auraAwakened = !this.auraAwakened;
    if (this.auraAwakened) {
      document.body.classList.add('anime-aura-active');
      this.triggerScreenShake();
      this.triggerActionCutIn();
      this.triggerSpeedlines(1200);
      for (let i = 0; i < 5; i++) {
        setTimeout(() => this.spawnLightningBolt(), i * 150);
      }
    } else {
      document.body.classList.remove('anime-aura-active');
    }
    return this.auraAwakened;
  }

  // Anime Screen Shake (Camera impact)
  triggerScreenShake(duration = 400) {
    document.body.style.animation = 'animeScreenShake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)';
    setTimeout(() => {
      document.body.style.animation = '';
    }, duration);
  }

  // Anime Action Cut-In Banner (Dramatic action manga cut)
  triggerActionCutIn(durationMs = 600) {
    this.actionCutInActive = true;
    this.actionCutInProgress = 0;
    const start = performance.now();

    const step = (time) => {
      const elapsed = time - start;
      const t = elapsed / durationMs;
      if (t < 1) {
        this.actionCutInProgress = t;
        requestAnimationFrame(step);
      } else {
        this.actionCutInActive = false;
        this.actionCutInProgress = 0;
      }
    };
    requestAnimationFrame(step);
  }

  // Anime Speedlines burst
  triggerSpeedlines(durationMs = 600) {
    this.speedlinesActive = true;
    this.speedlinesProgress = 1;
    const start = performance.now();

    const step = (time) => {
      const elapsed = time - start;
      const t = elapsed / durationMs;
      if (t < 1) {
        this.speedlinesProgress = 1 - t;
        requestAnimationFrame(step);
      } else {
        this.speedlinesActive = false;
        this.speedlinesProgress = 0;
      }
    };
    requestAnimationFrame(step);
  }

  // Cyber Anime Katana Laser Slash Sweep
  triggerLaserSlash(durationMs = 400) {
    const startX = Math.random() * (this.width * 0.25);
    const startY = Math.random() * (this.height * 0.35);
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.35;
    const len = Math.max(this.width, this.height) * 0.95;
    this.slashTrails.push({
      x: startX,
      y: startY,
      x2: startX + Math.cos(angle) * len,
      y2: startY + Math.sin(angle) * len,
      alpha: 1,
      color: '#00f0ff'
    });
    this.createImpactRing(startX + (Math.cos(angle) * len) * 0.4, startY + (Math.sin(angle) * len) * 0.4);
  }

  // Sukuna's Dismantle & Cleave Slash Barrage Animation
  triggerDismantleBarrage() {
    this.triggerScreenShake(500);
    const count = 10;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const startX = Math.random() * this.width;
        const startY = Math.random() * this.height;
        const angle = (Math.random() - 0.5) * Math.PI * 1.5;
        const len = Math.random() * 300 + 200;
        this.slashTrails.push({
          x: startX,
          y: startY,
          x2: startX + Math.cos(angle) * len,
          y2: startY + Math.sin(angle) * len,
          alpha: 1,
          color: '#ff0055' // Sukuna cursed crimson slash
        });
        this.createImpactRing(startX, startY);
      }, i * 35);
    }
  }

  // Sukuna's Malevolent Shrine Domain Expansion Animation
  triggerMalevolentShrine() {
    this.triggerScreenShake(800);
    this.triggerSpeedlines(1600);
    this.triggerActionCutIn(800);
    this.triggerDismantleBarrage();
    for (let i = 0; i < 8; i++) {
      setTimeout(() => this.spawnLightningBolt(), i * 120);
    }
  }

  // Create Katana Sparks when clicking
  createSlashSparks(x, y) {
    const angle = (Math.random() - 0.5) * Math.PI;
    const length = Math.random() * 80 + 60;
    this.slashTrails.push({
      x,
      y,
      x2: x + Math.cos(angle) * length,
      y2: y + Math.sin(angle) * length,
      alpha: 1,
      color: Math.random() > 0.5 ? '#00f0ff' : '#ffffff'
    });
  }

  // Create Anime Impact Ring
  createImpactRing(x, y) {
    this.impactRings.push({
      x,
      y,
      radius: 5,
      maxRadius: 65,
      alpha: 1,
      color: '#00f0ff'
    });
  }

  // Spawn Chidori / Thunder Breathing Lightning Bolt
  spawnLightningBolt() {
    const startX = Math.random() * this.width;
    const startY = Math.random() * (this.height * 0.4);
    const points = [{ x: startX, y: startY }];
    let curX = startX;
    let curY = startY;

    const segments = Math.floor(Math.random() * 6) + 5;
    for (let i = 0; i < segments; i++) {
      curX += (Math.random() - 0.5) * 80;
      curY += Math.random() * 50 + 20;
      points.push({ x: curX, y: curY });
    }

    this.lightningBolts.push({
      points,
      alpha: 1,
      color: Math.random() > 0.4 ? '#00f0ff' : '#ffffff'
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Random lightning in awakening mode
    if (this.auraAwakened && Math.random() < 0.08) {
      this.spawnLightningBolt();
    }

    // 1. Draw Digital Sakura / Glowing Cyber Embers
    for (let p of this.petals) {
      p.y += this.auraAwakened ? p.speedY * 2.2 : p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;

      if (p.y > this.height + 15) {
        p.y = -15;
        p.x = Math.random() * this.width;
      }
      if (p.x > this.width + 15) p.x = -15;
      if (p.x < -15) p.x = this.width + 15;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.globalAlpha = p.opacity;

      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = this.auraAwakened ? 16 : 8;
      this.ctx.shadowColor = p.color;

      this.ctx.beginPath();
      this.ctx.moveTo(0, -p.size);
      this.ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.3, p.size * 0.9, p.size * 0.8, 0, p.size);
      this.ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.8, -p.size * 0.9, -p.size * 0.3, 0, -p.size);
      this.ctx.fill();

      this.ctx.restore();
    }

    // 2. Draw Katana Spark Slashes
    for (let i = this.slashTrails.length - 1; i >= 0; i--) {
      const s = this.slashTrails[i];
      this.ctx.save();
      this.ctx.strokeStyle = s.color;
      this.ctx.lineWidth = 3;
      this.ctx.globalAlpha = s.alpha;
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = s.color;

      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y);
      this.ctx.lineTo(s.x2, s.y2);
      this.ctx.stroke();
      this.ctx.restore();

      s.alpha -= 0.08;
      if (s.alpha <= 0) this.slashTrails.splice(i, 1);
    }

    // 3. Draw Impact Rings
    for (let i = this.impactRings.length - 1; i >= 0; i--) {
      const r = this.impactRings[i];
      this.ctx.save();
      this.ctx.strokeStyle = r.color;
      this.ctx.lineWidth = 2;
      this.ctx.globalAlpha = r.alpha;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = r.color;

      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();

      r.radius += 3.5;
      r.alpha -= 0.06;
      if (r.alpha <= 0 || r.radius >= r.maxRadius) this.impactRings.splice(i, 1);
    }

    // 4. Draw Anime Lightning Bolts
    for (let i = this.lightningBolts.length - 1; i >= 0; i--) {
      const bolt = this.lightningBolts[i];
      this.ctx.save();
      this.ctx.strokeStyle = bolt.color;
      this.ctx.lineWidth = 2.5;
      this.ctx.globalAlpha = bolt.alpha;
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = '#00f0ff';

      this.ctx.beginPath();
      this.ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
      for (let j = 1; j < bolt.points.length; j++) {
        this.ctx.lineTo(bolt.points[j].x, bolt.points[j].y);
      }
      this.ctx.stroke();
      this.ctx.restore();

      bolt.alpha -= 0.12;
      if (bolt.alpha <= 0) this.lightningBolts.splice(i, 1);
    }

    // 5. Draw Anime Action Cut-In Diagonal Slashes
    if (this.actionCutInActive && this.actionCutInProgress > 0) {
      const t = this.actionCutInProgress;
      const alpha = Math.sin(t * Math.PI);
      const bandHeight = this.height * 0.28;
      const cy = this.height * 0.45;

      this.ctx.save();
      this.ctx.globalAlpha = alpha * 0.95;

      // Dark action backing strip with angled cut
      this.ctx.fillStyle = '#060609';
      this.ctx.beginPath();
      this.ctx.moveTo(0, cy - bandHeight / 2 - 40);
      this.ctx.lineTo(this.width, cy - bandHeight / 2 + 40);
      this.ctx.lineTo(this.width, cy + bandHeight / 2 + 40);
      this.ctx.lineTo(0, cy + bandHeight / 2 - 40);
      this.ctx.closePath();
      this.ctx.fill();

      // Dual glowing neon edge lines
      this.ctx.strokeStyle = '#00f0ff';
      this.ctx.lineWidth = 4;
      this.ctx.shadowBlur = 20;
      this.ctx.shadowColor = '#00f0ff';

      this.ctx.beginPath();
      this.ctx.moveTo(0, cy - bandHeight / 2 - 40);
      this.ctx.lineTo(this.width, cy - bandHeight / 2 + 40);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(0, cy + bandHeight / 2 - 40);
      this.ctx.lineTo(this.width, cy + bandHeight / 2 + 40);
      this.ctx.stroke();

      this.ctx.restore();
    }

    // 6. Draw Anime Speedlines
    if (this.speedlinesActive && this.speedlinesProgress > 0) {
      const cx = this.width / 2;
      const cy = this.height / 2;
      const lineCount = 48;
      const maxDist = Math.hypot(cx, cy);

      this.ctx.save();
      this.ctx.lineWidth = 2.5;
      this.ctx.strokeStyle = `rgba(0, 240, 255, ${this.speedlinesProgress * 0.45})`;

      for (let i = 0; i < lineCount; i++) {
        const angle = (i / lineCount) * Math.PI * 2 + Math.sin(i * 13) * 0.1;
        const innerRadius = maxDist * (0.32 + (i % 4) * 0.1);
        const outerRadius = maxDist * 1.1;

        const x1 = cx + Math.cos(angle) * innerRadius;
        const y1 = cy + Math.sin(angle) * innerRadius;
        const x2 = cx + Math.cos(angle) * outerRadius;
        const y2 = cy + Math.sin(angle) * outerRadius;

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
      }
      this.ctx.restore();
    }
  }
}

export const animeFX = new AnimeEffectsEngine();

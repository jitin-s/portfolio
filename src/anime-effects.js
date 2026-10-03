// Anime Cyber Effects Engine: Digital Sakura Petals + Dramatic Anime Speedlines + Laser Slash
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
    this.canvas.style.zIndex = '3';
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.width = (this.canvas.width = window.innerWidth);
    this.height = (this.canvas.height = window.innerHeight);

    this.petals = [];
    this.speedlinesActive = false;
    this.speedlinesProgress = 0;
    this.slashActive = false;
    this.slashProgress = 0;

    this.initPetals();
    this.addEvents();
    this.animate();
  }

  initPetals() {
    const count = window.innerWidth < 768 ? 20 : 35;
    this.petals = [];
    for (let i = 0; i < count; i++) {
      this.petals.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 6 + 4,
        speedY: Math.random() * 0.9 + 0.5,
        speedX: Math.random() * 0.6 - 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        opacity: Math.random() * 0.5 + 0.3,
        color: Math.random() > 0.6 ? '#00f0ff' : '#cbd5e1' // Cyber-cyan and katana-silver petals
      });
    }
  }

  addEvents() {
    window.addEventListener('resize', () => {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
      this.initPetals();
    });
  }

  // Trigger Anime Speedlines explosion (e.g. on page transition or power-up)
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

  // Trigger Katana Laser Slash wipe transition
  triggerLaserSlash(durationMs = 450) {
    this.slashActive = true;
    this.slashProgress = 0;
    const start = performance.now();

    const step = (time) => {
      const elapsed = time - start;
      const t = elapsed / durationMs;
      if (t < 1) {
        this.slashProgress = t;
        requestAnimationFrame(step);
      } else {
        this.slashActive = false;
        this.slashProgress = 0;
      }
    };
    requestAnimationFrame(step);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Digital Sakura / Glowing Cyber Embers
    for (let p of this.petals) {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;

      if (p.y > this.height + 10) {
        p.y = -10;
        p.x = Math.random() * this.width;
      }
      if (p.x > this.width + 10) p.x = -10;
      if (p.x < -10) p.x = this.width + 10;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.globalAlpha = p.opacity;

      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.color;

      // Draw stylized anime petal / diamond shard
      this.ctx.beginPath();
      this.ctx.moveTo(0, -p.size);
      this.ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.3, p.size * 0.8, p.size * 0.7, 0, p.size);
      this.ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.7, -p.size * 0.8, -p.size * 0.3, 0, -p.size);
      this.ctx.fill();

      this.ctx.restore();
    }

    // 2. Draw Anime Speedlines
    if (this.speedlinesActive && this.speedlinesProgress > 0) {
      const cx = this.width / 2;
      const cy = this.height / 2;
      const lineCount = 45;
      const maxDist = Math.hypot(cx, cy);

      this.ctx.save();
      this.ctx.lineWidth = 2.5;
      this.ctx.strokeStyle = `rgba(0, 240, 255, ${this.speedlinesProgress * 0.45})`;

      for (let i = 0; i < lineCount; i++) {
        const angle = (i / lineCount) * Math.PI * 2 + Math.sin(i * 11) * 0.1;
        const innerRadius = maxDist * (0.35 + (i % 3) * 0.1);
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

    // 3. Draw Katana Laser Slash Cut
    if (this.slashActive && this.slashProgress > 0) {
      this.ctx.save();
      const alpha = Math.sin(this.slashProgress * Math.PI);
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
      this.ctx.lineWidth = 4;
      this.ctx.shadowBlur = 18;
      this.ctx.shadowColor = '#00f0ff';

      this.ctx.beginPath();
      const xStart = -100 + this.slashProgress * (this.width + 200);
      const yStart = -100;
      const xEnd = xStart - this.width * 0.4;
      const yEnd = this.height + 100;

      this.ctx.moveTo(xStart, yStart);
      this.ctx.lineTo(xEnd, yEnd);
      this.ctx.stroke();
      this.ctx.restore();
    }
  }
}

export const animeFX = new AnimeEffectsEngine();

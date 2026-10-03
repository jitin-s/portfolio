// Ryomen Sukuna Alive Anime Character Animation Engine
import { sound } from './sound.js';
import { animeFX } from './anime-effects.js';
import confetti from 'canvas-confetti';

export class SukunaCharacterEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.characterWrap = this.container.querySelector('.sukuna-character-wrap');
    this.speechBubble = this.container.querySelector('.sukuna-speech-bubble');
    this.speechText = this.container.querySelector('.sukuna-speech-text');
    this.canvas = this.container.querySelector('#sukuna-fire-canvas');

    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.initCanvas();
    }

    this.quotes = [
      'Stand proud. You are strong.',
      'Throughout Heaven and Earth, I alone am the Honored One.',
      'Know your place, fool.',
      'Dismantle or Cleave? Choose your deployment.',
      'Domain Expansion: Malevolent Shrine!'
    ];
    this.quoteIndex = 0;

    this.bindEvents();
    this.animate();
  }

  initCanvas() {
    this.canvas.width = 460;
    this.canvas.height = 540;

    // Initialize cursed fire particles
    for (let i = 0; i < 45; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    return {
      x: 230 + (Math.random() - 0.5) * 260,
      y: 420 + Math.random() * 100,
      radius: Math.random() * 6 + 2,
      speedY: Math.random() * 2.5 + 1.2,
      speedX: (Math.random() - 0.5) * 1.5,
      life: 1,
      decay: Math.random() * 0.02 + 0.015,
      color: Math.random() > 0.4 ? '#ff0055' : '#880022' // Crimson cursed flames
    };
  }

  bindEvents() {
    // 3D Parallax on Character
    window.addEventListener('mousemove', (e) => {
      if (!this.characterWrap) return;
      const rect = this.container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

      this.characterWrap.style.transform = `
        perspective(1000px)
        rotateY(${deltaX * 14}deg)
        rotateX(${-deltaY * 10}deg)
        scale(1.02)
      `;
    });

    window.addEventListener('mouseleave', () => {
      if (!this.characterWrap) return;
      this.characterWrap.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
    });

    // Clicking Sukuna triggers Dismantle & speech popup
    if (this.characterWrap) {
      this.characterWrap.addEventListener('click', () => {
        this.triggerAttack();
      });
    }

    if (this.speechBubble) {
      this.speechBubble.addEventListener('click', (e) => {
        e.stopPropagation();
        this.triggerAttack();
      });
    }
  }

  triggerAttack() {
    sound.playPowerUp();
    sound.playLaserSlash();
    animeFX.triggerDismantleBarrage();
    animeFX.triggerSpeedlines(900);

    // Update quote
    this.quoteIndex = (this.quoteIndex + 1) % this.quotes.length;
    if (this.speechText) {
      this.speechText.innerText = this.quotes[this.quoteIndex];
      this.speechBubble.classList.add('pop');
      setTimeout(() => this.speechBubble.classList.remove('pop'), 400);
    }

    // Crimson and dark energy explosion
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { x: 0.75, y: 0.4 },
      colors: ['#ff0055', '#ffffff', '#220008', '#a855f7']
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Cursed Energy Flames billowing upwards
    for (let p of this.particles) {
      p.y -= p.speedY;
      p.x += p.speedX;
      p.life -= p.decay;

      if (p.life <= 0 || p.y < 50) {
        Object.assign(p, this.createParticle());
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.life * 0.75;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 14;
      this.ctx.shadowColor = p.color;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }
}

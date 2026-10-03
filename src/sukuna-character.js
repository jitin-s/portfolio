// Ryomen Sukuna Alive Anime Character Engine
// Supports dynamic animated GIF/video switching, cursed cyber frame, and anime attacks
import { sound } from './sound.js';
import { animeFX } from './anime-effects.js';
import confetti from 'canvas-confetti';

export class SukunaCharacterEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.characterWrap = this.container.querySelector('.sukuna-cyber-frame') || this.container.querySelector('.sukuna-character-wrap');
    this.mediaViewport = this.container.querySelector('.sukuna-media-viewport');
    this.mediaImg = this.container.querySelector('#sukuna-anime-media');
    this.speechBubble = this.container.querySelector('.sukuna-speech-bubble');
    this.speechText = this.container.querySelector('.sukuna-speech-text');
    this.techniqueBadge = this.container.querySelector('#sukuna-technique-badge');
    this.energyFill = this.container.querySelector('.cursed-energy-fill');
    this.canvas = this.container.querySelector('#sukuna-fire-canvas');

    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.initCanvas();
    }

    this.techniques = {
      domain: {
        src: '/sukuna-domain.gif',
        badge: '⛩️ DOMAIN EXPANSION',
        color: '#ff0055',
        quotes: [
          '"Domain Expansion: Malevolent Shrine!"',
          '"Within this radius, everything is dismantled without prejudice."',
          '"A clash of domains is decided by refinement."'
        ]
      },
      battle: {
        src: '/sukuna-battle.gif',
        badge: '⚔️ DISMANTLE & CLEAVE',
        color: '#00f0ff',
        quotes: [
          '"Dismantle. Reality sliced clean."',
          '"Know your place, fool."',
          '"Stand proud, engineer. You are strong."'
        ]
      },
      smile: {
        src: '/sukuna-smile.gif',
        badge: '😈 CURSED SMIRK',
        color: '#a855f7',
        quotes: [
          '"Throughout Heaven and Earth, I alone am the Honored One."',
          '"You dare challenge the King of Curses?"',
          '"Interesting... show me more of your architecture."'
        ]
      },
      flame: {
        src: '/sukuna-flame.gif',
        badge: '🔥 FŪGA (OPEN)',
        color: '#ff5500',
        quotes: [
          '"■ Open."',
          '"Let the world burn in sacred crimson flame."',
          '"Cleave until nothing remains."'
        ]
      }
    };

    this.currentTechnique = 'domain';
    this.quoteIndex = 0;

    this.bindEvents();
    this.animate();
  }

  initCanvas() {
    this.canvas.width = 480;
    this.canvas.height = 560;

    // Initialize cursed fire & lightning particles
    for (let i = 0; i < 50; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    return {
      x: 240 + (Math.random() - 0.5) * 280,
      y: 440 + Math.random() * 80,
      radius: Math.random() * 5 + 2,
      speedY: Math.random() * 3 + 1.2,
      speedX: (Math.random() - 0.5) * 2,
      life: 1,
      decay: Math.random() * 0.025 + 0.015,
      color: Math.random() > 0.4 ? '#ff0055' : (Math.random() > 0.5 ? '#a855f7' : '#00f0ff')
    };
  }

  setTechnique(techniqueKey) {
    if (!this.techniques[techniqueKey]) return;
    this.currentTechnique = techniqueKey;
    const tech = this.techniques[techniqueKey];

    // Smoothly swap animated media
    if (this.mediaImg) {
      this.mediaImg.style.opacity = '0.3';
      this.mediaImg.style.transform = 'scale(0.97)';
      setTimeout(() => {
        this.mediaImg.src = tech.src;
        this.mediaImg.style.opacity = '1';
        this.mediaImg.style.transform = 'scale(1)';
      }, 140);
    }

    // Update active technique button state
    const buttons = this.container.querySelectorAll('.sukuna-action-pill');
    buttons.forEach((btn) => {
      if (btn.dataset.tech === techniqueKey) {
        btn.classList.add('active');
        btn.style.borderColor = tech.color;
        btn.style.boxShadow = `0 0 16px ${tech.color}`;
      } else {
        btn.classList.remove('active');
        btn.style.borderColor = '';
        btn.style.boxShadow = '';
      }
    });

    // Surge Cursed Energy Meter
    if (this.energyFill) {
      this.energyFill.style.boxShadow = `0 0 18px ${tech.color}`;
      this.energyFill.style.width = '100%';
      setTimeout(() => {
        if (this.energyFill) this.energyFill.style.width = '96%';
      }, 400);
    }

    // Update technique badge
    if (this.techniqueBadge) {
      this.techniqueBadge.innerText = tech.badge;
      this.techniqueBadge.style.color = tech.color;
      this.techniqueBadge.style.borderColor = tech.color;
      this.techniqueBadge.style.boxShadow = `0 0 16px ${tech.color}44`;
    }

    // Update speech bubble quote
    this.quoteIndex = (this.quoteIndex + 1) % tech.quotes.length;
    if (this.speechText) {
      this.speechText.innerText = tech.quotes[this.quoteIndex];
      this.speechBubble?.classList.add('pop');
      setTimeout(() => this.speechBubble?.classList.remove('pop'), 350);
    }

    // Trigger visual anime FX
    if (techniqueKey === 'domain') {
      animeFX.triggerMalevolentShrine();
      sound.playPowerUp();
    } else if (techniqueKey === 'battle') {
      animeFX.triggerDismantleBarrage();
      sound.playLaserSlash();
    } else if (techniqueKey === 'flame') {
      animeFX.triggerSpeedlines(900);
      sound.playPowerUp();
    } else {
      sound.playClick();
    }

    // Celebration burst
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { x: 0.75, y: 0.45 },
      colors: [tech.color, '#ffffff', '#111111']
    });
  }

  cycleNextTechnique() {
    const keys = Object.keys(this.techniques);
    const currentIndex = keys.indexOf(this.currentTechnique);
    const nextKey = keys[(currentIndex + 1) % keys.length];
    this.setTechnique(nextKey);
  }

  bindEvents() {
    // 3D Mouse Parallax Tracking on Cyber Frame
    window.addEventListener('mousemove', (e) => {
      if (!this.characterWrap) return;
      // Disable 3D tilt on touch screens or small mobile screens for stability
      if (window.innerWidth < 768) return;

      const rect = this.container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

      this.characterWrap.style.transform = `
        perspective(1200px)
        rotateY(${deltaX * 10}deg)
        rotateX(${-deltaY * 7}deg)
      `;
    });

    window.addEventListener('mouseleave', () => {
      if (!this.characterWrap) return;
      this.characterWrap.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg)';
    });

    // Clicking media viewport triggers technique cycle
    if (this.mediaViewport) {
      this.mediaViewport.addEventListener('click', () => {
        this.cycleNextTechnique();
      });
    }

    // Clicking speech bubble also cycles
    if (this.speechBubble) {
      this.speechBubble.addEventListener('click', (e) => {
        e.stopPropagation();
        this.cycleNextTechnique();
      });
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Billowing Cursed Flames behind frame
    for (let p of this.particles) {
      p.y -= p.speedY;
      p.x += p.speedX;
      p.life -= p.decay;

      if (p.life <= 0 || p.y < 40) {
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

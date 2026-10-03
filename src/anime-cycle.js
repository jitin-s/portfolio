// 20-Second Autonomous Anime Manifestation & Transition Engine
import { sound } from './sound.js';
import { animeFX } from './anime-effects.js';
import confetti from 'canvas-confetti';

export class AnimeCycleEngine {
  constructor(options = {}) {
    this.intervalMs = options.intervalMs || 20000; // 20 seconds per user request
    this.currentIndex = 0;
    this.timer = null;
    this.progressTimer = null;
    this.startTime = Date.now();
    this.isPaused = false;

    this.phases = [
      {
        id: 'domain',
        name: 'DOMAIN EXPANSION',
        icon: '⛩️',
        mediaSrc: '/sukuna-domain.gif',
        color: '#ff0055',
        quote: 'Domain Expansion: Malevolent Shrine Manifested',
        action: () => {
          animeFX.triggerMalevolentShrine();
          sound.playPowerUp();
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { x: 0.5, y: 0.4 },
            colors: ['#ff0055', '#a855f7', '#ffffff']
          });
        }
      },
      {
        id: 'battle',
        name: 'DISMANTLE & CLEAVE',
        icon: '⚔️',
        mediaSrc: '/sukuna-battle.gif',
        color: '#00f0ff',
        quote: 'Dismantle: Reality Sliced Clean',
        action: () => {
          animeFX.triggerDismantleBarrage();
          animeFX.triggerLaserSlash(800);
          sound.playLaserSlash();
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { x: 0.5, y: 0.45 },
            colors: ['#00f0ff', '#ffffff', '#1e293b']
          });
        }
      },
      {
        id: 'flame',
        name: 'FŪGA: DIVINE FLAME',
        icon: '🔥',
        mediaSrc: '/sukuna-flame.gif',
        color: '#ff5500',
        quote: '■ Open. Sacred Crimson Flame Ignited',
        action: () => {
          animeFX.triggerSpeedlines(1000);
          sound.playPowerUp();
          confetti({
            particleCount: 90,
            spread: 100,
            origin: { x: 0.5, y: 0.5 },
            colors: ['#ff5500', '#ff0055', '#ffffff']
          });
        }
      },
      {
        id: 'smile',
        name: 'CURSED SMIRK & SMILE',
        icon: '😈',
        mediaSrc: '/sukuna-smile.gif',
        color: '#a855f7',
        quote: 'Stand proud, engineer. You are strong.',
        action: () => {
          for (let i = 0; i < 4; i++) {
            setTimeout(() => animeFX.spawnLightningBolt(), i * 140);
          }
          sound.playSuccess();
          confetti({
            particleCount: 65,
            spread: 75,
            origin: { x: 0.5, y: 0.35 },
            colors: ['#a855f7', '#c084fc', '#ffffff']
          });
        }
      }
    ];

    this.createHudElements();
    this.start();
    this.bindEvents();
  }

  createHudElements() {
    // 1. Toast Notification Container
    this.toastContainer = document.createElement('div');
    this.toastContainer.id = 'anime-cycle-toast-container';
    this.toastContainer.className = 'anime-cycle-toast-container';
    document.body.appendChild(this.toastContainer);

    // 2. Floating Cyber Timer Pill (Bottom Right, Above Dock)
    this.timerPill = document.createElement('div');
    this.timerPill.id = 'anime-cycle-timer-pill';
    this.timerPill.className = 'anime-cycle-timer-pill';
    this.timerPill.title = 'Click to skip to next animation immediately (Cycles every 20s)';
    this.timerPill.innerHTML = `
      <div class="pill-timer-ring">
        <svg viewBox="0 0 36 36">
          <path class="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path class="ring-progress" id="cycle-ring-progress" stroke-dasharray="100, 100" stroke-dashoffset="100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
        <span id="cycle-seconds-left" class="ring-text">20</span>
      </div>
      <div class="pill-info">
        <span class="pill-phase-tag" id="cycle-current-tag">⛩️ DOMAIN</span>
        <span class="pill-sub">NEXT SHIFT IN 20s</span>
      </div>
      <button class="pill-skip-btn" id="cycle-skip-btn" title="Skip to next animation">⏭</button>
    `;
    document.body.appendChild(this.timerPill);

    this.ringProgress = document.getElementById('cycle-ring-progress');
    this.secondsLeftEl = document.getElementById('cycle-seconds-left');
    this.phaseTagEl = document.getElementById('cycle-current-tag');
  }

  start() {
    this.startTime = Date.now();
    this.runProgressLoop();

    this.timer = setInterval(() => {
      if (!this.isPaused) {
        this.next();
      }
    }, this.intervalMs);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.phases.length;
    this.triggerPhase(this.currentIndex);
    this.startTime = Date.now();
  }

  triggerPhase(index) {
    const phase = this.phases[index];
    if (!phase) return;

    // 1. Crossfade Ambient Background Media
    const ambientMedia = document.getElementById('sukuna-ambient-media');
    const ambientBg = document.getElementById('sukuna-ambient-bg');

    if (ambientMedia) {
      ambientMedia.style.opacity = '0.05';
      ambientMedia.style.transform = 'scale(0.98)';
      setTimeout(() => {
        ambientMedia.src = phase.mediaSrc;
        ambientMedia.style.opacity = '';
        ambientMedia.style.transform = '';
      }, 180);
    }

    if (ambientBg) {
      ambientBg.classList.add('surging');
      setTimeout(() => ambientBg.classList.remove('surging'), 1400);
    }

    // 2. Execute Phase Action (Screen slashes, speedlines, particles, sound)
    try {
      phase.action();
    } catch (e) {
      console.warn('Phase action note:', e);
    }

    // 3. Update HUD Display
    if (this.phaseTagEl) {
      this.phaseTagEl.innerText = `${phase.icon} ${phase.name}`;
      this.phaseTagEl.style.color = phase.color;
    }
    if (this.timerPill) {
      this.timerPill.style.borderColor = `${phase.color}88`;
      this.timerPill.style.boxShadow = `0 8px 30px rgba(0,0,0,0.7), 0 0 20px ${phase.color}44`;
    }

    // 4. Show Cinematic Cyber Toast
    this.showToast(phase);
  }

  showToast(phase) {
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'anime-cycle-toast';
    toast.style.borderColor = phase.color;
    toast.style.boxShadow = `0 10px 35px rgba(0,0,0,0.85), 0 0 25px ${phase.color}44`;

    toast.innerHTML = `
      <div class="toast-left-bar" style="background: ${phase.color};"></div>
      <div class="toast-content">
        <div class="toast-header">
          <span class="toast-badge" style="background: ${phase.color}22; color: ${phase.color}; border: 1px solid ${phase.color}66;">
            ${phase.icon} 20s SHIFT: ACTIVE
          </span>
          <span class="toast-timer">AUTO-CYCLE</span>
        </div>
        <div class="toast-title">${phase.name}</div>
        <div class="toast-quote">"${phase.quote}"</div>
      </div>
    `;

    this.toastContainer.appendChild(toast);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }

  runProgressLoop() {
    const update = () => {
      if (!this.isPaused) {
        const elapsed = Date.now() - this.startTime;
        const remainingMs = Math.max(0, this.intervalMs - (elapsed % this.intervalMs));
        const secondsLeft = Math.ceil(remainingMs / 1000);
        const percent = ((this.intervalMs - remainingMs) / this.intervalMs) * 100;

        if (this.secondsLeftEl) {
          this.secondsLeftEl.innerText = `${secondsLeft}s`;
        }

        if (this.ringProgress) {
          // Circumference is 100
          const offset = 100 - percent;
          this.ringProgress.style.strokeDashoffset = offset;
        }
      }
      this.progressTimer = requestAnimationFrame(update);
    };

    this.progressTimer = requestAnimationFrame(update);
  }

  bindEvents() {
    // Skip button click
    const skipBtn = document.getElementById('cycle-skip-btn');
    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.next();
      });
    }

    if (this.timerPill) {
      this.timerPill.addEventListener('click', () => {
        this.next();
      });
    }

    // Auto pause if tab is hidden to save CPU/battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isPaused = true;
      } else {
        this.isPaused = false;
        this.startTime = Date.now();
      }
    });
  }

  destroy() {
    if (this.timer) clearInterval(this.timer);
    if (this.progressTimer) cancelAnimationFrame(this.progressTimer);
    if (this.toastContainer) this.toastContainer.remove();
    if (this.timerPill) this.timerPill.remove();
  }
}

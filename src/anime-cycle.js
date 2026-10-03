// 20-Second Autonomous Ambient Anime Manifestation Engine
// Silently cycles background anime visuals every 20 seconds without any popups, banners, or toast notifications

export class AnimeCycleEngine {
  constructor(options = {}) {
    this.intervalMs = options.intervalMs || 20000; // 20 seconds per user request
    this.currentIndex = 0;
    this.timer = null;
    this.isPaused = false;

    this.phases = [
      {
        id: 'domain',
        name: 'DOMAIN EXPANSION',
        mediaSrc: '/sukuna-domain.gif',
        color: '#ff0055'
      },
      {
        id: 'battle',
        name: 'DISMANTLE & CLEAVE',
        mediaSrc: '/sukuna-battle.gif',
        color: '#00f0ff'
      },
      {
        id: 'flame',
        name: 'FŪGA: DIVINE FLAME',
        mediaSrc: '/sukuna-flame.gif',
        color: '#ff5500'
      },
      {
        id: 'smile',
        name: 'CURSED SMIRK & SMILE',
        mediaSrc: '/sukuna-smile.gif',
        color: '#a855f7'
      }
    ];

    this.start();
    this.bindEvents();
  }

  start() {
    this.timer = setInterval(() => {
      if (!this.isPaused) {
        this.next();
      }
    }, this.intervalMs);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.phases.length;
    this.triggerPhase(this.currentIndex);
  }

  triggerPhase(index) {
    const phase = this.phases[index];
    if (!phase) return;

    // Smoothly crossfade ambient background media without any popup or notification
    const ambientMedia = document.getElementById('sukuna-ambient-media');
    const ambientBg = document.getElementById('sukuna-ambient-bg');

    if (ambientMedia) {
      ambientMedia.style.opacity = '0.04';
      ambientMedia.style.transform = 'scale(0.98)';
      setTimeout(() => {
        ambientMedia.src = phase.mediaSrc;
        ambientMedia.style.opacity = '';
        ambientMedia.style.transform = '';
      }, 250);
    }

    if (ambientBg) {
      ambientBg.classList.add('surging');
      setTimeout(() => ambientBg.classList.remove('surging'), 1200);
    }
  }

  bindEvents() {
    // Auto pause when tab is hidden/minimized to save resources
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isPaused = true;
      } else {
        this.isPaused = false;
      }
    });
  }

  destroy() {
    if (this.timer) clearInterval(this.timer);
  }
}

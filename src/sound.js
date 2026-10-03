// High-tech Anime & Cyber Web Audio Synthesizer
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.initialized = false;
  }

  init() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    } catch (e) {
      console.warn('Web Audio not supported');
    }
  }

  toggle() {
    this.muted = !this.muted;
    return !this.muted;
  }

  playHover() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch (e) {}
  }

  // Anime Laser Slash sound
  playLaserSlash() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.18);
      filter.Q.value = 5;

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {}
  }

  // Anime Power Up / Awakening sound
  playPowerUp() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const now = this.ctx.currentTime;
      [220, 330, 440, 660, 880].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + idx * 0.06 + 0.2);
        gain.gain.setValueAtTime(0.03, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.2);
      });
    } catch (e) {}
  }

  playSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.025, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.14);
      });
    } catch (e) {}
  }

  playKey() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1400 + Math.random() * 300, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.007, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.02);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.02);
    } catch (e) {}
  }
}

export const sound = new SoundEngine();

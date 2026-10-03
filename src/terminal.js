import { sound } from './sound.js';
import { animeFX } from './anime-effects.js';
import confetti from 'canvas-confetti';

export class InteractiveTerminal {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.input = this.container.querySelector('.term-input');
    this.output = this.container.querySelector('.term-output');
    this.history = [];
    this.historyIndex = -1;

    this.commands = {
      help: () => `
<span class="text-glow font-bold">SYSTEM DIRECTIVES:</span>
  <span class="text-glow">whoami</span>           - Operator clearance & identity
  <span class="text-glow">projects</span>         - Enumerate live production deployments
  <span class="text-glow">skills</span>           - Technical combat arsenal & masteries
  <span class="text-glow">arcs</span>             - Inspect chronological story arcs
  <span class="text-glow">contact</span>          - Establish quantum communication
  <span class="text-glow">github</span>           - Uplink to GitHub repository feed
  <span class="text-glow">bankai</span>           - [ANIME] Unleash Final Form Release
  <span class="text-glow">domain_expansion</span> - [ANIME] Infinite Quantum Void
  <span class="text-glow">ultra_instinct</span>   - [ANIME] Autonomous Reflex Protocol
  <span class="text-glow">clear</span>            - Purge terminal buffer
`,
      whoami: () => `
<span class="font-bold text-white">JITIN SAIN</span> [Full Stack & AI Systems Architect]
• Power Classification: S-Rank Full Stack / AI Specialist
• GitHub Handle: @jitin-s (11+ Repositories, 6+ Live Edge Domains)
• Mission: Architecting national crisis intelligence & decentralized protocols
• Current Status: [READY FOR BATTLE / AVAILABLE FOR OFFERS]
`,
      projects: () => `
<span class="font-bold text-white">KEY CODEBASES & DEPLOYMENTS:</span>
1. <a href="https://github.com/jitin-s/DisasterLens" target="_blank" class="term-link">DisasterLens</a> - National AI Predictive Emergency Portal [Live: disasterlenss.streamlit.app]
2. <a href="https://github.com/jitin-s/SetuXAI_Bot" target="_blank" class="term-link">SetuXAI_Bot</a> - Secure Interoperability Bridge & Intelligent AI Bot [Live: setuxai.vercel.app]
3. <a href="https://github.com/jitin-s/Agniveer-Sentinel" target="_blank" class="term-link">Agniveer-Sentinel</a> - Autonomous Threat Detection Network Sentinel
4. <a href="https://github.com/jitin-s/ngl" target="_blank" class="term-link">ngl-platform</a> - High-concurrency Anonymous Messaging Feed [Live: ngl-jitin-io.vercel.app]
5. <a href="https://github.com/jitin-s/MuscleHut" target="_blank" class="term-link">MuscleHut</a> - Fitness Ecosystem [Live: musclehut-nine.vercel.app]
6. <a href="https://github.com/jitin-s/Payments-Without-Internet" target="_blank" class="term-link">Flowpay</a> - Encrypted Mesh Peer-to-Peer Transactions
`,
      skills: () => `
<span class="font-bold text-white">COMBAT POWER LEVELS:</span>
• <span class="text-glow">AI & Deep Learning:</span> 95% (PyTorch, Predictive Models, Geospatial AI, LLM)
• <span class="text-glow">Frontend & WebGL:</span> 94% (React, Next.js, Three.js, TypeScript, Tailwind)
• <span class="text-glow">Backend & Networks:</span> 91% (Python, FastAPI, Node.js, Mesh P2P, Cryptography)
• <span class="text-glow">Mobile & Cloud:</span> 88% (Flutter, Dart, Docker, Vercel, Streamlit Cloud)
`,
      arcs: () => `
<span class="font-bold text-white">CHRONOLOGICAL STORY ARCS:</span>
[Arc III • 2026] National Predictive AI & Agentic Interoperability (DisasterLens, SetuX)
[Arc II • 2026] Resilient Offline Mesh Protocols & Defense (Flowpay, Agniveer-Sentinel)
[Arc I • 2026] Real-Time Platforms & Mobile Telemetry (ngl, MuscleHut, TapSOS)
`,
      contact: () => `
<span class="font-bold text-white">TRANSMISSION FREQUENCIES:</span>
• GitHub: <a href="https://github.com/jitin-s" target="_blank" class="term-link">github.com/jitin-s</a>
• Developer Mail: jitinsain.work@gmail.com
• Signal Status: [OPEN TO TRANSMIT]
`,
      github: () => {
        window.open('https://github.com/jitin-s', '_blank');
        return `Opening GitHub uplink: <a href="https://github.com/jitin-s" target="_blank" class="term-link">https://github.com/jitin-s</a>...`;
      },
      bankai: () => {
        sound.playLaserSlash();
        sound.playPowerUp();
        animeFX.triggerSpeedlines(1200);
        animeFX.triggerLaserSlash(800);
        confetti({
          particleCount: 160,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#00f0ff', '#ffffff', '#ff0055', '#a855f7']
        });
        return `<span style="color:#00f0ff; font-weight:800; text-shadow: 0 0 10px #00f0ff;">⚡ [BANKAI: TENSA ZANGETSU / QUANTUM CORE RELEASED]</span><br/>All system parameters overclocked to 300%.`;
      },
      domain_expansion: () => {
        sound.playPowerUp();
        animeFX.triggerSpeedlines(1400);
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.5 },
          colors: ['#38bdf8', '#c084fc', '#ffffff', '#10b981']
        });
        return `<span style="color:#c084fc; font-weight:800; text-shadow: 0 0 10px #c084fc;">🌌 [DOMAIN EXPANSION: INFINITE VOID ARCHITECTURE]</span><br/>All incoming bugs and latency have been neutralized within the infinite barrier.`;
      },
      ultra_instinct: () => {
        sound.playSuccess();
        animeFX.triggerSpeedlines(1000);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#ffffff', '#cbd5e1', '#94a3b8']
        });
        return `<span style="color:#ffffff; font-weight:800; text-shadow: 0 0 15px #ffffff;">✨ [MIGATTE NO GOKUI: AUTONOMOUS REFLEX ACTIVATED]</span><br/>Zero delay execution engaged across all edge nodes.`;
      },
      clear: () => {
        this.output.innerHTML = '';
        return null;
      }
    };

    this.bindEvents();
  }

  bindEvents() {
    this.input.addEventListener('keydown', (e) => {
      sound.playKey();

      if (e.key === 'Enter') {
        const val = this.input.value.trim().toLowerCase();
        if (!val) return;

        this.history.push(val);
        this.historyIndex = this.history.length;

        this.executeCommand(val);
        this.input.value = '';
      } else if (e.key === 'ArrowUp') {
        if (this.history.length > 0 && this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      }
    });

    this.container.addEventListener('click', () => {
      this.input.focus();
    });
  }

  executeCommand(cmd) {
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = `<span class="term-prompt">jitin@anime-core:~$</span> <span class="term-cmd">${this.escapeHtml(cmd)}</span>`;
    this.output.appendChild(line);

    if (this.commands[cmd]) {
      const result = this.commands[cmd]();
      if (result !== null) {
        const resDiv = document.createElement('div');
        resDiv.className = 'term-res';
        resDiv.innerHTML = result;
        this.output.appendChild(resDiv);
      }
    } else {
      const errDiv = document.createElement('div');
      errDiv.className = 'term-res text-red';
      errDiv.innerHTML = `command not recognized: '${this.escapeHtml(cmd)}'. Type <span class="text-glow">help</span> for recognized commands or try <span class="text-glow">bankai</span>.`;
      this.output.appendChild(errDiv);
    }

    this.output.scrollTop = this.output.scrollHeight;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }
}

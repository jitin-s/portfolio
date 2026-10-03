import { sound } from './sound.js';
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
Available system commands:
  <span class="text-glow">whoami</span>       - Display engineer profile & clearance
  <span class="text-glow">projects</span>     - List key production architectures
  <span class="text-glow">skills</span>       - Inspect technical capabilities & stack
  <span class="text-glow">experience</span>   - View career milestones
  <span class="text-glow">contact</span>      - Open direct comms transmission
  <span class="text-glow">github</span>       - Open official GitHub profile
  <span class="text-glow">matrix</span>       - Trigger cyber matrix pulse
  <span class="text-glow">clear</span>        - Purge terminal buffer
`,
      whoami: () => `
<span class="font-bold text-white">JITIN SAIN</span> [Full Stack & AI Systems Architect]
• Primary Domains: Predictive AI, Autonomous Threat Networks, Full Stack Engineering
• GitHub Handle: @jitin-s (11+ Repositories, 5+ Live Deployments)
• Location: India • Status: Available for High-Impact Roles & Collaborations
`,
      projects: () => `
<span class="font-bold text-white">KEY REPOSITORIES & DEPLOYMENTS:</span>
1. <a href="https://github.com/jitin-s/DisasterLens" target="_blank" class="term-link">DisasterLens</a> - National AI Multi-Hazard Predictive Intelligence [Live: disasterlenss.streamlit.app]
2. <a href="https://github.com/jitin-s/Agniveer-Sentinel" target="_blank" class="term-link">Agniveer-Sentinel</a> - Autonomous Threat Detection & Neutralization Mesh
3. <a href="https://github.com/jitin-s/SetuXAI_Bot" target="_blank" class="term-link">SetuXAI_Bot</a> - Secure Interoperability Layer & Autonomous AI Assistant
4. <a href="https://github.com/jitin-s/ngl" target="_blank" class="term-link">ngl-platform</a> - High-concurrency Anonymous Messaging Platform [Live: ngl-jitin-io.vercel.app]
5. <a href="https://github.com/jitin-s/MuscleHut" target="_blank" class="term-link">MuscleHut</a> - Fitness Platform [Live: musclehut-nine.vercel.app]
6. <a href="https://github.com/jitin-s/Payments-Without-Internet" target="_blank" class="term-link">Flowpay</a> - Encrypted Offline Peer-to-Peer Transactions
`,
      skills: () => `
<span class="font-bold text-white">TECHNICAL ARSENAL:</span>
• <span class="text-glow">AI / ML:</span> Python, PyTorch, Predictive Modeling, Geospatial AI, LLM Tooling
• <span class="text-glow">Frontend:</span> React, Next.js, TypeScript, Three.js, Tailwind CSS, Modern WebGL
• <span class="text-glow">Backend:</span> Python, Node.js, FastAPI, REST/GraphQL, Mesh Networking
• <span class="text-glow">Mobile:</span> Flutter, Dart, Geolocation Broadcasting
• <span class="text-glow">Infra:</span> Git, GitHub Actions, Docker, Vercel, Streamlit Cloud
`,
      experience: () => `
<span class="font-bold text-white">SYSTEM TIMELINE:</span>
[2024 - Present] Lead Architect @ AI & Systems Research
• Designed DisasterLens multi-hazard early warning prototype
• Built SetuX enterprise system interoperability bridge
• Engineered offline cryptographic payment protocols
`,
      contact: () => `
<span class="font-bold text-white">TRANSMISSION FREQUENCIES:</span>
• GitHub: <a href="https://github.com/jitin-s" target="_blank" class="term-link">github.com/jitin-s</a>
• Email: Direct link via contact form below
• Status: [READY TO TRANSMIT]
`,
      github: () => {
        window.open('https://github.com/jitin-s', '_blank');
        return `Opening GitHub transmission: <a href="https://github.com/jitin-s" target="_blank" class="term-link">https://github.com/jitin-s</a>...`;
      },
      matrix: () => {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#8a94a8', '#ffffff', '#474e5d', '#00ffcc']
        });
        sound.playSuccess();
        return `<span style="color:#00ffcc;">[CYBER PROTOCOL ACTIVATED] Quantum matrix stream synchronized.</span>`;
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

    // Focus input on terminal click
    this.container.addEventListener('click', () => {
      this.input.focus();
    });
  }

  executeCommand(cmd) {
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = `<span class="term-prompt">guest@jitin-core:~$</span> <span class="term-cmd">${this.escapeHtml(cmd)}</span>`;
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
      errDiv.innerHTML = `command not recognized: '${this.escapeHtml(cmd)}'. Type <span class="text-glow">help</span> for recognized directives.`;
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

// Cyber Command Palette (Neural Directives HUD - Ctrl+K / ⌘K)
import { sound } from './sound.js';
import { animeFX } from './anime-effects.js';
import confetti from 'canvas-confetti';

export class CyberCommandPalette {
  constructor(router) {
    this.router = router;
    this.isOpen = false;
    this.selectedIndex = 0;
    this.commands = this.getCommands();
    this.filteredCommands = [...this.commands];

    this.createDom();
    this.bindEvents();
  }

  getCommands() {
    return [
      // Navigation
      {
        id: 'nav-home',
        category: 'NAVIGATION',
        icon: '🏠',
        title: 'Return to Neural Core',
        desc: 'Jump to Home Architect profile and telemetry',
        shortcut: 'G H',
        action: () => this.router?.navigateTo?.('home', true)
      },
      {
        id: 'nav-projects',
        category: 'NAVIGATION',
        icon: '⚡',
        title: 'Open Project Vault',
        desc: 'Browse live production systems & GitHub codebases',
        shortcut: 'G P',
        action: () => this.router?.navigateTo?.('projects', true)
      },
      {
        id: 'nav-arsenal',
        category: 'NAVIGATION',
        icon: '⚔️',
        title: 'Inspect Combat Arsenal',
        desc: 'Explore AI, WebGL, Backend, and Systems masteries',
        shortcut: 'G A',
        action: () => this.router?.navigateTo?.('arsenal', true)
      },
      {
        id: 'nav-arcs',
        category: 'NAVIGATION',
        icon: '📜',
        title: 'View Chronological Story Arcs',
        desc: 'Timeline of national systems and emergency networks',
        shortcut: 'G S',
        action: () => this.router?.navigateTo?.('trajectory', true)
      },
      {
        id: 'nav-terminal',
        category: 'NAVIGATION',
        icon: '💻',
        title: 'Launch Cyber Terminal',
        desc: 'Interactive CLI shell simulator and secret commands',
        shortcut: 'G T',
        action: () => this.router?.navigateTo?.('terminal', true)
      },
      {
        id: 'nav-comms',
        category: 'NAVIGATION',
        icon: '📡',
        title: 'Establish Transmission Comms',
        desc: 'Quantum uplink and direct communication channels',
        shortcut: 'G C',
        action: () => this.router?.navigateTo?.('transmission', true)
      },

      // Anime Combat Techniques
      {
        id: 'fx-domain',
        category: 'ANIME TECHNIQUES',
        icon: '⛩️',
        title: 'Domain Expansion: Malevolent Shrine',
        desc: 'Manifest Sukuna dimensional domain with screen impacts',
        shortcut: 'D E',
        action: () => {
          sound.playPowerUp();
          animeFX.triggerMalevolentShrine();
          const ambientMedia = document.getElementById('sukuna-ambient-media');
          if (ambientMedia) ambientMedia.src = '/sukuna-domain.gif';
          const ambientBg = document.getElementById('sukuna-ambient-bg');
          ambientBg?.classList.add('surging');
          setTimeout(() => ambientBg?.classList.remove('surging'), 1500);
          confetti({
            particleCount: 160,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#ff0055', '#a855f7', '#00f0ff', '#ffffff']
          });
        }
      },
      {
        id: 'fx-flame',
        category: 'ANIME TECHNIQUES',
        icon: '🔥',
        title: 'Fūga: Divine Crimson Flame',
        desc: 'Ignite sacred open flame combustion and speedlines',
        shortcut: 'F G',
        action: () => {
          sound.playPowerUp();
          animeFX.triggerSpeedlines(1200);
          const ambientMedia = document.getElementById('sukuna-ambient-media');
          if (ambientMedia) ambientMedia.src = '/sukuna-flame.gif';
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#ff5500', '#ff0055', '#ffffff']
          });
        }
      },
      {
        id: 'fx-bankai',
        category: 'ANIME TECHNIQUES',
        icon: '⚡',
        title: 'Bankai: Tensa Zangetsu Core Release',
        desc: 'Execute instant multi-blade katana slash sweep across viewport',
        shortcut: 'B K',
        action: () => {
          sound.playLaserSlash();
          sound.playPowerUp();
          animeFX.triggerLaserSlash(800);
          animeFX.triggerSpeedlines(1000);
          confetti({
            particleCount: 140,
            spread: 95,
            origin: { y: 0.5 },
            colors: ['#00f0ff', '#ffffff', '#ff0055']
          });
        }
      },
      {
        id: 'fx-aura',
        category: 'ANIME TECHNIQUES',
        icon: '✨',
        title: 'Toggle Anime Awakening Aura',
        desc: 'Overclock developer power levels and reactive glow',
        shortcut: 'A U',
        action: () => {
          const auraBtn = document.getElementById('aura-toggle');
          auraBtn?.click();
        }
      },

      // System Protocols
      {
        id: 'sys-sync',
        category: 'SYSTEM PROTOCOLS',
        icon: '🔄',
        title: 'Force Realtime GitHub Sync',
        desc: 'Ping GitHub API immediately to fetch latest commits & repositories',
        shortcut: 'S Y',
        action: () => {
          const syncBtn = document.getElementById('btn-sync-github');
          syncBtn?.click();
        }
      },
      {
        id: 'sys-bg',
        category: 'SYSTEM PROTOCOLS',
        icon: '👁️',
        title: 'Toggle Sukuna Background Extension',
        desc: 'Turn ambient holographic backdrop ON/OFF',
        shortcut: 'B G',
        action: () => {
          const bgBtn = document.getElementById('bg-extension-toggle');
          bgBtn?.click();
        }
      },
      {
        id: 'sys-sound',
        category: 'SYSTEM PROTOCOLS',
        icon: '🔊',
        title: 'Toggle Cyber Audio Synthesizer',
        desc: 'Switch Web Audio feedback sound effects ON/OFF',
        shortcut: 'S D',
        action: () => {
          const soundBtn = document.getElementById('sound-toggle');
          soundBtn?.click();
        }
      },
      {
        id: 'sys-copy',
        category: 'SYSTEM PROTOCOLS',
        icon: '📋',
        title: 'Copy Developer Direct Email',
        desc: 'Copy jitinsain.work@gmail.com directly to clipboard',
        shortcut: 'C M',
        action: () => {
          navigator.clipboard.writeText('jitinsain.work@gmail.com').then(() => {
            sound.playSuccess();
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.3 },
              colors: ['#00f0ff', '#ffffff']
            });
          });
        }
      },
      {
        id: 'sys-github',
        category: 'SYSTEM PROTOCOLS',
        icon: '🌐',
        title: 'Uplink to GitHub Profile',
        desc: 'Launch github.com/jitin-s in a new secure window',
        shortcut: 'G B',
        action: () => {
          window.open('https://github.com/jitin-s', '_blank');
        }
      }
    ];
  }

  createDom() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'cyber-palette-overlay';
    this.overlay.className = 'cyber-palette-overlay';
    this.overlay.setAttribute('aria-hidden', 'true');

    this.overlay.innerHTML = `
      <div class="cyber-palette-backdrop"></div>
      <div class="cyber-palette-dialog" role="dialog" aria-modal="true" aria-label="Neural Command Palette">
        <div class="palette-glow-ring"></div>
        <div class="palette-corner top-left"></div>
        <div class="palette-corner top-right"></div>
        <div class="palette-corner bottom-left"></div>
        <div class="palette-corner bottom-right"></div>

        <div class="palette-header">
          <div class="palette-search-box">
            <span class="palette-search-icon">⚡</span>
            <input 
              type="text" 
              class="palette-input" 
              id="palette-search-input" 
              placeholder="Type a command or jump to page... (e.g. 'domain', 'vault', 'sync')" 
              autocomplete="off" 
              spellcheck="false"
            />
            <button class="palette-close-btn" id="palette-close-btn" title="Close (Esc)">ESC</button>
          </div>
        </div>

        <div class="palette-results-container" id="palette-results-list" role="listbox">
          <!-- Dynamically populated -->
        </div>

        <div class="palette-footer">
          <div class="palette-footer-item">
            <kbd>↑</kbd> <kbd>↓</kbd> <span>Navigate</span>
          </div>
          <div class="palette-footer-item">
            <kbd>↵</kbd> <span>Execute Directive</span>
          </div>
          <div class="palette-footer-item">
            <kbd>ESC</kbd> <span>Dismiss</span>
          </div>
          <div class="palette-footer-badge">
            <span class="pulse-dot"></span> NEURAL PROTOCOL ACTIVE
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    this.input = document.getElementById('palette-search-input');
    this.resultsList = document.getElementById('palette-results-list');
    this.closeBtn = document.getElementById('palette-close-btn');

    this.renderResults();
  }

  renderResults() {
    if (!this.resultsList) return;
    this.resultsList.innerHTML = '';

    if (this.filteredCommands.length === 0) {
      this.resultsList.innerHTML = `
        <div class="palette-empty-state">
          <span class="empty-icon">⚠️</span>
          <div class="empty-title">NO DIRECTIVES FOUND</div>
          <div class="empty-sub">Try searching 'domain', 'projects', 'bankai', or 'github'</div>
        </div>
      `;
      return;
    }

    let lastCategory = '';

    this.filteredCommands.forEach((cmd, index) => {
      if (cmd.category !== lastCategory) {
        lastCategory = cmd.category;
        const catHeader = document.createElement('div');
        catHeader.className = 'palette-category-header';
        catHeader.innerText = `// ${lastCategory}`;
        this.resultsList.appendChild(catHeader);
      }

      const item = document.createElement('div');
      item.className = `palette-item ${index === this.selectedIndex ? 'selected' : ''}`;
      item.role = 'option';
      item.setAttribute('aria-selected', index === this.selectedIndex ? 'true' : 'false');
      item.dataset.index = index;

      item.innerHTML = `
        <div class="palette-item-left">
          <span class="palette-item-icon">${cmd.icon}</span>
          <div class="palette-item-text">
            <div class="palette-item-title">${cmd.title}</div>
            <div class="palette-item-desc">${cmd.desc}</div>
          </div>
        </div>
        <div class="palette-item-right">
          <kbd class="palette-shortcut">${cmd.shortcut}</kbd>
        </div>
      `;

      item.addEventListener('mouseenter', () => {
        this.selectedIndex = index;
        this.updateSelectionVisuals();
      });

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this.executeCommand(cmd);
      });

      this.resultsList.appendChild(item);
    });

    this.scrollSelectedIntoView();
  }

  updateSelectionVisuals() {
    const items = this.resultsList.querySelectorAll('.palette-item');
    items.forEach((item) => {
      const idx = parseInt(item.dataset.index, 10);
      if (idx === this.selectedIndex) {
        item.classList.add('selected');
        item.setAttribute('aria-selected', 'true');
      } else {
        item.classList.remove('selected');
        item.setAttribute('aria-selected', 'false');
      }
    });
  }

  scrollSelectedIntoView() {
    const selectedItem = this.resultsList.querySelector('.palette-item.selected');
    if (selectedItem) {
      selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.overlay.classList.add('active');
    this.overlay.setAttribute('aria-hidden', 'false');
    this.input.value = '';
    this.filteredCommands = [...this.commands];
    this.selectedIndex = 0;
    this.renderResults();

    sound.playPowerUp();
    setTimeout(() => {
      this.input.focus();
    }, 60);
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.overlay.classList.remove('active');
    this.overlay.setAttribute('aria-hidden', 'true');
    sound.playClick();
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  executeCommand(cmd) {
    this.close();
    try {
      cmd.action();
    } catch (err) {
      console.warn('Command execution error:', err);
    }
  }

  bindEvents() {
    // 1. Global Key Listener for Ctrl+K / Cmd+K / Esc
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        this.toggle();
        return;
      }

      if (this.isOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          this.close();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          sound.playKey();
          if (this.filteredCommands.length > 0) {
            this.selectedIndex = (this.selectedIndex + 1) % this.filteredCommands.length;
            this.updateSelectionVisuals();
            this.scrollSelectedIntoView();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          sound.playKey();
          if (this.filteredCommands.length > 0) {
            this.selectedIndex = (this.selectedIndex - 1 + this.filteredCommands.length) % this.filteredCommands.length;
            this.updateSelectionVisuals();
            this.scrollSelectedIntoView();
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (this.filteredCommands[this.selectedIndex]) {
            this.executeCommand(this.filteredCommands[this.selectedIndex]);
          }
        }
      }
    });

    // 2. Filter input changes
    this.input.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      sound.playKey();

      if (!query) {
        this.filteredCommands = [...this.commands];
      } else {
        this.filteredCommands = this.commands.filter((cmd) => {
          return (
            cmd.title.toLowerCase().includes(query) ||
            cmd.desc.toLowerCase().includes(query) ||
            cmd.category.toLowerCase().includes(query) ||
            cmd.shortcut.toLowerCase().includes(query)
          );
        });
      }

      this.selectedIndex = 0;
      this.renderResults();
    });

    // 3. Close on backdrop click
    this.overlay.addEventListener('click', (e) => {
      if (e.target.classList.contains('cyber-palette-backdrop') || e.target === this.overlay) {
        this.close();
      }
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // 4. Trigger button in navbar (if clicked)
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('#btn-open-palette, .btn-open-palette');
      if (trigger) {
        e.preventDefault();
        this.toggle();
      }
    });
  }
}

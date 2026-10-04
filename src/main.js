import './style.css';
import { Cyber3DScene } from './three-scene.js';
import { sound } from './sound.js';
import { InteractiveTerminal } from './terminal.js';
import { AppRouter } from './router.js';
import { animeFX } from './anime-effects.js';
import { SukunaCharacterEngine } from './sukuna-character.js';
import { AnimeCycleEngine } from './anime-cycle.js';
import { DEFAULT_GITHUB_DATA, fetchLiveGitHubData, forceSyncGitHub, formatTimeAgo, getProjectData, startRealtimeGitHubSync } from './github.js';
import confetti from 'canvas-confetti';

// Ensure browser always starts strictly at the top of the page on refresh or initial load
if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

window.addEventListener('load', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});

async function initApp() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  // 1. Initialize Multi-Page SPA Router
  const router = new AppRouter();

  // 2. Initialize 20-Second Autonomous Anime Manifestation Cycle
  const animeCycle = new AnimeCycleEngine({ intervalMs: 20000 });

  // 2. Initialize Sukuna Frameless Animated Character Engine (if present)
  let sukunaEngine = null;
  if (document.getElementById('sukuna-stage')) {
    sukunaEngine = new SukunaCharacterEngine('sukuna-stage');
  }

  // Sukuna Technique Trigger Buttons (if present)
  const sukunaTechBtns = document.querySelectorAll('.sukuna-action-pill[data-tech]');
  sukunaTechBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tech = btn.dataset.tech;
      sukunaEngine?.setTechnique?.(tech);
    });
  });

  // 3. Initialize Three.js 3D WebGL Scene
  try {
    new Cyber3DScene('webgl-container');
  } catch (err) {
    console.error('Three.js scene initialization error:', err);
  }

  // 4. Initialize Interactive Terminal
  new InteractiveTerminal('cyber-terminal');

  // 5. Mouse Spotlight Tracker
  const spotlight = document.getElementById('mouse-spotlight');
  if (spotlight) {
    window.addEventListener('mousemove', (e) => {
      spotlight.style.left = `${e.clientX}px`;
      spotlight.style.top = `${e.clientY}px`;
    });
  }

  // 5b. Sukuna Ambient Background Extension Controller & Parallax
  const bgToggleBtn = document.getElementById('bg-extension-toggle');
  const ambientBg = document.getElementById('sukuna-ambient-bg');
  const ambientWrap = document.querySelector('.sukuna-ambient-media-wrap');

  if (bgToggleBtn && ambientBg) {
    let bgActive = true;
    bgToggleBtn.addEventListener('click', () => {
      bgActive = !bgActive;
      sound.playPowerUp();
      if (bgActive) {
        ambientBg.classList.add('active');
        bgToggleBtn.classList.remove('muted');
        bgToggleBtn.classList.add('active');
        bgToggleBtn.innerHTML = '<span class="bg-toggle-icon">👁️</span><span class="bg-toggle-text">SUKUNA BG: ON</span>';
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.2 },
          colors: ['#ff0055', '#a855f7', '#ffffff']
        });
      } else {
        ambientBg.classList.remove('active');
        bgToggleBtn.classList.remove('active');
        bgToggleBtn.classList.add('muted');
        bgToggleBtn.innerHTML = '<span class="bg-toggle-icon">🕶️</span><span class="bg-toggle-text">SUKUNA BG: OFF</span>';
      }
    });
  }

  if (ambientWrap && window.innerWidth >= 768) {
    window.addEventListener('mousemove', (e) => {
      const deltaX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const deltaY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      ambientWrap.style.transform = `translate(calc(-50% + ${deltaX * 18}px), calc(-50% + ${deltaY * 14}px))`;
    });
  }

  // 6. Sound & Anime Aura Toggles
  const auraBtn = document.getElementById('aura-toggle');
  if (auraBtn) {
    auraBtn.addEventListener('click', () => {
      const active = animeFX.toggleAwakening();
      sound.playPowerUp();
      if (active) {
        auraBtn.innerHTML = '<span>🔥 AURA ACTIVE</span>';
        auraBtn.style.borderColor = '#ff0055';
        auraBtn.style.boxShadow = '0 0 20px #ff0055';
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.2 },
          colors: ['#00f0ff', '#ff0055', '#ffffff']
        });
      } else {
        auraBtn.innerHTML = '<span>⚡ AWAKEN AURA</span>';
        auraBtn.style.borderColor = '';
        auraBtn.style.boxShadow = '';
      }
    });
  }

  // 6b. Sound On/Off Toggle
  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundIndicator = document.getElementById('sound-indicator');
  const soundText = document.getElementById('sound-text');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      const active = sound.toggle();
      if (active) {
        if (soundText) soundText.innerText = 'SOUND: ON';
        if (soundIndicator) soundIndicator.classList.remove('muted');
        soundToggleBtn.classList.remove('muted');
        sound.playClick();
      } else {
        if (soundText) soundText.innerText = 'SOUND: OFF';
        if (soundIndicator) soundIndicator.classList.add('muted');
        soundToggleBtn.classList.add('muted');
      }
    });
  }

  // 7. Global Sound Effects
  function attachSoundEffects(elements) {
    elements.forEach((el) => {
      el.addEventListener('mouseenter', () => sound.playHover());
      el.addEventListener('click', () => sound.playClick());
    });
  }
  attachSoundEffects(document.querySelectorAll('button, .btn-primary, .btn-secondary, .nav-link, .filter-tab, .channel-btn, .vibe-pill, .dock-item'));

  // 8. 3D Tilt Card Physics Engine
  function applyTiltToCards(cards) {
    cards.forEach((card) => {
      const glare = card.querySelector('.card-glare');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -11;
        const rotateY = ((x - centerX) / centerX) * 11;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        if (glare) {
          glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 240, 255, 0.15) 0%, transparent 70%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }
  applyTiltToCards(document.querySelectorAll('.tilt-card'));

  // 9. Text Scrambler / Decrypt Effect
  const scrambleElements = document.querySelectorAll('.scramble-text');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

  function scramble(element) {
    const originalText = element.dataset.text || element.innerText;
    let iteration = 0;
    const interval = setInterval(() => {
      element.innerText = originalText
        .split('')
        .map((char, index) => {
          if (index < iteration) return originalText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= originalText.length) clearInterval(interval);
      iteration += 1 / 2;
    }, 25);
  }

  scrambleElements.forEach((el) => {
    el.dataset.text = el.innerText;
    scramble(el);
    el.addEventListener('mouseenter', () => scramble(el));
  });

  // 10. Magnetic Physics on CTA Buttons
  const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .brand-hex');
  magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px) scale(1.03)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px) scale(1)';
    });
  });

  // 11. LIVE GITHUB AUTO-SYNC & DYNAMIC POPULATION ENGINE
  const tickerText = document.getElementById('ticker-text');
  const repoMetric = document.getElementById('metric-repos');
  const projectsGrid = document.getElementById('projects-grid');
  const homeProjectsGrid = document.getElementById('home-featured-grid');
  const vaultRepoCountLabel = document.getElementById('vault-repo-count-label');
  const btnSyncTop = document.getElementById('btn-sync-github');
  const btnVaultRefresh = document.getElementById('btn-vault-refresh');

  let allProjectsData = [];

  function renderProjectsList(container, projects) {
    if (!container) return;
    container.innerHTML = '';

    projects.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'tilt-card project-card';
      card.dataset.category = p.category;

      const liveBtnHtml = p.liveUrl
        ? `<a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-card-link btn-card-live">
             <span>Launch Portal</span>
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
           </a>`
        : '';

      const tagsHtml = p.tags.map((t) => `<span class="tech-tag">${t}</span>`).join('');

      card.innerHTML = `
        <div class="card-glare"></div>
        <div>
          <div class="card-top">
            <div class="project-icon-box">${p.icon}</div>
            <span class="project-category-badge">${p.badge}</span>
          </div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.desc}</p>
          <div class="project-tags">
            ${tagsHtml}
            <span class="tech-tag" style="color:#00f0ff;">⚡ ${formatTimeAgo(p.updatedAt)}</span>
          </div>
        </div>
        <div class="project-links">
          ${liveBtnHtml}
          <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-card-link btn-card-code">
            <span>GitHub (${p.stars}★)</span>
          </a>
        </div>
      `;
      container.appendChild(card);
    });

    applyTiltToCards(container.querySelectorAll('.tilt-card'));
    attachSoundEffects(container.querySelectorAll('.btn-card-link, .tilt-card'));
  }

  function applyGitHubData(githubData) {
    if (!githubData || !githubData.user) return;

    const repoCount = githubData.repos ? githubData.repos.length : githubData.user.public_repos;
    if (repoMetric) {
      repoMetric.innerText = `${repoCount}+`;
    }

    if (vaultRepoCountLabel) {
      vaultRepoCountLabel.innerText = `SYNCED ${repoCount} REPOSITORIES DIRECTLY FROM GITHUB`;
    }

    if (tickerText && githubData.events && githubData.events.length > 0) {
      const pushEvent = githubData.events.find((e) => e.type === 'PushEvent') || githubData.events[0];
      if (pushEvent) {
        const repoShort = pushEvent.repo ? pushEvent.repo.name.replace('jitin-s/', '') : 'latest project';
        const timeAgo = formatTimeAgo(pushEvent.created_at);
        tickerText.innerHTML = `LIVE GITHUB PULSE: Pushed to <span class="ticker-highlight">${repoShort}</span> (${timeAgo}) • ${repoCount} REPOS ACTIVE`;
      }
    }

    if (githubData.repos && githubData.repos.length > 0) {
      allProjectsData = githubData.repos.map((repo) => getProjectData(repo));
      renderProjectsList(projectsGrid, allProjectsData);
      if (homeProjectsGrid) {
        renderProjectsList(homeProjectsGrid, allProjectsData.slice(0, 4));
      }
    }
  }

  // Load Initial Data
  try {
    const initialData = await fetchLiveGitHubData();
    applyGitHubData(initialData || DEFAULT_GITHUB_DATA);
  } catch (err) {
    console.warn('Initial GitHub data load note:', err);
    applyGitHubData(DEFAULT_GITHUB_DATA);
  }

  // Listen to background revalidation updates
  window.addEventListener('github-data-synced', (e) => {
    applyGitHubData(e.detail);
  });

  // Start Continuous 30-Second Real-Time GitHub Heartbeat Sync
  startRealtimeGitHubSync(30000, (freshData) => {
    applyGitHubData(freshData);
    sound.playSuccess();
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.1 },
      colors: ['#00f0ff', '#10b981', '#ffffff']
    });
    if (tickerText) {
      tickerText.innerHTML = `⚡ REALTIME SYNC: Detected new update • ${freshData.repos.length} Repositories Live`;
    }
  });

  // Manual Instant Sync Handler
  async function triggerManualSync(buttonEl) {
    if (!buttonEl) return;
    const syncIcon = buttonEl.querySelector('.sync-icon');
    if (syncIcon) syncIcon.classList.add('spinning');
    sound.playPowerUp();

    try {
      if (tickerText) tickerText.innerHTML = `SYNCING DIRECTLY WITH GITHUB API...`;
      const freshData = await forceSyncGitHub();
      applyGitHubData(freshData);
      sound.playSuccess();

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.1 },
        colors: ['#00f0ff', '#10b981', '#ffffff']
      });

      if (tickerText) {
        tickerText.innerHTML = `✅ SYNCED WITH GITHUB: <span class="ticker-highlight">${freshData.repos.length} REPOSITORIES UP TO DATE</span>`;
      }
    } catch (err) {
      console.error('Manual GitHub sync failed:', err);
      if (tickerText) tickerText.innerHTML = `SYNC NOTE: Rate limited or offline, cached data retained`;
    } finally {
      if (syncIcon) syncIcon.classList.remove('spinning');
    }
  }

  if (btnSyncTop) {
    btnSyncTop.addEventListener('click', () => triggerManualSync(btnSyncTop));
  }
  if (btnVaultRefresh) {
    btnVaultRefresh.addEventListener('click', () => triggerManualSync(btnVaultRefresh));
  }

  // 12. Projects Search Filter
  const searchInput = document.getElementById('project-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const cards = projectsGrid.querySelectorAll('.project-card');

      cards.forEach((card) => {
        const text = card.innerText.toLowerCase();
        if (text.includes(term)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // 13. Filter Tabs Handler
  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      const cards = projectsGrid.querySelectorAll('.project-card');

      cards.forEach((card) => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 14. Interactive Vibe Pills celebration
  const vibePills = document.querySelectorAll('.vibe-pill');
  vibePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      sound.playPowerUp();
      animeFX.triggerSpeedlines(700);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.35 },
        colors: ['#00f0ff', '#ff0055', '#ffffff']
      });
    });
  });

  // 15. Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.innerText = 'TRANSMITTING...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerText = 'TRANSMISSION DISPATCHED';
        if (formStatus) {
          formStatus.innerHTML = `<span style="color: #00f0ff; font-weight: 700;">✔ Signal received. Stand by for quantum uplink.</span>`;
        }
        sound.playPowerUp();
        animeFX.triggerSpeedlines(1200);
        confetti({
          particleCount: 160,
          spread: 90,
          origin: { y: 0.7 },
          colors: ['#00f0ff', '#ffffff', '#ff0055', '#a855f7']
        });
        contactForm.reset();
        setTimeout(() => {
          submitBtn.innerText = 'DISPATCH MESSAGE';
          submitBtn.disabled = false;
        }, 4000);
      }, 900);
    });
  }

  // 16. Copy Helper
  window.copyText = (text, btnElement) => {
    navigator.clipboard.writeText(text).then(() => {
      const original = btnElement.innerText;
      btnElement.innerText = 'COPIED!';
      btnElement.style.background = '#00f0ff';
      btnElement.style.color = '#08080c';
      sound.playSuccess();

      setTimeout(() => {
        btnElement.innerText = original;
        btnElement.style.background = '';
        btnElement.style.color = '';
      }, 2000);
    });
  };

  // 17. Back to Top
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Guaranteed launch regardless of script load timing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

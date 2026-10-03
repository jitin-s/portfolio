import './style.css';
import { Cyber3DScene } from './three-scene.js';
import { sound } from './sound.js';
import { InteractiveTerminal } from './terminal.js';
import { AppRouter } from './router.js';
import { animeFX } from './anime-effects.js';
import { SukunaCharacterEngine } from './sukuna-character.js';
import { fetchLiveGitHubData, formatTimeAgo, getProjectData } from './github.js';
import confetti from 'canvas-confetti';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize Multi-Page SPA Router
  const router = new AppRouter();

  // 2. Initialize Sukuna Frameless Character Engine
  const sukunaEngine = new SukunaCharacterEngine('sukuna-stage');

  // 2. Initialize Three.js 3D WebGL Scene
  try {
    new Cyber3DScene('webgl-container');
  } catch (err) {
    console.error('Three.js scene initialization error:', err);
  }

  // 3. Initialize Interactive Terminal
  new InteractiveTerminal('cyber-terminal');

  // 4. Mouse Spotlight Tracker
  const spotlight = document.getElementById('mouse-spotlight');
  if (spotlight) {
    window.addEventListener('mousemove', (e) => {
      spotlight.style.left = `${e.clientX}px`;
      spotlight.style.top = `${e.clientY}px`;
    });
  }

  // 5. Sound & Anime Aura Toggles
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

  // 6. RYOMEN SUKUNA INTERACTIVE ANIME ATTACKS & DIALOGUE
  const btnDismantle = document.getElementById('btn-dismantle');
  const btnDomain = document.getElementById('btn-domain');
  const sukunaDialogueBox = document.getElementById('sukuna-dialogue-box');
  const sukunaDialogueText = document.getElementById('sukuna-dialogue-text');

  const sukunaQuotes = [
    '"Stand proud, engineer. You are strong."',
    '"Throughout Heaven and Earth, I alone am the Honored One."',
    '"Know your place, fool. My domain spans across infinite clusters."',
    '"A battle between architects is a battle of domain refinement."',
    '"Dismantle or Cleave? Choose your deployment."'
  ];
  let quoteIdx = 0;

  if (sukunaDialogueBox && sukunaDialogueText) {
    sukunaDialogueBox.addEventListener('click', () => {
      quoteIdx = (quoteIdx + 1) % sukunaQuotes.length;
      sukunaDialogueText.innerText = sukunaQuotes[quoteIdx];
      sound.playPowerUp();
      animeFX.createSlashSparks(window.innerWidth * 0.7, window.innerHeight * 0.4);
    });
  }

  if (btnDismantle) {
    btnDismantle.addEventListener('click', () => {
      animeFX.triggerDismantleBarrage();
      sound.playLaserSlash();
      if (sukunaDialogueText) {
        sukunaDialogueText.innerText = '"Dismantle. Reality sliced clean."';
      }
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.4 },
        colors: ['#ff0055', '#ffffff', '#111111']
      });
    });
  }

  if (btnDomain) {
    btnDomain.addEventListener('click', () => {
      animeFX.triggerMalevolentShrine();
      sound.playPowerUp();
      if (sukunaDialogueText) {
        sukunaDialogueText.innerText = '"Domain Expansion: Malevolent Shrine!"';
      }
      confetti({
        particleCount: 180,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#ff0055', '#a855f7', '#00f0ff', '#ffffff']
      });
    });
  }

  // 6. Global Sound Effects
  function attachSoundEffects(elements) {
    elements.forEach((el) => {
      el.addEventListener('mouseenter', () => sound.playHover());
      el.addEventListener('click', () => sound.playClick());
    });
  }
  attachSoundEffects(document.querySelectorAll('button, .btn-primary, .btn-secondary, .nav-link, .filter-tab, .channel-btn, .vibe-pill, .dock-item'));

  // 7. 3D Tilt Card Physics Engine
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

  // 8. Text Scrambler / Decrypt Effect
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

  // 9. Magnetic Physics on CTA Buttons
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

  // 10. LIVE GITHUB AUTO-SYNC & DYNAMIC POPULATION
  const tickerText = document.getElementById('ticker-text');
  const repoMetric = document.getElementById('metric-repos');
  const projectsGrid = document.getElementById('projects-grid');
  const homeProjectsGrid = document.getElementById('home-featured-grid');

  let allProjectsData = [];

  try {
    const githubData = await fetchLiveGitHubData();

    if (githubData && githubData.user) {
      if (repoMetric) {
        repoMetric.innerText = `${githubData.user.public_repos || 11}+`;
      }

      if (tickerText && githubData.events && githubData.events.length > 0) {
        const pushEvent = githubData.events.find((e) => e.type === 'PushEvent') || githubData.events[0];
        if (pushEvent) {
          const repoShort = pushEvent.repo ? pushEvent.repo.name.replace('jitin-s/', '') : 'latest project';
          const timeAgo = formatTimeAgo(pushEvent.created_at);
          tickerText.innerHTML = `LIVE GITHUB PULSE: Pushed to <span class="ticker-highlight">${repoShort}</span> (${timeAgo}) • 100% OPERATIONAL`;
        }
      }

      if (githubData.repos && githubData.repos.length > 0) {
        allProjectsData = githubData.repos.map((repo) => getProjectData(repo));

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

        renderProjectsList(projectsGrid, allProjectsData);
        if (homeProjectsGrid) {
          renderProjectsList(homeProjectsGrid, allProjectsData.slice(0, 4));
        }
      }
    }
  } catch (err) {
    console.warn('Live GitHub sync error:', err);
  }

  // 11. Projects Search Filter
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

  // 12. Filter Tabs Handler
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

  // 13. Interactive Vibe Pills celebration
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

  // 14. Contact Form Submission
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

  // 15. Copy Helper
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

  // 16. Back to Top
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

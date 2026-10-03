import './style.css';
import { Cyber3DScene } from './three-scene.js';
import { sound } from './sound.js';
import { InteractiveTerminal } from './terminal.js';
import { fetchLiveGitHubData, formatTimeAgo, getProjectData } from './github.js';
import confetti from 'canvas-confetti';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize Three.js 3D WebGL Scene
  try {
    new Cyber3DScene('webgl-container');
  } catch (err) {
    console.error('Three.js scene initialization error:', err);
  }

  // 2. Initialize Interactive Terminal
  new InteractiveTerminal('cyber-terminal');

  // 3. Mouse Spotlight Tracker
  const spotlight = document.getElementById('mouse-spotlight');
  if (spotlight) {
    window.addEventListener('mousemove', (e) => {
      spotlight.style.left = `${e.clientX}px`;
      spotlight.style.top = `${e.clientY}px`;
    });
  }

  // 4. Sound Toggle
  const soundBtn = document.getElementById('sound-toggle');
  const soundInd = document.getElementById('sound-indicator');
  const soundText = document.getElementById('sound-text');

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const active = sound.toggle();
      if (active) {
        soundInd.classList.remove('muted');
        soundText.textContent = 'SOUND: ON';
        sound.playSuccess();
      } else {
        soundInd.classList.add('muted');
        soundText.textContent = 'SOUND: OFF';
      }
    });
  }

  // 5. Sound effects for interactive elements
  function attachSoundEffects(elements) {
    elements.forEach((el) => {
      el.addEventListener('mouseenter', () => sound.playHover());
      el.addEventListener('click', () => sound.playClick());
    });
  }
  attachSoundEffects(document.querySelectorAll('button, .btn-primary, .btn-secondary, .nav-link, .filter-tab, .channel-btn, .vibe-pill'));

  // 6. 3D Tilt Card Physics Engine
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
          glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.12) 0%, transparent 70%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }
  applyTiltToCards(document.querySelectorAll('.tilt-card'));

  // 7. Text Scrambler / Decrypt Effect
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

  // 8. Magnetic Physics on CTA Buttons (Gen-Z micro-interaction)
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

  // 9. LIVE GITHUB AUTO-SYNC & DYNAMIC POPULATION
  const tickerText = document.getElementById('ticker-text');
  const repoMetric = document.getElementById('metric-repos');
  const projectsGrid = document.getElementById('projects-grid');

  try {
    const githubData = await fetchLiveGitHubData();

    if (githubData && githubData.user) {
      // Update Real-Time Metric
      if (repoMetric) {
        repoMetric.innerText = `${githubData.user.public_repos || 11}+`;
        repoMetric.dataset.target = githubData.user.public_repos || 11;
      }

      // Update Ticker with latest commit / push event
      if (tickerText && githubData.events && githubData.events.length > 0) {
        const pushEvent = githubData.events.find((e) => e.type === 'PushEvent') || githubData.events[0];
        if (pushEvent) {
          const repoShort = pushEvent.repo ? pushEvent.repo.name.replace('jitin-s/', '') : 'latest project';
          const timeAgo = formatTimeAgo(pushEvent.created_at);
          tickerText.innerHTML = `LIVE GITHUB PULSE: Pushed to <span class="ticker-highlight">${repoShort}</span> (${timeAgo}) • 100% OPERATIONAL`;
        }
      }

      // Dynamically Render Projects from GitHub API
      if (projectsGrid && githubData.repos && githubData.repos.length > 0) {
        projectsGrid.innerHTML = ''; // Fresh dynamic render from live GitHub!

        githubData.repos.forEach((repo) => {
          const p = getProjectData(repo);

          const card = document.createElement('div');
          card.className = 'tilt-card project-card';
          card.dataset.category = p.category;

          const liveBtnHtml = p.liveUrl
            ? `<a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-card-link btn-card-live">
                 <span>Live Console</span>
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
                <span class="tech-tag" style="color:#38bdf8;">⚡ ${formatTimeAgo(p.updatedAt)}</span>
              </div>
            </div>
            <div class="project-links">
              ${liveBtnHtml}
              <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-card-link btn-card-code">
                <span>GitHub (${p.stars}★)</span>
              </a>
            </div>
          `;

          projectsGrid.appendChild(card);
        });

        // Re-apply tilt physics and sound to newly rendered cards
        applyTiltToCards(projectsGrid.querySelectorAll('.tilt-card'));
        attachSoundEffects(projectsGrid.querySelectorAll('.btn-card-link, .tilt-card'));
      }
    }
  } catch (err) {
    console.warn('Live GitHub sync error:', err);
  }

  // 10. Filter Tabs Handler
  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      const cards = document.querySelectorAll('.project-card');

      cards.forEach((card) => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'perspective(1000px) scale(1)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'perspective(1000px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 11. Interactive Vibe Pills celebration
  const vibePills = document.querySelectorAll('.vibe-pill');
  vibePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      sound.playSuccess();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.3 },
        colors: ['#38bdf8', '#c084fc', '#ffffff']
      });
    });
  });

  // 12. Contact Form & Celebration
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
          formStatus.innerHTML = `<span style="color: #34d399;">✔ Signal received. Stand by for quantum uplink.</span>`;
        }
        sound.playSuccess();
        confetti({
          particleCount: 160,
          spread: 90,
          origin: { y: 0.7 },
          colors: ['#cbd5e1', '#ffffff', '#64748b', '#38bdf8']
        });
        contactForm.reset();
        setTimeout(() => {
          submitBtn.innerText = 'DISPATCH MESSAGE';
          submitBtn.disabled = false;
        }, 4000);
      }, 900);
    });
  }

  // 13. Copy Helper
  window.copyText = (text, btnElement) => {
    navigator.clipboard.writeText(text).then(() => {
      const original = btnElement.innerText;
      btnElement.innerText = 'COPIED!';
      btnElement.style.background = '#10b981';
      btnElement.style.color = '#ffffff';
      sound.playSuccess();

      setTimeout(() => {
        btnElement.innerText = original;
        btnElement.style.background = '';
        btnElement.style.color = '';
      }, 2000);
    });
  };

  // 14. Back to Top
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

import './style.css';
import { Cyber3DScene } from './three-scene.js';
import { sound } from './sound.js';
import { InteractiveTerminal } from './terminal.js';
import confetti from 'canvas-confetti';

document.addEventListener('DOMContentLoaded', () => {
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

  // 5. Global Cyber Sound Bindings for interactive elements
  const interactiveElements = document.querySelectorAll(
    'button, .btn-primary, .btn-secondary, .btn-card-link, .nav-link, .filter-tab, .channel-btn, .tilt-card'
  );
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => sound.playHover());
    el.addEventListener('click', () => sound.playClick());
  });

  // 6. 3D Tilt Card Physics Engine
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach((card) => {
    const glare = card.querySelector('.card-glare');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      if (glare) {
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.12) 0%, transparent 70%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

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
          if (index < iteration) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= originalText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, 28);
  }

  scrambleElements.forEach((el) => {
    el.dataset.text = el.innerText;
    scramble(el);
    el.addEventListener('mouseenter', () => scramble(el));
  });

  // 8. Projects Category Filter
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      projectCards.forEach((card) => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'perspective(1000px) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'perspective(1000px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 9. Contact Form Handling & Celebration
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
          particleCount: 150,
          spread: 90,
          origin: { y: 0.7 },
          colors: ['#cbd5e1', '#ffffff', '#64748b', '#38bdf8']
        });
        contactForm.reset();
        setTimeout(() => {
          submitBtn.innerText = 'DISPATCH MESSAGE';
          submitBtn.disabled = false;
        }, 4000);
      }, 1000);
    });
  }

  // 10. Copy Channels
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

  // 11. Back to Top
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 12. Animated Counter on Intersection
  const counters = document.querySelectorAll('.metric-value');
  let counted = false;

  const handleIntersect = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        counters.forEach((c) => {
          const target = +c.dataset.target;
          let current = 0;
          const step = Math.max(1, Math.floor(target / 40));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              c.innerText = `${target}+`;
              clearInterval(timer);
            } else {
              c.innerText = `${current}+`;
            }
          }, 30);
        });
        observer.disconnect();
      }
    });
  };

  const observer = new IntersectionObserver(handleIntersect, { threshold: 0.5 });
  const metricsSection = document.querySelector('.hero-metrics');
  if (metricsSection) observer.observe(metricsSection);
});

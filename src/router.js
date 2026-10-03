// Multi-Page SPA Router with Anime Transitions & History Support
import { animeFX } from './anime-effects.js';
import { sound } from './sound.js';

export class AppRouter {
  constructor() {
    this.pages = ['home', 'projects', 'arsenal', 'trajectory', 'terminal', 'transmission'];
    this.currentPage = 'home';
    this.pageElements = {};

    this.init();
  }

  init() {
    this.pages.forEach((p) => {
      this.pageElements[p] = document.getElementById(`page-${p}`);
    });

    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
    this.bindNavLinks();
  }

  handleRoute() {
    const hash = window.location.hash.replace('#/', '').replace('#', '').trim().toLowerCase();
    const targetPage = this.pages.includes(hash) ? hash : 'home';
    this.navigateTo(targetPage, false);
  }

  navigateTo(pageName, updateHash = true) {
    if (!this.pages.includes(pageName)) pageName = 'home';
    if (pageName === this.currentPage && document.querySelector(`.page-view.active`)) return;

    // Only trigger Anime Laser Slash & Speedlines cut on user-initiated route transitions
    if (updateHash) {
      try {
        sound?.playLaserSlash?.();
        animeFX?.triggerLaserSlash?.(400);
        animeFX?.triggerSpeedlines?.(500);
      } catch (e) {
        console.warn('Anime FX transition note:', e);
      }
    }

    // Hide old page, show new page
    this.pages.forEach((p) => {
      const el = this.pageElements[p];
      if (el) {
        if (p === pageName) {
          el.classList.add('active');
          el.style.display = 'block';
          // Trigger entry cut animation
          el.style.animation = 'none';
          el.offsetHeight; // trigger reflow
          el.style.animation = 'animePageIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        } else {
          el.classList.remove('active');
          el.style.display = 'none';
        }
      }
    });

    this.currentPage = pageName;
    if (updateHash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.location.hash = `#/${pageName}`;
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    this.updateActiveNav(pageName);
  }

  updateActiveNav(pageName) {
    document.querySelectorAll('[data-route]').forEach((link) => {
      const route = link.dataset.route;
      if (route === pageName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  bindNavLinks() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-route]');
      if (target) {
        e.preventDefault();
        const route = target.dataset.route;
        this.navigateTo(route, true);
      }
    });
  }
}

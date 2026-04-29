// Utility functions for frontend interactions

export function smoothScrollToTarget(targetId, offset = 70) {
  const el = document.getElementById(targetId) || document.querySelector(targetId);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: 'smooth'
  });
}

// Passive touch event listener support
export const passiveOption = (() => {
  let supportsPassive = false;
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get() { supportsPassive = true; return true; }
    });
    window.addEventListener('testPassive', null, opts);
    window.removeEventListener('testPassive', null, opts);
  } catch (e) {}
  return supportsPassive ? { passive: true } : false;
})();

// Filter Tablist Keyboard Arrow Navigation
export function initFilterTabA11y() {
  const tabs = Array.from(document.querySelectorAll('.filter-tab[role="tab"]'));
  tabs.forEach((tab, idx) => {
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = tabs[(idx + 1) % tabs.length];
        next.focus();
        next.click();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
        prev.focus();
        prev.click();
      }
    });
  });
}

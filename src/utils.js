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

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

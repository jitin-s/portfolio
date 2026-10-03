// Live GitHub Real-Time Data & Auto-Sync Engine for @jitin-s
const USERNAME = 'jitin-s';
const CACHE_KEY = 'jitin_github_data_v2';
const CACHE_TTL = 30 * 1000; // 30 seconds cache TTL for super fresh updates

// Curated metadata enrichment for recognized repos
const REPO_METADATA = {
  'portfolio-': {
    title: 'Cyber 3D Portfolio (Live)',
    category: 'web',
    badge: 'Flagship 3D',
    icon: '🌌',
    desc: 'GenZ aesthetic 3D dark anime portfolio with real-time GitHub sync, Three.js WebGL, and Sukuna interactive animations.',
    liveUrl: 'https://jitin-portfolio.vercel.app',
    tags: ['Vite', 'Three.js', 'Sukuna FX', 'Vercel']
  },
  'jitin-s': {
    title: 'Core Architect Matrix',
    category: 'web',
    badge: 'Identity Hub',
    icon: '👤',
    desc: 'Public developer identity, configuration matrix, and developer portfolio hub on GitHub.',
    liveUrl: 'https://github.com/jitin-s',
    tags: ['Profile README', 'GitHub Actions', 'Markdown']
  },
  DisasterLens: {
    title: 'DisasterLens',
    category: 'ai',
    badge: 'AI Intelligence',
    icon: '⚡',
    desc: 'National AI Multi-Hazard Predictive Intelligence & Real-Time Emergency Command Portal.',
    liveUrl: 'https://disasterlenss.streamlit.app/',
    tags: ['Python', 'Streamlit', 'Predictive AI', 'Geospatial']
  },
  SetuXAI_Bot: {
    title: 'SetuXAI Bot',
    category: 'ai',
    badge: 'Agentic AI',
    icon: '🧠',
    desc: 'Intelligent autonomous AI agent and interactive bridge for system queries and automation.',
    liveUrl: 'https://setuxai.vercel.app',
    tags: ['Python', 'LLM Agents', 'Vercel', 'AI Bot']
  },
  'SETUx-': {
    title: 'SetuX Protocol',
    category: 'security',
    badge: 'Interoperability',
    icon: '🔗',
    desc: 'Secure interoperability layer connecting legacy systems with modern decentralized APIs.',
    liveUrl: 'https://setuxai.vercel.app',
    tags: ['TypeScript', 'Interoperability', 'API Gateway']
  },
  'Agniveer-Sentinel': {
    title: 'Agniveer Sentinel',
    category: 'security',
    badge: 'Cyber Defense',
    icon: '🛡️',
    desc: 'Autonomous Guard Network for Intelligent Vigilance & Electronic Network Threat Neutralization.',
    liveUrl: null,
    tags: ['Python', 'Threat Intel', 'Cyber AI', 'MIT']
  },
  ngl: {
    title: 'ngl — Anonymous Social Feed',
    category: 'web',
    badge: 'Full Stack',
    icon: '💬',
    desc: 'Next-gen high-throughput anonymous feedback and social messaging platform.',
    liveUrl: 'https://ngl-jitin-io.vercel.app',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel']
  },
  MuscleHut: {
    title: 'MuscleHut',
    category: 'web',
    badge: 'Web App',
    icon: '🏋️',
    desc: 'Aesthetic modern gym & fitness web platform featuring workout scheduling and membership tiers.',
    liveUrl: 'https://musclehut-nine.vercel.app',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Vercel']
  },
  'Payments-Without-Internet': {
    title: 'Flowpay — Offline Payments',
    category: 'security',
    badge: 'P2P Protocol',
    icon: '📶',
    desc: 'Offline encrypted digital transaction infrastructure enabling verified peer-to-peer settlements.',
    liveUrl: null,
    tags: ['Cryptography', 'Mesh P2P', 'Offline Sync', 'Apache-2.0']
  },
  TapSOS: {
    title: 'TapSOS',
    category: 'mobile',
    badge: 'Mobile / Safety',
    icon: '🚨',
    desc: 'Instant tactile emergency distress beacon broadcasting real-time GPS telemetry.',
    liveUrl: null,
    tags: ['Flutter', 'Dart', 'GPS Telemetry', 'Mobile']
  },
  SmartDealsHub: {
    title: 'SmartDealsHub',
    category: 'web',
    badge: 'Automation',
    icon: '🛒',
    desc: 'Real-time e-commerce aggregator scraping live flash discounts and electronics pricing.',
    liveUrl: 'https://smartdealshub.vercel.app',
    tags: ['Python', 'Web Scraping', 'Automation', 'Vercel']
  },
  demo: {
    title: 'Interactive Web Prototype',
    category: 'web',
    badge: 'Prototype',
    icon: '🧪',
    desc: 'Full-stack experimental reactive interface and architectural prototype.',
    liveUrl: null,
    tags: ['TypeScript', 'Vite', 'React']
  }
};

// Raw network fetcher with cache-busting
export async function fetchFreshFromGitHub() {
  const cacheBuster = `_t=${Date.now()}`;
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache'
  };

  const [userRes, reposRes, eventsRes] = await Promise.all([
    fetch(`https://api.github.com/users/${USERNAME}?${cacheBuster}`, { cache: 'no-store', headers }),
    fetch(`https://api.github.com/users/${USERNAME}/repos?sort=pushed&per_page=100&${cacheBuster}`, { cache: 'no-store', headers }),
    fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=15&${cacheBuster}`, { cache: 'no-store', headers })
  ]);

  if (!userRes.ok || !reposRes.ok) {
    throw new Error(`GitHub API responded with status ${userRes.status}/${reposRes.status}`);
  }

  const userData = await userRes.json();
  const reposData = await reposRes.json();
  const eventsData = eventsRes.ok ? await eventsRes.json() : [];

  const data = {
    user: userData,
    repos: Array.isArray(reposData) ? reposData : [],
    events: Array.isArray(eventsData) ? eventsData : []
  };

  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ timestamp: Date.now(), data })
  );

  return data;
}

// Background revalidation
function triggerBackgroundRevalidation(currentData) {
  fetchFreshFromGitHub()
    .then((freshData) => {
      // Check if data changed
      const oldRepoCount = currentData?.repos?.length || 0;
      const newRepoCount = freshData?.repos?.length || 0;
      const oldLatest = currentData?.repos?.[0]?.pushed_at;
      const newLatest = freshData?.repos?.[0]?.pushed_at;

      if (oldRepoCount !== newRepoCount || oldLatest !== newLatest) {
        console.log(`[GitHub Sync] Detected fresh data: ${newRepoCount} repos (was ${oldRepoCount})`);
        window.dispatchEvent(new CustomEvent('github-data-synced', { detail: freshData }));
      }
    })
    .catch((err) => {
      console.warn('[GitHub Sync] Background revalidation note:', err.message);
    });
}

// Main fetch with Stale-While-Revalidate pattern
export async function fetchLiveGitHubData() {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      // Immediately start background revalidation so user never gets stuck with old data
      triggerBackgroundRevalidation(parsed.data);

      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        return parsed.data;
      }
    } catch (e) {}
  }

  try {
    const data = await fetchFreshFromGitHub();
    return data;
  } catch (err) {
    console.warn('GitHub Live Sync fallback to cache if available:', err);
    if (cached) {
      try {
        return JSON.parse(cached).data;
      } catch (e) {}
    }
    return null;
  }
}

// Explicit Force Refresh (triggered by Sync button)
export async function forceSyncGitHub() {
  localStorage.removeItem(CACHE_KEY);
  const data = await fetchFreshFromGitHub();
  window.dispatchEvent(new CustomEvent('github-data-synced', { detail: data }));
  return data;
}

// Real-Time Background Heartbeat Sync Engine (Auto-polls GitHub every 30s)
let realtimeSyncTimer = null;
let lastKnownState = {
  repoCount: 0,
  latestPush: null
};

export function startRealtimeGitHubSync(intervalMs = 30000, onUpdate = null) {
  if (realtimeSyncTimer) clearInterval(realtimeSyncTimer);

  const check = async () => {
    try {
      const freshData = await fetchFreshFromGitHub();
      const newRepoCount = freshData.repos.length;
      const newLatestPush = freshData.repos[0]?.pushed_at;

      const hasChanged = 
        lastKnownState.repoCount !== 0 && 
        (lastKnownState.repoCount !== newRepoCount || lastKnownState.latestPush !== newLatestPush);

      lastKnownState.repoCount = newRepoCount;
      lastKnownState.latestPush = newLatestPush;

      if (hasChanged) {
        console.log(`[GitHub Realtime Pulse] Update detected! New repos: ${newRepoCount}`);
        window.dispatchEvent(new CustomEvent('github-data-synced', { detail: freshData }));
        if (typeof onUpdate === 'function') onUpdate(freshData);
      }
    } catch (e) {
      console.warn('[GitHub Realtime Pulse] Offline or rate-limited, will retry in 30s:', e.message);
    }
  };

  realtimeSyncTimer = setInterval(check, intervalMs);

  // Auto pause/resume when tab changes
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      check(); // Check immediately when returning to tab
    }
  });

  return () => clearInterval(realtimeSyncTimer);
}

export function formatTimeAgo(dateString) {
  if (!dateString) return 'recently';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function getProjectData(repo) {
  const custom = REPO_METADATA[repo.name] || {};
  return {
    name: repo.name,
    title: custom.title || repo.name.replace(/[-_]/g, ' '),
    category: custom.category || (repo.language === 'Python' ? 'ai' : 'web'),
    badge: custom.badge || repo.language || 'Codebase',
    icon: custom.icon || '🚀',
    desc: custom.desc || repo.description || 'Open source architecture and system codebase on GitHub.',
    liveUrl: custom.liveUrl || repo.homepage || null,
    githubUrl: repo.html_url,
    tags: custom.tags || [repo.language || 'Code', 'Open Source', `${repo.stargazers_count || 0}★`],
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: repo.pushed_at || repo.updated_at
  };
}

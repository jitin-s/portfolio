// Live GitHub Real-Time Data & Auto-Sync Engine for @jitin-s
const USERNAME = 'jitin-s';
const CACHE_KEY = 'jitin_github_data_v3';
const CACHE_TTL = 30 * 1000; // 30 seconds cache TTL for super fresh updates

// Complete verified default data for @jitin-s so the UI is 100% operational immediately
export const DEFAULT_GITHUB_DATA = {
  user: {
    login: 'jitin-s',
    name: 'Jitin Sain',
    public_repos: 12,
    avatar_url: 'https://avatars.githubusercontent.com/u/96179621?v=4',
    html_url: 'https://github.com/jitin-s',
    bio: 'Full Stack & AI Systems Architect',
    followers: 5,
    following: 6
  },
  repos: [
    {
      name: 'portfolio',
      description: 'GenZ aesthetic 3D dark anime portfolio with real-time GitHub sync, Three.js WebGL, and Sukuna interactive animations.',
      stargazers_count: 1,
      forks_count: 0,
      language: 'JavaScript',
      html_url: 'https://github.com/jitin-s/portfolio',
      homepage: 'https://jitinsain.vercel.app',
      pushed_at: '2026-10-03T17:30:45Z',
      updated_at: '2026-10-03T17:30:45Z'
    },
    {
      name: 'DisasterLens',
      description: 'National AI Multi-Hazard Predictive Intelligence & Real-Time Emergency Command Portal.',
      stargazers_count: 1,
      forks_count: 0,
      language: 'Python',
      html_url: 'https://github.com/jitin-s/DisasterLens',
      homepage: 'https://disasterlenss.streamlit.app/',
      pushed_at: '2026-10-01T18:07:09Z',
      updated_at: '2026-10-01T18:07:09Z'
    },
    {
      name: 'SetuXAI_Bot',
      description: 'Intelligent autonomous AI agent and interactive bridge for system queries and automation.',
      stargazers_count: 1,
      forks_count: 0,
      language: 'Python',
      html_url: 'https://github.com/jitin-s/SetuXAI_Bot',
      homepage: 'https://setuxai.vercel.app',
      pushed_at: '2026-10-01T18:08:36Z',
      updated_at: '2026-10-01T18:08:36Z'
    },
    {
      name: 'Agniveer-Sentinel',
      description: 'Autonomous Guard Network for Intelligent Vigilance & Electronic Network Threat Neutralization.',
      stargazers_count: 1,
      forks_count: 0,
      language: 'Python',
      html_url: 'https://github.com/jitin-s/Agniveer-Sentinel',
      homepage: null,
      pushed_at: '2026-10-01T17:59:59Z',
      updated_at: '2026-10-01T17:59:59Z'
    },
    {
      name: 'ngl',
      description: 'Next-gen high-throughput anonymous feedback and social messaging platform.',
      stargazers_count: 1,
      forks_count: 0,
      language: 'TypeScript',
      html_url: 'https://github.com/jitin-s/ngl',
      homepage: 'https://ngl-jitin-io.vercel.app',
      pushed_at: '2026-09-30T16:46:44Z',
      updated_at: '2026-09-30T16:46:44Z'
    },
    {
      name: 'MuscleHut',
      description: 'Aesthetic modern gym & fitness web platform featuring workout scheduling and membership tiers.',
      stargazers_count: 1,
      forks_count: 0,
      language: 'HTML',
      html_url: 'https://github.com/jitin-s/MuscleHut',
      homepage: 'https://musclehutt.vercel.app',
      pushed_at: '2026-10-02T17:49:22Z',
      updated_at: '2026-10-02T17:49:22Z'
    },
    {
      name: 'TapSOS',
      description: 'Instant tactile emergency distress beacon broadcasting real-time GPS telemetry.',
      stargazers_count: 1,
      forks_count: 0,
      language: 'Dart',
      html_url: 'https://github.com/jitin-s/TapSOS',
      homepage: null,
      pushed_at: '2026-09-26T09:39:29Z',
      updated_at: '2026-09-26T09:39:29Z'
    },
    {
      name: 'Payments-Without-Internet',
      description: 'Offline encrypted digital transaction infrastructure enabling verified peer-to-peer settlements.',
      stargazers_count: 1,
      forks_count: 0,
      language: 'Python',
      html_url: 'https://github.com/jitin-s/Payments-Without-Internet',
      homepage: null,
      pushed_at: '2026-09-18T15:09:01Z',
      updated_at: '2026-09-18T15:09:01Z'
    },
    {
      name: 'SETUx-',
      description: 'Secure interoperability layer connecting legacy systems with modern decentralized APIs.',
      stargazers_count: 1,
      forks_count: 0,
      language: 'TypeScript',
      html_url: 'https://github.com/jitin-s/SETUx-',
      homepage: 'https://setuxai.vercel.app',
      pushed_at: '2026-09-08T14:49:11Z',
      updated_at: '2026-09-08T14:49:11Z'
    },
    {
      name: 'SmartDealsHub',
      description: 'Real-time e-commerce aggregator scraping live flash discounts and electronics pricing.',
      stargazers_count: 1,
      forks_count: 0,
      language: 'Python',
      html_url: 'https://github.com/jitin-s/SmartDealsHub',
      homepage: 'https://smartdealshub.vercel.app',
      pushed_at: '2026-09-25T18:23:58Z',
      updated_at: '2026-09-25T18:23:58Z'
    },
    {
      name: 'jitin-s',
      description: 'Public developer identity, configuration matrix, and developer portfolio hub on GitHub.',
      stargazers_count: 1,
      forks_count: 0,
      language: 'Markdown',
      html_url: 'https://github.com/jitin-s/jitin-s',
      homepage: 'https://github.com/jitin-s',
      pushed_at: '2026-10-03T16:20:32Z',
      updated_at: '2026-10-03T16:20:32Z'
    },
    {
      name: 'demo',
      description: 'Interactive experimental reactive interface and architectural prototype.',
      stargazers_count: 1,
      forks_count: 0,
      language: 'TypeScript',
      html_url: 'https://github.com/jitin-s/demo',
      homepage: 'https://demo-jitin-io.vercel.app',
      pushed_at: '2026-09-24T16:59:31Z',
      updated_at: '2026-09-24T16:59:31Z'
    }
  ],
  events: [
    {
      type: 'PushEvent',
      repo: { name: 'jitin-s/portfolio' },
      created_at: new Date().toISOString()
    }
  ]
};

// Curated metadata enrichment for recognized repos
const REPO_METADATA = {
  portfolio: {
    title: 'Cyber 3D Portfolio (Live)',
    category: 'web',
    badge: 'Flagship 3D',
    icon: '🌌',
    desc: 'GenZ aesthetic 3D dark anime portfolio with real-time GitHub sync, Three.js WebGL, and Sukuna interactive animations.',
    liveUrl: 'https://jitinsain.vercel.app',
    tags: ['Vite', 'Three.js', 'Sukuna FX', 'Vercel']
  },
  'portfolio-': {
    title: 'Cyber 3D Portfolio (Live)',
    category: 'web',
    badge: 'Flagship 3D',
    icon: '🌌',
    desc: 'GenZ aesthetic 3D dark anime portfolio with real-time GitHub sync, Three.js WebGL, and Sukuna interactive animations.',
    liveUrl: 'https://jitinsain.vercel.app',
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
    liveUrl: 'https://musclehutt.vercel.app',
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
    liveUrl: 'https://demo-jitin-io.vercel.app',
    tags: ['TypeScript', 'Vite', 'React']
  }
};

// Safe GitHub network fetcher without forbidden CORS preflight headers
export async function fetchFreshFromGitHub() {
  const cacheBuster = `_t=${Date.now()}`;
  const headers = {
    Accept: 'application/vnd.github.v3+json'
  };

  // Promise.allSettled guarantees that failure or rate limiting of any single endpoint
  // never causes the entire dataset to be rejected
  const [userResult, reposResult, eventsResult] = await Promise.allSettled([
    fetch(`https://api.github.com/users/${USERNAME}?${cacheBuster}`, { headers }).then((res) => {
      if (!res.ok) throw new Error(`User API HTTP ${res.status}`);
      return res.json();
    }),
    fetch(`https://api.github.com/users/${USERNAME}/repos?sort=pushed&per_page=100&${cacheBuster}`, { headers }).then((res) => {
      if (!res.ok) throw new Error(`Repos API HTTP ${res.status}`);
      return res.json();
    }),
    fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=15&${cacheBuster}`, { headers }).then((res) => {
      if (!res.ok) throw new Error(`Events API HTTP ${res.status}`);
      return res.json();
    })
  ]);

  // Read existing cache as fallback if needed
  let existingCacheData = null;
  try {
    const rawCache = localStorage.getItem(CACHE_KEY);
    if (rawCache) existingCacheData = JSON.parse(rawCache)?.data;
  } catch (e) {}

  const fallbackUser = existingCacheData?.user || DEFAULT_GITHUB_DATA.user;
  const fallbackRepos = existingCacheData?.repos || DEFAULT_GITHUB_DATA.repos;
  const fallbackEvents = existingCacheData?.events || DEFAULT_GITHUB_DATA.events;

  const userData = userResult.status === 'fulfilled' ? userResult.value : fallbackUser;
  const reposData =
    reposResult.status === 'fulfilled' && Array.isArray(reposResult.value) && reposResult.value.length > 0
      ? reposResult.value
      : fallbackRepos;
  const eventsData =
    eventsResult.status === 'fulfilled' && Array.isArray(eventsResult.value)
      ? eventsResult.value
      : fallbackEvents;

  const data = {
    user: userData,
    repos: reposData,
    events: eventsData,
    isLive: reposResult.status === 'fulfilled'
  };

  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), data })
    );
  } catch (e) {}

  return data;
}

// Background revalidation
function triggerBackgroundRevalidation(currentData) {
  fetchFreshFromGitHub()
    .then((freshData) => {
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

// Main fetch with Stale-While-Revalidate pattern and guaranteed non-null fallback
export async function fetchLiveGitHubData() {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      // Immediately start background revalidation
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
    console.warn('GitHub Live Sync fallback to cache/defaults:', err);
    if (cached) {
      try {
        return JSON.parse(cached).data;
      } catch (e) {}
    }
    return DEFAULT_GITHUB_DATA;
  }
}

// Explicit Force Refresh (triggered by Sync button)
export async function forceSyncGitHub() {
  try {
    const data = await fetchFreshFromGitHub();
    window.dispatchEvent(new CustomEvent('github-data-synced', { detail: data }));
    return data;
  } catch (e) {
    console.warn('Force sync fallback to cached/defaults:', e);
    const fallback = DEFAULT_GITHUB_DATA;
    window.dispatchEvent(new CustomEvent('github-data-synced', { detail: fallback }));
    return fallback;
  }
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
      if (!freshData || !freshData.repos) return;

      const newRepoCount = freshData.repos.length;
      const newLatestPush = freshData.repos[0]?.pushed_at;

      const hasChanged =
        lastKnownState.repoCount !== 0 &&
        (lastKnownState.repoCount !== newRepoCount || lastKnownState.latestPush !== newLatestPush);

      lastKnownState.repoCount = newRepoCount;
      lastKnownState.latestPush = newLatestPush;

      if (hasChanged && freshData.isLive) {
        console.log(`[GitHub Realtime Pulse] Update detected! New repos: ${newRepoCount}`);
        window.dispatchEvent(new CustomEvent('github-data-synced', { detail: freshData }));
        if (typeof onUpdate === 'function') onUpdate(freshData);
      }
    } catch (e) {
      console.warn('[GitHub Realtime Pulse] Rate-limited or offline, retained cached data:', e.message);
    }
  };

  realtimeSyncTimer = setInterval(check, intervalMs);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      check();
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
  // Always prioritize the live homepage directly from GitHub API!
  const liveUrl =
    repo.homepage && typeof repo.homepage === 'string' && repo.homepage.trim() !== ''
      ? repo.homepage.trim()
      : custom.liveUrl || null;

  return {
    name: repo.name,
    title: custom.title || repo.name.replace(/[-_]/g, ' '),
    category: custom.category || (repo.language === 'Python' ? 'ai' : 'web'),
    badge: custom.badge || repo.language || 'Codebase',
    icon: custom.icon || '🚀',
    desc: custom.desc || repo.description || 'Open source architecture and system codebase on GitHub.',
    liveUrl,
    githubUrl: repo.html_url,
    tags: custom.tags || [repo.language || 'Code', 'Open Source', `${repo.stargazers_count || 0}★`],
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: repo.pushed_at || repo.updated_at
  };
}

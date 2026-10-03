// Live GitHub Real-Time Data & Auto-Sync Engine for @jitin-s
const USERNAME = 'jitin-s';
const CACHE_KEY = 'jitin_github_data';
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes cache for fresh data

// Curated metadata enrichment for recognized repos
const REPO_METADATA = {
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
  }
};

export async function fetchLiveGitHubData() {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        return parsed.data;
      }
    } catch (e) {}
  }

  try {
    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`),
      fetch(`https://api.github.com/users/${USERNAME}/repos?sort=pushed&per_page=100`),
      fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=10`)
    ]);

    if (!userRes.ok || !reposRes.ok) {
      if (cached) return JSON.parse(cached).data;
      return null;
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
  } catch (err) {
    console.warn('GitHub Live Sync offline/rate-limited, using fallback data:', err);
    if (cached) {
      try {
        return JSON.parse(cached).data;
      } catch (e) {}
    }
    return null;
  }
}

export function formatTimeAgo(dateString) {
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

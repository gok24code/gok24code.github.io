import { useEffect, useState } from 'react'
import snapshot from '../data/snapshot.json'

export const GH_USER = 'gok24code'
const CACHE_KEY = 'gh-cache-v2'
const CACHE_TTL = 10 * 60 * 1000
// Repos that are about the profile/site itself, not projects.
const EXCLUDE = new Set([GH_USER.toLowerCase(), `${GH_USER}.github.io`])

function normalize(user, repos) {
  const list = (repos || [])
    .filter((r) => r && !r.fork && !r.archived && !EXCLUDE.has(r.name.toLowerCase()))
    .map((r) => ({
      id: r.id ?? r.name,
      name: r.name,
      url: r.html_url ?? `https://github.com/${GH_USER}/${r.name}`,
      description: r.description || '',
      language: r.language || null,
      stars: r.stargazers_count || 0,
      pushedAt: r.pushed_at || r.updated_at || null,
      homepage: r.homepage || null,
    }))
    .sort((a, b) => new Date(b.pushedAt || 0) - new Date(a.pushedAt || 0))
  return { user, repos: list }
}

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const c = JSON.parse(raw)
    return Date.now() - c.t < CACHE_TTL ? c : null
  } catch {
    return null
  }
}

function writeCache(user, repos) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), user, repos }))
  } catch {
    /* storage unavailable: ignore */
  }
}

export function useGithub() {
  const [state, setState] = useState(() => {
    const c = readCache()
    return c
      ? { status: 'ready', source: 'cache', ...normalize(c.user, c.repos) }
      : { status: 'loading', source: null, user: null, repos: [] }
  })

  useEffect(() => {
    if (state.status !== 'loading') return
    let alive = true
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 6000)
    const opts = { signal: ctrl.signal, headers: { Accept: 'application/vnd.github+json' } }

    Promise.all([
      fetch(`https://api.github.com/users/${GH_USER}`, opts),
      fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`, opts),
    ])
      .then(async ([u, r]) => {
        if (!u.ok || !r.ok) throw new Error(`GitHub API ${u.status}/${r.status}`)
        const [user, repos] = await Promise.all([u.json(), r.json()])
        writeCache(user, repos)
        if (alive) setState({ status: 'ready', source: 'live', ...normalize(user, repos) })
      })
      .catch(() => {
        if (!alive) return
        if (snapshot.user || snapshot.repos?.length) {
          setState({ status: 'ready', source: 'snapshot', ...normalize(snapshot.user, snapshot.repos) })
        } else {
          setState({ status: 'error', source: null, user: null, repos: [] })
        }
      })
      .finally(() => clearTimeout(timer))

    return () => {
      alive = false
      clearTimeout(timer)
      ctrl.abort()
    }
  }, [state.status])

  return state
}

export function languageStats(repos) {
  const m = new Map()
  for (const r of repos) if (r.language) m.set(r.language, (m.get(r.language) || 0) + 1)
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}

export function timeAgo(iso) {
  if (!iso) return '—'
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  const steps = [
    [60, 's'],
    [60, 'm'],
    [24, 'h'],
    [30, 'd'],
    [12, 'mo'],
  ]
  let v = s
  for (const [n, unit] of steps) {
    if (v < n) return `${Math.floor(v)}${unit} ago`
    v /= n
  }
  return `${Math.floor(v)}y ago`
}

export const LANG_COLORS = {
  Python: '#3572A5',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  'C++': '#f34b7d',
  C: '#8d8d8d',
  Swift: '#F05138',
  Java: '#b07219',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
}
export const langColor = (l) => LANG_COLORS[l] || '#6b7280'

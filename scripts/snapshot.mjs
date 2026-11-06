// Build-time snapshot of GitHub data.
// The site fetches live data at runtime; this snapshot is the fallback when the
// GitHub API is rate-limited or unreachable. If the fetch fails here, the
// existing snapshot is kept so the build never breaks.
import { writeFile } from 'node:fs/promises'

const USER = 'gok24code'
const OUT = new URL('../src/data/snapshot.json', import.meta.url)
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-build' }
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

try {
  const [u, r] = await Promise.all([
    fetch(`https://api.github.com/users/${USER}`, { headers }),
    fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`, { headers }),
  ])
  if (!u.ok || !r.ok) throw new Error(`GitHub API ${u.status}/${r.status}`)
  const user = await u.json()
  const repos = await r.json()
  const snapshot = { fetchedAt: new Date().toISOString(), user, repos }
  await writeFile(OUT, JSON.stringify(snapshot))
  console.log(`[snapshot] ${repos.length} repos saved`)
} catch (err) {
  console.warn(`[snapshot] skipped, keeping previous snapshot (${err.message})`)
}

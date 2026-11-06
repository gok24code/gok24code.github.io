// Build-time snapshot of everything the site shows.
//  - GitHub profile + repos: also fetched live in the browser; this is the fallback.
//  - itch.io games: itch.io has no browser-readable API, so this snapshot is the
//    source. The GitHub Action rebuilds daily, so new games appear within a day.
//  - Certificates: read live from the README; this is the fallback.
// Each source is refreshed independently; if one fails, its previous data is kept.
import { readFile, writeFile } from 'node:fs/promises'
import { parseItch } from './itch.mjs'
import { parseCerts, CERT_README_URL } from '../src/lib/certs.js'

const GH_USER = 'gok24code'
const ITCH_ORIGIN = 'https://noxatra.itch.io/'
const OUT = new URL('../src/data/snapshot.json', import.meta.url)

const gh = { Accept: 'application/vnd.github+json', 'User-Agent': 'gok24code-portfolio-build' }
if (process.env.GITHUB_TOKEN) gh.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

let prev = {}
try {
  prev = JSON.parse(await readFile(OUT, 'utf8'))
} catch {
  /* first run */
}
const next = { ...prev }

async function step(name, fn) {
  try {
    await fn()
    console.log(`[snapshot] ${name}: ok`)
  } catch (err) {
    console.warn(`[snapshot] ${name}: kept previous (${err.message})`)
  }
}

await step('github', async () => {
  const [u, r] = await Promise.all([
    fetch(`https://api.github.com/users/${GH_USER}`, { headers: gh }),
    fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`, { headers: gh }),
  ])
  if (!u.ok || !r.ok) throw new Error(`HTTP ${u.status}/${r.status}`)
  const user = await u.json()
  const repos = await r.json()
  next.user = (({ login, name, avatar_url, html_url, location, public_repos, followers, created_at }) => ({
    login, name, avatar_url, html_url, location, public_repos, followers, created_at,
  }))(user)
  next.repos = repos.map(({ id, name, fork, archived, html_url, description, language, stargazers_count, pushed_at, homepage }) => ({
    id, name, fork, archived, html_url, description, language, stargazers_count, pushed_at, homepage,
  }))
})

await step('itch', async () => {
  const res = await fetch(ITCH_ORIGIN, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  })
  const html = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const games = parseItch(html, ITCH_ORIGIN)
  if (!games.length) {
    const title = html.match(/<title>([^<]*)<\/title>/i)?.[1]
    throw new Error(`no games parsed (url ${res.url}, ${html.length} bytes, title "${title}", grid ${html.includes('user_game_grid')})`)
  }
  next.games = games
})

await step('certs', async () => {
  const res = await fetch(CERT_README_URL)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const certs = parseCerts(await res.text())
  if (!certs.length) throw new Error('no certificates parsed')
  next.certs = certs
})

next.fetchedAt = new Date().toISOString()
await writeFile(OUT, JSON.stringify(next))

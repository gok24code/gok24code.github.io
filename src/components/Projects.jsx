import { useMemo, useState } from 'react'
import { GH_USER, langColor, languageStats, timeAgo } from '../lib/github'

const INITIAL = 9

export default function Projects({ gh }) {
  const { repos, status } = gh
  const [lang, setLang] = useState('all')
  const [showAll, setShowAll] = useState(false)
  const langs = useMemo(() => languageStats(repos), [repos])
  const filtered = lang === 'all' ? repos : repos.filter((r) => r.language === lang)
  const visible = showAll ? filtered : filtered.slice(0, INITIAL)

  return (
    <section className="projects" id="projects">
      <header className="section-head b" data-tag="header" style={{ '--i': 6 }}>
        <p className="label">// 02 · projects</p>
        <h2>
          Things I’ve built <span className="count">{repos.length || ''}</span>
        </h2>
      </header>

      {langs.length > 1 && (
        <div className="filters b" data-tag="div.filters" style={{ '--i': 7 }} role="toolbar" aria-label="Filter by language">
          <button type="button" className={`chip${lang === 'all' ? ' chip--on' : ''}`} onClick={() => setLang('all')}>
            all <span className="t-dim">{repos.length}</span>
          </button>
          {langs.map(([l, n]) => (
            <button key={l} type="button" className={`chip${lang === l ? ' chip--on' : ''}`} onClick={() => setLang(l)}>
              <i className="dot" style={{ background: langColor(l) }} /> {l} <span className="t-dim">{n}</span>
            </button>
          ))}
        </div>
      )}

      {status === 'loading' && <p className="muted">fetching repositories…</p>}
      {status === 'error' && (
        <p className="muted">
          GitHub is not reachable right now.{' '}
          <a href={`https://github.com/${GH_USER}?tab=repositories`} target="_blank" rel="noopener noreferrer">
            See all repositories on GitHub ↗
          </a>
        </p>
      )}

      <ul className="grid">
        {visible.map((r, i) => (
          <li key={r.id} className="b" data-tag={i < 3 ? 'article' : undefined} style={{ '--i': 8 + Math.min(i, 8) }}>
            <a className="card" href={r.url} target="_blank" rel="noopener noreferrer">
              <div className="card__top">
                <h3>{r.name}</h3>
                <span className="card__arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
              <p className={r.description ? '' : 'muted'}>{r.description || 'No description yet · view the source'}</p>
              <div className="card__meta">
                {r.language && (
                  <span>
                    <i className="dot" style={{ background: langColor(r.language) }} /> {r.language}
                  </span>
                )}
                {r.stars > 0 && <span>★ {r.stars}</span>}
                <span>updated {timeAgo(r.pushedAt)}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>

      {filtered.length > INITIAL && (
        <button type="button" className="btn more" onClick={() => setShowAll((v) => !v)}>
          {showAll ? 'show less' : `show all ${filtered.length}`}
        </button>
      )}
    </section>
  )
}

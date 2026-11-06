import { useCallback, useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'
import { GH_USER, languageStats, timeAgo } from '../lib/github'
import { games, isJam, ITCH_URL } from '../lib/extras'

const CHIPS = ['whoami', 'projects', 'games', 'certs', 'stack', 'contact', 'help']
const COMMANDS = ['help', 'whoami', 'projects', 'games', 'certs', 'stack', 'contact', 'open', 'clear', 'sudo hire-me']
const PROMPT = `${GH_USER}@portfolio:~$`

const ext = { target: '_blank', rel: 'noopener noreferrer' }

export default function Terminal({ gh, certs, built, onFirstCommand }) {
  const [lines, setLines] = useState([])
  const [value, setValue] = useState('')
  const [typing, setTyping] = useState(false)
  const history = useRef([])
  const hIndex = useRef(-1)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)
  const ghRef = useRef(gh)
  const certsRef = useRef(certs)
  const usedByUser = useRef(false)
  const runRef = useRef(null)

  useEffect(() => {
    ghRef.current = gh
    certsRef.current = certs
  }, [gh, certs])

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  const run = useCallback((raw) => {
    const cmd = raw.trim()
    const { user, repos, status } = ghRef.current
    const out = []
    const [name, ...args] = cmd.split(/\s+/)
    const key = name?.toLowerCase()

    if (!cmd) {
      // empty line
    } else if (key === 'help') {
      out.push(
        <div className="t-grid">
          {[
            ['whoami', 'who is this'],
            ['projects', 'list repositories'],
            ['games', 'games on itch.io'],
            ['certs', 'certificates'],
            ['stack', 'languages, by repo count'],
            ['contact', 'where to reach me'],
            ['open <repo>', 'open a repository'],
            ['clear', 'clear the screen'],
          ].map(([c, d]) => (
            <div key={c} className="t-row">
              <button type="button" className="t-link" onClick={() => runRef.current(c.split(' ')[0])}>
                {c}
              </button>
              <span className="t-dim">{d}</span>
            </div>
          ))}
        </div>,
      )
    } else if (key === 'whoami') {
      out.push(
        <div>
          <div>
            <b className="t-accent">{user?.name || `${profile.firstName} ${profile.lastName}`}</b> · {profile.role}
          </div>
          <div className="t-dim">{profile.bio}</div>
          {user && (
            <div className="t-dim">
              {user.location ? `${user.location} · ` : ''}
              {user.public_repos} public repos · on GitHub since {new Date(user.created_at).getFullYear()}
            </div>
          )}
        </div>,
      )
    } else if (key === 'projects' || (key === 'ls' && (!args[0] || args[0] === 'projects'))) {
      if (status === 'loading') out.push(<span className="t-dim">fetching…</span>)
      else if (!repos.length) out.push(<span className="t-err">no data · github.com/{GH_USER}</span>)
      else
        out.push(
          <div className="t-grid">
            {repos.slice(0, 10).map((r) => (
              <div key={r.id} className="t-row">
                <a className="t-link" href={r.url} {...ext}>
                  {r.name}
                </a>
                <span className="t-dim">
                  {r.language || '—'} · {timeAgo(r.pushedAt)}
                </span>
              </div>
            ))}
            {repos.length > 10 && (
              <a className="t-dim t-more" href="#projects">
                … {repos.length - 10} more ↓
              </a>
            )}
          </div>,
        )
    } else if (key === 'games') {
      out.push(
        games.length ? (
          <div className="t-grid">
            {games.slice(0, 8).map((g) => (
              <div key={g.id} className="t-row">
                <a className="t-link" href={g.url} {...ext}>
                  {g.title}
                </a>
                <span className="t-dim">
                  {[g.genre, isJam(g) && 'game jam', g.price || 'free'].filter(Boolean).join(' · ')}
                </span>
              </div>
            ))}
            <a className="t-dim t-more" href="#games">
              … {games.length} total · {ITCH_URL.replace('https://', '').replace(/\/$/, '')} ↓
            </a>
          </div>
        ) : (
          <span className="t-dim">no games found</span>
        ),
      )
    } else if (key === 'certs' || key === 'certificates') {
      const list = certsRef.current || []
      out.push(
        list.length ? (
          <div className="t-grid">
            {list.map((c) => (
              <div key={c.image}>
                <span className="t-ok">✓</span> {c.title}
              </div>
            ))}
            <a className="t-dim t-more" href="#certificates">
              view certificates ↓
            </a>
          </div>
        ) : (
          <span className="t-dim">no certificates found</span>
        ),
      )
    } else if (key === 'stack' || key === 'skills') {
      const stats = languageStats(repos)
      const max = stats[0]?.[1] || 1
      out.push(
        stats.length ? (
          <div className="t-grid">
            {stats.map(([l, n]) => (
              <div key={l} className="t-row">
                <span>{l}</span>
                <span className="t-bar">
                  <span className="t-accent">{'█'.repeat(Math.max(1, Math.round((n / max) * 16)))}</span>
                  <span className="t-dim"> {n}</span>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <span className="t-dim">no data</span>
        ),
      )
    } else if (key === 'contact') {
      out.push(
        <div className="t-grid">
          {profile.links.map((l) => (
            <div key={l.label} className="t-row">
              <span className="t-dim">{l.label.toLowerCase()}</span>
              <a className="t-link" href={l.href} {...ext}>
                {l.href.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '')}
              </a>
            </div>
          ))}
        </div>,
      )
    } else if (key === 'open') {
      const q = args.join(' ').toLowerCase()
      const r = q && repos.find((x) => x.name.toLowerCase() === q) || repos.find((x) => q && x.name.toLowerCase().includes(q))
      if (r) {
        window.open(r.url, '_blank', 'noopener')
        out.push(<span>opening {r.name}…</span>)
      } else out.push(<span className="t-err">open: repo not found{q ? `: ${q}` : ''} · try “projects”</span>)
    } else if (key === 'sudo' && args[0] === 'hire-me') {
      const li = profile.links.find((l) => l.label === 'LinkedIn')
      out.push(
        <span>
          <span className="t-ok">[sudo] permission granted.</span> →{' '}
          <a className="t-link" href={li.href} {...ext}>
            let’s talk on LinkedIn
          </a>
        </span>,
      )
    } else if (key === 'sudo') {
      out.push(<span className="t-err">nice try. try “sudo hire-me”</span>)
    } else if (key === 'clear') {
      setLines([])
      return
    } else {
      out.push(<span className="t-err">command not found: {name} · try “help”</span>)
    }
    setLines((p) => [...p, { cmd, out }])
  }, [])

  useEffect(() => {
    runRef.current = run
  }, [run])

  // Type a command out character by character, then run it.
  const typeAndRun = useCallback(
    async (cmd, fromUser = true) => {
      if (typing) return
      setTyping(true)
      for (let i = 1; i <= cmd.length; i++) {
        setValue(cmd.slice(0, i))
        await new Promise((r) => setTimeout(r, 38 + Math.random() * 30))
      }
      await new Promise((r) => setTimeout(r, 120))
      setValue('')
      run(cmd)
      setTyping(false)
      if (fromUser && !usedByUser.current) {
        usedByUser.current = true
        onFirstCommand?.()
      }
    },
    [run, typing, onFirstCommand],
  )

  // Demo: once the page is built, the terminal runs `whoami` on its own.
  const demoed = useRef(false)
  useEffect(() => {
    if (!built || demoed.current) return
    demoed.current = true
    const t = setTimeout(() => typeAndRun('whoami', false), 1100)
    return () => clearTimeout(t)
  }, [built, typeAndRun])

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      const v = value
      if (v.trim()) history.current.unshift(v)
      hIndex.current = -1
      setValue('')
      run(v)
      if (v.trim() && !usedByUser.current) {
        usedByUser.current = true
        onFirstCommand?.()
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const h = history.current
      if (hIndex.current < h.length - 1) setValue(h[++hIndex.current])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (hIndex.current > 0) setValue(history.current[--hIndex.current])
      else {
        hIndex.current = -1
        setValue('')
      }
    } else if (e.key === 'Tab') {
      const m = COMMANDS.filter((c) => c.startsWith(value.toLowerCase()))
      if (value && m.length === 1) {
        e.preventDefault()
        setValue(m[0] + (m[0] === 'open' ? ' ' : ''))
      }
    }
  }

  const focusInput = (e) => {
    if (e.target.closest('a,button')) return
    if (window.getSelection()?.toString()) return
    inputRef.current?.focus({ preventScroll: true })
  }

  return (
    <section className="term b" data-tag="section.terminal" style={{ '--i': 5 }} aria-label="Interactive terminal">
      <div className="term__bar">
        <span className="term__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="term__title">~/portfolio — zsh</span>
        <span className="term__hint">interactive</span>
      </div>
      <div className="term__body" ref={bodyRef} onClick={focusInput}>
        {lines.map((l, i) => (
          <div key={i} className="term__entry">
            <div>
              <span className="t-prompt">{PROMPT}</span> {l.cmd}
            </div>
            {l.out.map((o, j) => (
              <div key={j} className="term__out">
                {o}
              </div>
            ))}
          </div>
        ))}
        <label className="term__input">
          <span className="t-prompt">{PROMPT}</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            readOnly={typing}
            placeholder={lines.length ? '' : 'try: projects'}
            aria-label="Terminal command"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            enterKeyHint="send"
          />
        </label>
      </div>
      <div className="term__chips" role="toolbar" aria-label="Quick commands">
        {CHIPS.map((c) => (
          <button key={c} type="button" className="chip" onClick={() => typeAndRun(c)} disabled={typing}>
            <span aria-hidden="true">›</span> {c}
          </button>
        ))}
        <button type="button" className="chip chip--accent" onClick={() => typeAndRun('sudo hire-me')} disabled={typing}>
          <span aria-hidden="true">›</span> sudo hire-me
        </button>
      </div>
    </section>
  )
}

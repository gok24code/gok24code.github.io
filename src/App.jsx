import { useCallback, useEffect, useRef, useState } from 'react'
import Boot from './components/Boot'
import Hero from './components/Hero'
import Terminal from './components/Terminal'
import Projects from './components/Projects'
import StatusBar from './components/StatusBar'
import { GH_USER, useGithub } from './lib/github'

const SEEN_KEY = 'boot-seen'

function bootMode() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'none'
    if (sessionStorage.getItem(SEEN_KEY)) return 'quick'
  } catch {
    /* ignore */
  }
  return 'full'
}

export default function App() {
  const gh = useGithub()
  const [mode] = useState(bootMode)
  const [phase, setPhase] = useState(mode === 'full' ? 'boot' : 'built')
  const [showBoot, setShowBoot] = useState(mode === 'full')
  const [toast, setToast] = useState(null)
  const rootRef = useRef(null)

  const onBootDone = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* ignore */
    }
    setPhase('built')
    setTimeout(() => setShowBoot(false), 500) // let the overlay fade out
  }, [])

  // Label each wireframe with its tag and live size, like a dev-tools overlay.
  useEffect(() => {
    if (phase !== 'built') return
    rootRef.current?.querySelectorAll('[data-tag]').forEach((el) => {
      const r = el.getBoundingClientRect()
      el.dataset.label = `${el.dataset.tag} · ${Math.round(r.width)}×${Math.round(r.height)}`
    })
  }, [phase, gh.status])

  const onFirstCommand = useCallback(() => {
    setToast('achievement unlocked: curious_engineer')
    setTimeout(() => setToast(null), 3600)
  }, [])

  const built = phase === 'built'
  const cls = ['app', built && 'is-built', mode === 'none' && 'no-motion', mode === 'quick' && 'quick'].filter(Boolean).join(' ')

  return (
    <>
      {showBoot && <Boot gh={gh} onDone={onBootDone} />}
      <div className={cls} ref={rootRef}>
        <div className="bg-grid" aria-hidden="true" />
        <nav className="nav b" data-tag="nav" style={{ '--i': 0 }}>
          <a href="#top" className="nav__logo">
            <span className="nav__mark">G</span> {GH_USER}
          </a>
          <div className="nav__links">
            <a href="#projects">projects</a>
            <a href={`https://github.com/${GH_USER}`} target="_blank" rel="noopener noreferrer">
              github ↗
            </a>
          </div>
        </nav>
        <main>
          <Hero gh={gh} built={built} />
          <Terminal gh={gh} built={built} onFirstCommand={onFirstCommand} />
          <Projects gh={gh} />
        </main>
        <StatusBar gh={gh} />
      </div>
      <div className={`toast${toast ? ' toast--on' : ''}`} role="status" aria-live="polite">
        {toast && (
          <>
            <span className="toast__icon" aria-hidden="true">
              ◆
            </span>{' '}
            {toast}
          </>
        )}
      </div>
    </>
  )
}

import { useEffect, useRef, useState } from 'react'
import { GH_USER, languageStats } from '../lib/github'

const MIN_MS = 1500
const MAX_MS = 3200

// Full-screen boot sequence. The real GitHub fetch happens behind it, so the
// loading time becomes part of the show. Any click / tap / key skips it.
export default function Boot({ gh, onDone }) {
  const [lines, setLines] = useState([])
  const [progress, setProgress] = useState(0.08)
  const [leaving, setLeaving] = useState(false)
  const started = useRef(0)
  const doneRef = useRef(false)
  const ghRef = useRef(gh)
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    ghRef.current = gh
    onDoneRef.current = onDone
  })

  useEffect(() => {
    const finish = () => {
      if (doneRef.current) return
      doneRef.current = true
      setProgress(1)
      setLeaving(true)
      onDoneRef.current()
    }
    started.current = performance.now()
    let cancelled = false
    const wait = (ms) => new Promise((r) => setTimeout(r, ms))
    const push = (l) => !cancelled && setLines((p) => [...p, l])
    const replaceLast = (l) => !cancelled && setLines((p) => [...p.slice(0, -1), l])

    ;(async () => {
      push({ s: 'ok', t: `${GH_USER}/portfolio · build ${__BUILD_SHA__}` })
      await wait(220)
      setProgress(0.25)
      push({ s: '..', t: `resolving github.com/${GH_USER}` })
      while (ghRef.current.status === 'loading' && performance.now() - started.current < MAX_MS - 700) {
        await wait(80)
        if (cancelled) return
      }
      const g = ghRef.current
      if (g.status === 'ready') {
        replaceLast({ s: 'ok', t: `resolved github.com/${GH_USER}` })
        setProgress(0.55)
        await wait(160)
        if (g.user?.name) push({ s: 'ok', t: `profile: ${g.user.name}` })
        await wait(160)
        const langs = languageStats(g.repos).length
        push({ s: 'ok', t: `${g.repos.length} repositories indexed · ${langs} languages` })
      } else {
        replaceLast({ s: '!!', t: 'github unreachable · continuing offline' })
      }
      setProgress(0.85)
      await wait(180)
      push({ s: 'ok', t: 'mounting interface' })
      const left = MIN_MS - (performance.now() - started.current)
      if (left > 0) await wait(left)
      if (!cancelled) finish()
    })()

    const skip = () => finish()
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      cancelled = true
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [])

  return (
    <div className={`boot${leaving ? ' boot--out' : ''}`} aria-hidden="true">
      <div className="boot__grid" />
      <div className="boot__log">
        {lines.map((l, i) => (
          <div key={i} className="boot__line">
            <span className={`boot__s boot__s--${l.s === 'ok' ? 'ok' : l.s === '!!' ? 'err' : 'wait'}`}>[{l.s}]</span> {l.t}
            {i === lines.length - 1 && <span className="caret" />}
          </div>
        ))}
      </div>
      <div className="boot__bar">
        <div className="boot__fill" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <div className="boot__skip">tap or press any key to skip</div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'

// Cut-out portrait that breaks out of its frame, with a reactor ring behind it,
// a tangerine rim light, and pointer parallax (desktop) / slow float (touch).
// Falls back to the GitHub avatar if the photo can't load.
export default function Portrait({ user }) {
  const [ok, setOk] = useState(true)
  const stage = useRef(null)

  useEffect(() => {
    const el = stage.current
    if (!el || !window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let tx = 0
    let ty = 0
    let x = 0
    let y = 0
    const loop = () => {
      x += (tx - x) * 0.08
      y += (ty - y) * 0.08
      el.style.setProperty('--px', x.toFixed(3))
      el.style.setProperty('--py', y.toFixed(3))
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(loop) : 0
    }
    const move = (e) => {
      const r = el.getBoundingClientRect()
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)))
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)))
      if (!raf) raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
    }
  }, [])

  const name = `${profile.firstName} ${profile.lastName}`

  if (!ok)
    return (
      <div className="avatar">
        {user?.avatar_url ? <img src={user.avatar_url} alt={name} width="460" height="460" /> : <div className="avatar__ph">{profile.firstName[0]}</div>}
      </div>
    )

  return (
    <div className="stage" ref={stage}>
      <div className="stage__frame" aria-hidden="true">
        <i className="corner tl" />
        <i className="corner tr" />
        <i className="corner bl" />
        <i className="corner br" />
        <span className="stage__grid" />
      </div>
      <div className="stage__ring" aria-hidden="true">
        <span className="ring ring--outer" />
        <span className="ring ring--inner" />
        <span className="ring__core" />
      </div>
      <picture className="stage__photo">
        <source media="(max-width: 640px)" srcSet="/portrait-sm.webp" type="image/webp" />
        <img src="/portrait.webp" alt={name} width="835" height="1200" decoding="async" fetchPriority="high" onError={() => setOk(false)} />
      </picture>
      <picture className="stage__line" aria-hidden="true">
        <source media="(max-width: 640px)" srcSet="/portrait-sm-line.webp" type="image/webp" />
        <img src="/portrait-line.webp" alt="" width="835" height="1200" decoding="async" />
      </picture>
      <div className="stage__badge">
        <span className="stage__dot" aria-hidden="true" />
        <span>
          <b>{name}</b>
          <small>Embedded · Software · Linux</small>
        </span>
      </div>
    </div>
  )
}

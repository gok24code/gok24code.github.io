import { useRef } from 'react'
import { games, hue, isJam, ITCH_URL } from '../lib/extras'

function Cover({ g }) {
  if (g.cover)
    return <img src={g.cover} alt="" width="315" height="250" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
  const h = hue(g.title)
  const initials = g.title
    .replace(/[^\p{L}\p{N} ]/gu, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return (
    <div className="game__ph" style={{ '--h': h }} aria-hidden="true">
      <span>{initials || '?'}</span>
    </div>
  )
}

export default function Games() {
  const track = useRef(null)
  if (!games.length) return null
  const jams = games.filter(isJam).length

  const scroll = (dir) => {
    const el = track.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  return (
    <section className="games" id="games">
      <header className="section-head section-head--row b" data-tag="header">
        <div>
          <p className="label">// 03 · games</p>
          <h2>
            Games I’ve shipped <span className="count">{games.length}</span>
          </h2>
          <p className="section-sub">
            Published on itch.io{jams ? ` · ${jams} made for game jams` : ''}.
          </p>
        </div>
        <div className="games__nav">
          <button type="button" className="round" onClick={() => scroll(-1)} aria-label="Scroll games left">
            ‹
          </button>
          <button type="button" className="round" onClick={() => scroll(1)} aria-label="Scroll games right">
            ›
          </button>
          <a className="btn" href={ITCH_URL} target="_blank" rel="noopener noreferrer">
            itch.io <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <ul className="games__track" ref={track}>
        {games.map((g) => (
          <li key={g.id} className="b" data-fx="slide">
            <a className="game" href={g.url} target="_blank" rel="noopener noreferrer">
              <div className="game__cover">
                <Cover g={g} />
                <span className="game__play" aria-hidden="true">
                  ▶ play
                </span>
                <span className={`game__price${g.price ? '' : ' game__price--free'}`}>{g.price || 'free'}</span>
              </div>
              <div className="game__body">
                <h3>{g.title}</h3>
                {g.text && <p>{g.text}</p>}
                <div className="game__tags">
                  {isJam(g) && <span className="tag tag--jam">game jam</span>}
                  {g.genre && <span className="tag">{g.genre}</span>}
                  {g.platforms.slice(0, 2).map((p) => (
                    <span key={p} className="tag tag--dim">
                      {p}
                    </span>
                  ))}
                  {g.platforms.length > 2 && <span className="tag tag--dim">+{g.platforms.length - 2}</span>}
                </div>
              </div>
            </a>
          </li>
        ))}
        <li className="b" data-fx="slide">
          <a className="game game--more" href={ITCH_URL} target="_blank" rel="noopener noreferrer">
            <span className="game--more__icon" aria-hidden="true">
              ⌁
            </span>
            <span>
              all games on
              <br />
              <b>noxatra.itch.io ↗</b>
            </span>
          </a>
        </li>
      </ul>
    </section>
  )
}

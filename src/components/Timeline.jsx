import { useMemo, useState } from 'react'
import { milestones } from '../data/milestones'
import { GH_USER } from '../lib/github'
import SectionArt from './SectionArt'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const INITIAL = 8
const KIND = {
  project: { label: 'project', icon: '◆' },
  certificate: { label: 'certificate', icon: '✓' },
  milestone: { label: 'milestone', icon: '★' },
  education: { label: 'education', icon: '▲' },
  work: { label: 'work', icon: '■' },
  award: { label: 'award', icon: '✦' },
}

const when = (iso) => {
  const [y, m] = iso.split('-')
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y
}

// One chronological stream, built automatically: projects (GitHub repos that have a
// description), certificates (with dates), joining GitHub, plus hand-written
// milestones from src/data/milestones.js.
export default function Timeline({ gh, certs }) {
  const [all, setAll] = useState(false)

  const events = useMemo(() => {
    const ev = []
    for (const r of gh.repos) {
      const date = r.createdAt // creation date only; a push date would misplace it
      if (!r.description || !date) continue
      ev.push({ date: date.slice(0, 10), kind: 'project', title: r.name, text: r.description, href: r.url })
    }
    for (const c of certs) {
      if (!c.date) continue
      ev.push({ date: c.date, kind: 'certificate', title: c.title, text: 'Certificate of completion', href: '#certificates' })
    }
    if (gh.user?.created_at) {
      ev.push({
        date: gh.user.created_at.slice(0, 10),
        kind: 'milestone',
        title: `Started building in public as @${GH_USER}`,
        text: 'Joined GitHub',
        href: `https://github.com/${GH_USER}`,
      })
    }
    for (const m of milestones) ev.push({ kind: 'milestone', ...m, date: m.now ? '9999' : m.date })
    // stable sort: newest first; hand-written entries keep their order within a year
    return ev
      .map((e, i) => [e, i])
      .sort(([a, i], [b, j]) => (a.date === b.date ? i - j : a.date < b.date ? 1 : -1))
      .map(([e]) => e)
  }, [gh.repos, gh.user, certs])

  if (!events.length) return null
  const shown = all ? events : events.slice(0, INITIAL)

  return (
    <section className="timeline" id="timeline">
      <SectionArt set="timeline" />
      <header className="section-head b" data-tag="header">
        <p className="label">// 06 · timeline</p>
        <h2>
          The road so far <span className="count">{events.length}</span>
        </h2>
      </header>

      <ol className="tl">
        {shown.map((e, i) => {
          const year = e.date === '9999' ? 'now' : e.date.slice(0, 4)
          const prev = shown[i - 1]
          const showYear = i === 0 || (prev.date === '9999' ? 'now' : prev.date.slice(0, 4)) !== year
          const k = KIND[e.kind] || KIND.milestone
          const ext = e.href && /^https?:/.test(e.href)
          const Body = e.href ? 'a' : 'div'
          return (
            <li key={`${e.date}-${e.title}-${e.period || ''}`} className={`tl__item tl__item--${e.kind} b`} data-fx="tl" style={{ '--n': i }}>
              {showYear && <span className={`tl__year${year === 'now' ? ' tl__year--now' : ''}`}>{year}</span>}
              <span className="tl__dot" aria-hidden="true">
                {k.icon}
              </span>
              <Body className="tl__card" {...(e.href ? { href: e.href } : {})} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                <span className="tl__meta">
                  {e.now ? (
                    <span className="tl__now">● now</span>
                  ) : (
                    <time dateTime={e.date}>{e.period || when(e.date)}</time>
                  )}
                  <span className={`tl__kind tl__kind--${e.kind}`}>{k.label}</span>
                </span>
                <span className="tl__title">{e.title}</span>
                {e.text && <span className="tl__text">{e.text}</span>}
              </Body>
            </li>
          )
        })}
      </ol>

      {events.length > INITIAL && (
        <button type="button" className="btn more b" data-fx="pop" onClick={() => setAll((v) => !v)}>
          {all ? 'show less' : `show full timeline · ${events.length}`}
        </button>
      )}
    </section>
  )
}

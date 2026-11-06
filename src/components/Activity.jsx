import { useEffect, useRef, useState } from 'react'
import snapshot from '../data/snapshot.json'
import { GH_USER } from '../lib/github'
import SectionArt from './SectionArt'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const fmt = (iso) => {
  const d = new Date(`${iso}T00:00:00Z`)
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

function stats(days) {
  let longest = 0
  let run = 0
  let best = days[0]
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0
    longest = Math.max(longest, run)
    if (!best || d.count > best.count) best = d
  }
  // current streak: today may still be empty, so start from the last active day if it is today or yesterday
  let current = 0
  let i = days.length - 1
  if (i >= 0 && days[i].count === 0) i--
  for (; i >= 0 && days[i].count > 0; i--) current++
  const active = days.filter((d) => d.count > 0).length
  return { longest, current, best, active }
}

function buildCalendar(contrib) {
  const days = contrib?.days || []
  if (!days.length) return { weeks: [], months: [], s: null }
  const first = new Date(`${days[0].date}T00:00:00Z`).getUTCDay() // 0 = Sunday
  const cells = [...Array(first).fill(null), ...days]
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  const months = []
  weeks.forEach((w, x) => {
    const d = w.find(Boolean)
    if (!d) return
    const m = new Date(`${d.date}T00:00:00Z`).getUTCMonth()
    if (!months.length || months[months.length - 1].m !== m) months.push({ m, x })
  })
  return { weeks, months: months.filter((mo, i) => i > 0 || weeks.length - mo.x > 2), s: stats(days) }
}

// static data from the build snapshot, computed once
const CAL = buildCalendar(snapshot.contrib)

// GitHub contribution calendar in the site's colours, built from the snapshot
// (refreshed by the GitHub Action every 6 hours).
export default function Activity() {
  const contrib = snapshot.contrib
  const scroller = useRef(null)
  const [hover, setHover] = useState(null)

  const { weeks, months, s } = CAL

  // phones: start scrolled to the most recent weeks
  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [weeks.length])

  if (!weeks.length) return null

  return (
    <section className="activity" id="activity">
      <SectionArt set="activity" />
      <header className="section-head section-head--row b" data-tag="header">
        <div>
          <p className="label">// 05 · activity</p>
          <h2>
            Shipping, every week <span className="count">{contrib.total}</span>
          </h2>
          <p className="section-sub">{contrib.total} contributions on GitHub in the last year.</p>
        </div>
        <a className="btn" href={`https://github.com/${GH_USER}`} target="_blank" rel="noopener noreferrer">
          profile <span aria-hidden="true">↗</span>
        </a>
      </header>

      <div className="heat b" data-fx="grid">
        <div className="heat__scroll" ref={scroller}>
          <div className="heat__inner" style={{ '--weeks': weeks.length }}>
            <div className="heat__months" aria-hidden="true">
              {months.map(({ m, x }) => (
                <span key={`${m}-${x}`} style={{ gridColumn: x + 1 }}>
                  {MONTHS[m]}
                </span>
              ))}
            </div>
            <div className="heat__grid" role="img" aria-label={`${contrib.total} contributions in the last year`} onMouseLeave={() => setHover(null)}>
              {weeks.map((w, x) => (
                <div key={x} className="heat__col" style={{ '--x': x }}>
                  {w.map((d, y) =>
                    d ? (
                      <i
                        key={d.date}
                        className={`heat__c l${d.level}`}
                        title={`${d.count} contribution${d.count === 1 ? '' : 's'} on ${fmt(d.date)}`}
                        onMouseEnter={() => setHover(d)}
                      />
                    ) : (
                      <i key={`e${y}`} className="heat__c heat__c--empty" />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="heat__foot">
          <span className="heat__readout" aria-live="polite">
            {hover ? (
              <>
                <b>{hover.count}</b> contribution{hover.count === 1 ? '' : 's'} · {fmt(hover.date)}
              </>
            ) : (
              <>hover a day</>
            )}
          </span>
          <span className="heat__legend" aria-hidden="true">
            less <i className="heat__c l0" /> <i className="heat__c l1" /> <i className="heat__c l2" /> <i className="heat__c l3" />{' '}
            <i className="heat__c l4" /> more
          </span>
        </div>
      </div>

      <dl className="heat__stats">
        {[
          ['contributions', contrib.total],
          ['active days', s.active],
          ['longest streak', `${s.longest} days`],
          ['best day', `${s.best.count} · ${fmt(s.best.date).replace(/, \d{4}$/, '')}`],
        ].map(([k, v]) => (
          <div key={k} className="b" data-fx="pop">
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

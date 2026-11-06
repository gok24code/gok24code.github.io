import { profile } from '../data/profile'
import { languageStats } from '../lib/github'
import Scramble from './Scramble'
import Portrait from './Portrait'
import { games } from '../lib/extras'

export default function Hero({ gh, certs, built }) {
  const { user, repos } = gh
  const topLang = languageStats(repos)[0]?.[0]
  const meta = [
    ['repos', user ? user.public_repos : repos.length || '—'],
    ['games', games.length || '—'],
    ['certificates', certs.length || '—'],
    ['top lang', topLang || '—'],
  ]

  return (
    <section className="hero" id="top">
      <div className="hero__text">
        <p className="label b" data-tag="span.label">
          // 01 · whoami
        </p>
        <h1 className="hero__name b" data-tag="h1">
          <span className="hero__first">
            <Scramble text={profile.firstName} start={built} delay={350} />
          </span>
          <span className="hero__last">
            <Scramble text={profile.lastName} start={built} delay={500} />
          </span>
        </h1>
        <p className="hero__role b" data-fx="type">
          {profile.role}
        </p>
        <p className="hero__bio b" data-fx="rise">
          {profile.bio}
        </p>
        <div className="hero__links">
          {profile.links.map((l) => (
            <a key={l.label} className={`btn b${l.primary ? ' btn--primary' : ''}`} data-fx="pop" href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>

      <aside className="hero__card b" data-tag="aside.card" data-fx="portrait">
        <Portrait user={user} />
        <dl className="meta">
          {meta.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </section>
  )
}

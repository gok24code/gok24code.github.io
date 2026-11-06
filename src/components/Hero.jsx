import { profile } from '../data/profile'
import { languageStats } from '../lib/github'
import Scramble from './Scramble'

export default function Hero({ gh, built }) {
  const { user, repos } = gh
  const topLang = languageStats(repos)[0]?.[0]
  const since = user?.created_at ? new Date(user.created_at).getFullYear() : null
  const meta = [
    ['repos', user ? user.public_repos : repos.length || '—'],
    ['followers', user ? user.followers : '—'],
    ['top lang', topLang || '—'],
    ['since', since || '—'],
  ]

  return (
    <section className="hero" id="top">
      <div className="hero__text">
        <p className="label b" data-tag="span.label" style={{ '--i': 0 }}>
          // 01 · whoami
        </p>
        <h1 className="hero__name b" data-tag="h1" style={{ '--i': 1 }}>
          <span className="hero__first">
            <Scramble text={profile.firstName} start={built} delay={350} />
          </span>
          <span className="hero__last">
            <Scramble text={profile.lastName} start={built} delay={500} />
          </span>
        </h1>
        <p className="hero__role b" data-tag="p.role" style={{ '--i': 2 }}>
          {profile.role}
        </p>
        <p className="hero__bio b" data-tag="p.bio" style={{ '--i': 3 }}>
          {profile.bio}
        </p>
        <div className="hero__links b" data-tag="nav.links" style={{ '--i': 4 }}>
          {profile.links.map((l) => (
            <a key={l.label} className={`btn${l.primary ? ' btn--primary' : ''}`} href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>

      <aside className="hero__card b" data-tag="aside.card" style={{ '--i': 2 }}>
        <div className="avatar">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={`${profile.firstName} ${profile.lastName}`} width="460" height="460" />
          ) : (
            <div className="avatar__ph">{profile.firstName[0]}</div>
          )}
          <span className="avatar__scan" />
          <i className="corner tl" />
          <i className="corner tr" />
          <i className="corner bl" />
          <i className="corner br" />
        </div>
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

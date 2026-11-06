import { GH_USER, timeAgo } from '../lib/github'

export default function StatusBar({ gh }) {
  const { status, repos, user, source } = gh
  const last = repos[0]
  const online = status === 'ready' && source !== 'snapshot'

  return (
    <footer className="status" role="contentinfo">
      <span className={`status__item status__live${online ? '' : ' status__live--off'}`}>
        <i aria-hidden="true" /> {online ? 'online' : status === 'loading' ? 'connecting' : 'offline'}
      </span>
      {last && (
        <a className="status__item" href={last.url} target="_blank" rel="noopener noreferrer" title={`Last push: ${last.name}`}>
          last push <b>{timeAgo(last.pushedAt)}</b>
          <span className="hide-sm"> → {last.name}</span>
        </a>
      )}
      <a
        className="status__item hide-sm"
        href={`https://github.com/${GH_USER}/${GH_USER}.github.io`}
        target="_blank"
        rel="noopener noreferrer"
        title={`Built ${new Date(__BUILD_TIME__).toUTCString()}`}
      >
        build <b>{__BUILD_SHA__}</b>
      </a>
      <span className="status__spacer" />
      {user?.location && <span className="status__item hide-sm">{user.location}</span>}
      <span className="status__item">© {new Date().getFullYear()}</span>
    </footer>
  )
}

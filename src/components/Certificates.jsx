import { useEffect, useRef, useState } from 'react'
import { CERT_REPO_URL, certThumb } from '../lib/certs'

export default function Certificates({ certs }) {
  const [open, setOpen] = useState(null)
  const dialog = useRef(null)

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  if (!certs.length) return null

  return (
    <section className="certs" id="certificates">
      <header className="section-head section-head--row b" data-tag="header" style={{ '--i': 6 }}>
        <div>
          <p className="label">// 04 · certificates</p>
          <h2>
            Certified <span className="count">{certs.length}</span>
          </h2>
          <p className="section-sub">Tap a certificate to view it full size.</p>
        </div>
        <a className="btn" href={CERT_REPO_URL} target="_blank" rel="noopener noreferrer">
          source <span aria-hidden="true">↗</span>
        </a>
      </header>

      <ul className="certs__grid">
        {certs.map((c, i) => (
          <li key={c.image} className="b" style={{ '--i': 7 + Math.min(i, 6) }}>
            <button type="button" className="cert" onClick={() => setOpen(c)}>
              <div className="cert__img">
                <img
                  src={certThumb(c.image)}
                  alt={`${c.title} certificate`}
                  width="640"
                  height="451"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    if (e.currentTarget.src !== c.image) e.currentTarget.src = c.image
                  }}
                />
                <span className="cert__shine" aria-hidden="true" />
              </div>
              <div className="cert__body">
                <span className="cert__badge" aria-hidden="true">
                  ✓
                </span>
                <span className="cert__title">{c.title}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className="lightbox"
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        aria-label={open ? `${open.title} certificate` : 'Certificate'}
      >
        {open && (
          <figure>
            <img src={open.image} alt={`${open.title} certificate`} />
            <figcaption>
              <span>{open.title}</span>
              <span className="lightbox__actions">
                <a href={open.image} target="_blank" rel="noopener noreferrer">
                  open original ↗
                </a>
                <button type="button" onClick={() => setOpen(null)}>
                  close ✕
                </button>
              </span>
            </figcaption>
          </figure>
        )}
      </dialog>
    </section>
  )
}

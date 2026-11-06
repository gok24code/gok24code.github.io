import { useState } from 'react'
import { contact } from '../data/milestones'
import { profile } from '../data/profile'
import SectionArt from './SectionArt'

export const mailto = `mailto:${contact.email}?subject=${encodeURIComponent('Hello Göktuğ — from your portfolio')}`

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = mailto
    }
  }

  return (
    <section className="contact" id="contact">
      <SectionArt set="contact" />
      <div className="contact__card b" data-tag="section.contact">
        <p className="label">// 07 · contact</p>
        <h2>
          Let’s build <span className="contact__accent">something.</span>
        </h2>
        <p className="contact__text">
          Embedded, full-stack or AI: if you have a role or a project in mind, my inbox is open.
        </p>
        <div className="contact__actions">
          <a className="btn btn--primary btn--lg" href={mailto}>
            ✉ Get in touch
          </a>
          <button type="button" className="btn btn--lg" onClick={copy}>
            {copied ? '✓ copied' : contact.email}
          </button>
        </div>
        <div className="contact__links">
          {profile.links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label} ↗
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

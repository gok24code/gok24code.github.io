import { useEffect, useState } from 'react'
import snapshot from '../data/snapshot.json'
import { CERT_README_URL, parseCerts } from './certs'

export const ITCH_URL = 'https://noxatra.itch.io/'

// itch.io games: from the build snapshot (refreshed daily by the GitHub Action).
export const games = snapshot.games || []
export const gamesUpdatedAt = snapshot.fetchedAt || null

// Certificates: live from the README, snapshot as fallback.
export function useCerts() {
  const [state, setState] = useState({ status: 'loading', certs: snapshot.certs || [] })

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(CERT_README_URL, { signal: ctrl.signal, cache: 'no-cache' })
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(r.status))))
      .then((md) => {
        const certs = parseCerts(md)
        setState(certs.length ? { status: 'live', certs } : (s) => ({ ...s, status: 'snapshot' }))
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setState((s) => ({ ...s, status: 'snapshot' }))
      })
    return () => ctrl.abort()
  }, [])

  return state
}

export const isJam = (g) => /jam/i.test(`${g.title} ${g.text}`)

// Stable hue per title, for games without a cover image.
export function hue(str) {
  let h = 0
  for (const c of str) h = (h * 31 + c.codePointAt(0)) % 360
  return h
}

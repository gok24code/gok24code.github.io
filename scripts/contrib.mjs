// Parse GitHub's public contribution calendar (https://github.com/users/<user>/contributions)
// into { total, days: [{ date, count, level }] }. No token needed. Attributes are read
// into maps, so the order GitHub emits them in doesn't matter.
const attrs = (s) => Object.fromEntries([...s.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)].map((m) => [m[1].toLowerCase(), m[2]]))

export function parseContrib(html) {
  const counts = {}
  for (const m of html.matchAll(/<tool-tip\b([^>]*)>([^<]*)<\/tool-tip>/g)) {
    const a = attrs(m[1])
    if (!a.for) continue
    const n = m[2].trim().match(/^(No|[\d,]+) contributions?/)
    if (n) counts[a.for] = n[1] === 'No' ? 0 : Number(n[1].replace(/,/g, ''))
  }
  const days = []
  for (const m of html.matchAll(/<td\b([^>]*)>/g)) {
    const a = attrs(m[1])
    if (!a['data-date'] || !/\bContributionCalendar-day\b/.test(a.class || '')) continue
    days.push({ date: a['data-date'], count: counts[a.id] ?? null, level: Number(a['data-level']) || 0 })
  }
  days.sort((x, y) => (x.date < y.date ? -1 : 1))
  const t = html.match(/([\d,]+)\s+contributions?\s+in\s+the\s+last\s+year/)
  const total = t ? Number(t[1].replace(/,/g, '')) : days.reduce((s, d) => s + (d.count || 0), 0)
  return { total, days }
}

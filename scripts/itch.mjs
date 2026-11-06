// Parse a creator's itch.io page (https://<user>.itch.io/) into a list of games.
// itch.io has no public, CORS-friendly API for this, so the build reads the
// server-rendered HTML. Only the creator's own grid is used (collections are skipped).
// itch.io does not emit HTML attributes in a stable order, so tags are parsed into
// attribute maps instead of matching attribute sequences.
const decode = (s) =>
  (s || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()

function tags(html) {
  const out = []
  for (const m of html.matchAll(/<([a-z]+)\b([^>]*)>/gi)) {
    const attrs = {}
    for (const a of m[2].matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)) attrs[a[1].toLowerCase()] = a[2]
    const end = m.index + m[0].length
    const next = html.indexOf('<', end)
    out.push({
      name: m[1].toLowerCase(),
      cls: ` ${attrs.class || ''} `,
      attrs,
      text: decode(html.slice(end, next < 0 ? undefined : next)),
    })
  }
  return out
}

const has = (t, c) => t.cls.includes(` ${c} `)

export function parseItch(html, origin) {
  const startTag = html.match(/<div\b[^>]*\bclass="[^"]*\buser_game_grid\b[^"]*"[^>]*>/)
  if (!startTag) return []
  const start = startTag.index
  const endTag = html.slice(start).match(/<div\b[^>]*\bclass="[^"]*\bgame_list_widget\b/)
  const section = html.slice(start, endTag ? start + endTag.index : undefined)

  const cellRe = /<div\b[^>]*\bdata-game_id="(\d+)"[^>]*>/g
  const starts = [...section.matchAll(cellRe)]
  return starts
    .map((m, i) => {
      const chunk = section.slice(m.index, starts[i + 1]?.index ?? section.length)
      const t = tags(chunk)
      const titleA = t.find((x) => x.name === 'a' && has(x, 'title') && has(x, 'game_link'))
      const img = t.find((x) => x.name === 'img')
      const textDiv = t.find((x) => has(x, 'game_text'))
      const platforms = t
        .map((x) => decode(x.attrs.title))
        .filter((s) => s.startsWith('Download for ') || s === 'Play in browser')
        .map((s) => (s === 'Play in browser' ? 'Web' : s.replace('Download for ', '')))
      return {
        id: m[1],
        title: titleA?.text || '',
        url: decode(titleA?.attrs.href),
        cover: decode(img?.attrs['data-lazy_src'] || img?.attrs.src) || null,
        text: decode(textDiv?.attrs.title) || textDiv?.text || '',
        genre: t.find((x) => has(x, 'game_genre'))?.text || null,
        price: t.find((x) => has(x, 'price_value'))?.text || null,
        platforms: [...new Set(platforms)],
      }
    })
    .filter((g) => g.title && g.url && (!origin || g.url.startsWith(origin)))
}

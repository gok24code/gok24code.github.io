// Parse a creator's itch.io page (https://<user>.itch.io/) into a list of games.
// itch.io has no public, CORS-friendly API for this, so the build reads the
// server-rendered HTML. Only the creator's own grid is used (collections are skipped).
export function parseItch(html, origin) {
  const start = html.indexOf('user_game_grid')
  if (start < 0) return []
  let end = html.indexOf('game_list_widget', start)
  if (end < 0) end = html.length
  const section = html.slice(start, end)
  const decode = (s) =>
    (s || '')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&#x27;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim()
  const pick = (chunk, re) => decode(chunk.match(re)?.[1])

  return section
    .split('<div data-game_id="')
    .slice(1)
    .map((chunk) => {
      const id = chunk.match(/^(\d+)/)?.[1]
      const url = pick(chunk, /<a[^>]*href="([^"]+)"[^>]*class="title game_link"/)
      const platforms = [...chunk.matchAll(/title="Download for ([^"]+)"/g)].map((m) => decode(m[1]))
      if (/title="Play in browser"/.test(chunk)) platforms.unshift('Web')
      return {
        id,
        title: pick(chunk, /class="title game_link"[^>]*>([^<]+)</),
        url,
        cover: pick(chunk, /data-lazy_src="([^"]+)"/) || null,
        text: pick(chunk, /<div[^>]*title="([^"]*)"[^>]*class="game_text"/),
        genre: pick(chunk, /class="game_genre">([^<]+)</) || null,
        price: pick(chunk, /class="price_value">([^<]+)</) || null,
        platforms,
      }
    })
    .filter((g) => g.id && g.title && g.url && (!origin || g.url.startsWith(origin)))
}

# gok24code.github.io

Personal portfolio of Göktuğ Toyguç — https://gok24code.github.io

- **Stack:** React 19 + Vite 7, no UI or animation libraries.
- **Data:** profile and repositories are fetched live from the GitHub API. A build-time
  snapshot (`scripts/snapshot.mjs` → `src/data/snapshot.json`) is the fallback when the API
  is rate-limited. Forks, archived repos and the profile/site repos are filtered out.
- **Intro:** boot log runs while the real fetch happens, then every block draws a wireframe
  (with a dev-tools style size label) and fills in. Skippable; quick on repeat visits; off
  with `prefers-reduced-motion`.
- **Games:** pulled from https://noxatra.itch.io at build time (`scripts/itch.mjs`).
- **Certificates:** read live from the README of
  [My_Online_Certificates](https://github.com/gok24code/My_Online_Certificates). Add a
  heading + image there and it appears on the site, no deploy needed.
- **Deploy:** `.github/workflows/deploy.yml` builds and publishes on every push to `main`
  and once a day, so new itch.io games show up within 24h.
- **Terminal:** `whoami`, `projects`, `games`, `certs`, `stack`, `contact`, `open <repo>`, `clear`, and one more.

Static content (name, role, bio, links) lives in `src/data/profile.js`.
Project descriptions come from each repo's GitHub description.

```bash
npm install
npm run dev      # local
npm run deploy   # build + push dist/ to gh-pages
```

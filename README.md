# gok24code.github.io

Personal portfolio of Göktuğ Toyguç — https://gok24code.github.io

- **Stack:** React 19 + Vite 7, no UI or animation libraries.
- **Data:** profile and repositories are fetched live from the GitHub API. A build-time
  snapshot (`scripts/snapshot.mjs` → `src/data/snapshot.json`) is the fallback when the API
  is rate-limited. Forks, archived repos and the profile/site repos are filtered out.
- **Intro:** boot log runs while the real fetch happens, then every block draws a wireframe
  (with a dev-tools style size label) and fills in. Skippable; quick on repeat visits; off
  with `prefers-reduced-motion`.
- **Terminal:** `whoami`, `projects`, `stack`, `contact`, `open <repo>`, `clear`, and one more.

Static content (name, role, bio, links) lives in `src/data/profile.js`.
Project descriptions come from each repo's GitHub description.

```bash
npm install
npm run dev      # local
npm run deploy   # build + push dist/ to gh-pages
```

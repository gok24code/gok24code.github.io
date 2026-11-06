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

<!--
NOT: Yeni sertifika nasıl eklenir (bu blok GitHub'da görünmez)

Site, github.com/gok24code/My_Online_Certificates reposundaki README'yi her açılışta
canlı okur. Deploy gerekmez.

1. Görseli o repodaki certificates/ klasörüne koy (ör. certificates/6.png).
2. O README'ye başlık + hemen altına görsel ekle:

     <li>
         <h1>Sertifika Adı</h1>
         <img src = "/certificates/6.png"></img>
     </li>

   Markdown da olur:  ## Sertifika Adı   ve altına   ![](certificates/6.png)

- Sitede görünmesi 5 dakikaya kadar sürebilir (GitHub README önbelleği).
- Sıra = README'deki sıra. En üstte görünmesini istediğini en üste koy.
- Her görselin üstünde bir başlık olsun; başlıksız görsel alt metnini başlık alır.
- Sertifika sayısı profil kartında ve terminaldeki `certs` komutunda otomatik güncellenir.
- Bu örnekleri sertifika reposunun README'sine yorum olarak koyma: parser onları
  gerçek sertifika sanar.
- Sertifikanın tarihi zaman çizelgesinde görünsün istiyorsan başlık ile görselin
  arasına bir tarih yaz:  <p>22.11.2025</p>  (dd.mm.yyyy ya da yyyy-mm-dd).
  Eski 5 sertifikanın tarihleri src/data/milestones.js içinde (certDates).

NOT: Diğer ayarlar
- Zaman çizelgesine eğitim, iş, ödül vb. eklemek: src/data/milestones.js → milestones.
- Zaman çizelgesindeki projeler = GitHub'da açıklaması (description) olan repolar.
  Açıklama ekledikçe hem çizelgeye hem proje listesinin başına çıkar.
- İletişim e-postası: src/data/milestones.js → contact.email
- Site her push'ta ve 6 saatte bir otomatik build/deploy olur (repo listesi,
  itch.io oyunları, katkı haritası yedeği yenilenir).
-->

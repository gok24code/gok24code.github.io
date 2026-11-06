// Certificates come from the README of github.com/gok24code/My_Online_Certificates.
// The README is read live on every visit, so adding a certificate there shows up
// on the site immediately. Supported README shapes, each heading followed by an image:
//   <h1>Title</h1> <img src="/certificates/1.png">
//   ## Title  ![alt](certificates/1.png)
import { certDates } from '../data/milestones.js'

export const CERT_REPO = 'gok24code/My_Online_Certificates'
export const CERT_BRANCH = 'main'
export const CERT_REPO_URL = `https://github.com/${CERT_REPO}`
const RAW = `https://raw.githubusercontent.com/${CERT_REPO}/${CERT_BRANCH}`
export const CERT_README_URL = `${RAW}/README.md`

const clean = (s) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/[*_`]/g, '')
    .trim()

// dd.mm.yyyy or yyyy-mm-dd -> yyyy-mm-dd
function findDate(text) {
  const tr = text.match(/\b(\d{2})[./](\d{2})[./](\d{4})\b/)
  if (tr) return `${tr[3]}-${tr[2]}-${tr[1]}`
  const iso = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/)
  return iso ? iso[0] : null
}

function resolve(src) {
  if (/^https?:\/\//.test(src)) return src
  return `${RAW}/${src.replace(/^\.?\//, '')}`
}

export function parseCerts(md) {
  // Each image takes the closest heading above it (that no earlier image used).
  const headings = [...md.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>|^#{1,6}\s+(.+)$/gim)].map((m) => ({
    at: m.index,
    title: clean(m[1] ?? m[2] ?? ''),
  }))
  const images = [...md.matchAll(/<img[^>]*src\s*=\s*["']([^"']+)["']|!\[([^\]]*)\]\(([^)\s]+)[^)]*\)/gi)].map((m) => ({
    at: m.index,
    src: m[1] ?? m[3],
    alt: clean(m[2] ?? ''),
  }))
  const out = []
  let floor = -1
  for (const img of images) {
    const h = headings.filter((x) => x.at > floor && x.at < img.at).pop()
    const between = md.slice(h ? h.at : floor + 1, img.at)
    floor = img.at
    const title = h?.title || img.alt
    if (!title || !img.src) continue
    const image = resolve(img.src)
    out.push({ title, image, date: findDate(between) || certDates[image.split('/').pop()] || null })
  }
  return out
}

// Resized WebP thumbnail via the wsrv.nl image CDN; the original PNGs are ~1 MB each.
export const certThumb = (url, w = 640) =>
  `https://wsrv.nl/?url=${encodeURIComponent(url.replace(/^https:\/\//, ''))}&w=${w}&output=webp&q=82`

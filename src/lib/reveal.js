import { useEffect } from 'react'

// Scroll-driven build-in, drawn like a mouse drag-selection on an empty canvas.
// When a `.b` element scrolls into view:
//   1. a transparent selection box grows from its top-left corner to its full size
//      (drawn in a separate overlay layer, so nothing clips it), with a live size label
//   2. the element's content is drawn in from the same corner, inside the box
//   3. the box fades away
// Elements entering together are staggered in document order. New `.b` nodes
// (data arriving, filters, "show all") are picked up automatically.
const GROW = 460
const FILL_AT = 300
const FILL = 560
const FADE_AT = 980
const FADE = 320
const EASE = 'cubic-bezier(0.6, 0, 0.2, 1)'

function stepMs(el) {
  const v = parseFloat(getComputedStyle(el).getPropertyValue('--step'))
  return Number.isFinite(v) ? v : 90
}

function drawSelection(layer, el, delay) {
  const a = layer.getBoundingClientRect()
  const r = el.getBoundingClientRect()
  const pad = 4
  const w = Math.round(r.width + pad * 2)
  const h = Math.round(r.height + pad * 2)
  if (w < 4 || h < 4) return

  const box = document.createElement('div')
  box.className = 'sel'
  box.style.left = `${r.left - a.left - pad}px`
  box.style.top = `${r.top - a.top - pad}px`

  let tag = null
  if (el.dataset.tag) {
    tag = document.createElement('span')
    tag.className = 'sel__tag'
    tag.textContent = `${el.dataset.tag} · 0×0`
    box.appendChild(tag)
  }
  layer.appendChild(box)

  // fill 'forwards' (not 'both'): the box stays invisible (.sel has opacity 0)
  // until its own turn in the stagger, instead of showing a 0×0 label early.
  const grow = box.animate(
    [
      { width: '0px', height: '0px', opacity: 1 },
      { width: `${w}px`, height: `${h}px`, opacity: 1 },
    ],
    { duration: GROW, delay, easing: EASE, fill: 'forwards' },
  )
  box.animate([{ opacity: 1 }, { opacity: 0 }], { duration: FADE, delay: delay + FADE_AT, fill: 'forwards' }).finished.then(
    () => box.remove(),
    () => box.remove(),
  )

  // Size label counts up with the box, like a design tool's live dimensions.
  if (tag) {
    const start = performance.now() + delay
    const tick = (now) => {
      const t = grow.effect?.getComputedTiming().progress ?? 1
      tag.textContent = `${el.dataset.tag} · ${Math.round(w * t)}×${Math.round(h * t)}`
      if (now < start + GROW + 40 && box.isConnected) requestAnimationFrame(tick)
      else tag.textContent = `${el.dataset.tag} · ${w - pad * 2}×${h - pad * 2}`
    }
    requestAnimationFrame(tick)
  }
}

export function useReveal(rootRef, layerRef, enabled) {
  useEffect(() => {
    const root = rootRef.current
    const layer = layerRef.current
    if (!enabled || !root || !layer) return

    const io = new IntersectionObserver(
      (entries) => {
        const hits = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target)
          .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
        const step = stepMs(root)
        hits.forEach((el, k) => {
          const delay = Math.min(k, 9) * step
          io.unobserve(el)
          drawSelection(layer, el, delay)
          el.style.setProperty('--fill-delay', `${delay + FILL_AT}ms`)
          el.style.setProperty('--fill-dur', `${FILL}ms`)
          el.classList.add('in')
        })
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    )

    const watch = (node) => {
      if (!(node instanceof Element) || node.closest('.sel-layer')) return
      if (node.matches('.b') && !node.classList.contains('in')) io.observe(node)
      node.querySelectorAll('.b:not(.in)').forEach((el) => io.observe(el))
    }

    watch(root)
    const mo = new MutationObserver((muts) => muts.forEach((m) => m.addedNodes.forEach(watch)))
    mo.observe(root, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [rootRef, layerRef, enabled])
}

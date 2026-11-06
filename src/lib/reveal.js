import { useEffect } from 'react'

// Scroll-driven build-in on the bare background. Each `.b` element picks an effect
// with data-fx; the overlay part (selection box, CRT line, border trace) is drawn in
// a separate layer so nothing clips it, then the content animates in via CSS
// (.b.in[data-fx=...]). Elements entering together are staggered in document order.
// New `.b` nodes (data arriving, filters, "show all", scrolling the game rail) are
// picked up automatically.

const START = 250 // every batch waits a beat before it starts drawing
const HOLD = 140 // empty, finished box stays on screen this long before content arrives
const NO_FRAME_LAG = 380 // where effects without a frame start, relative to their slot

// overlay: which frame to draw · grow: how long the frame takes · fill: content anim length
const FX = {
  select: { overlay: 'box', grow: 460, fill: 560 },
  scan: { overlay: 'box', grow: 460, fill: 720 },
  crt: { overlay: 'crt', grow: 620, fill: 600 },
  trace: { overlay: 'trace', grow: 640, fill: 520 },
  type: { overlay: null, grow: 0, fill: 700 },
  rise: { overlay: null, grow: 0, fill: 620 },
  pop: { overlay: null, grow: 0, fill: 520 },
  slide: { overlay: null, grow: 0, fill: 640 },
  flip: { overlay: null, grow: 0, fill: 720 },
  drop: { overlay: null, grow: 0, fill: 520 },
}
const EASE = 'cubic-bezier(0.6, 0, 0.2, 1)'
const ROYAL = '#4a6cf7'

function stepMs(el) {
  const v = parseFloat(getComputedStyle(el).getPropertyValue('--step'))
  return Number.isFinite(v) ? v : 110
}

function fadeAndRemove(node, at) {
  node.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 320, delay: at, fill: 'forwards' }).finished.then(
    () => node.remove(),
    () => node.remove(),
  )
}

function frameFor(layer, el, pad) {
  const a = layer.getBoundingClientRect()
  const r = el.getBoundingClientRect()
  return {
    x: r.left - a.left - pad,
    y: r.top - a.top - pad,
    w: Math.round(r.width + pad * 2),
    h: Math.round(r.height + pad * 2),
  }
}

// Drag-selection box from the top-left corner, with a live size label.
function drawBox(layer, el, delay, cfg, fadeAt) {
  const pad = 4
  const { x, y, w, h } = frameFor(layer, el, pad)
  if (w < 4 || h < 4) return
  const box = document.createElement('div')
  box.className = 'sel'
  box.style.left = `${x}px`
  box.style.top = `${y}px`
  let tag = null
  if (el.dataset.tag) {
    tag = document.createElement('span')
    tag.className = 'sel__tag'
    tag.textContent = `${el.dataset.tag} · 0×0`
    box.appendChild(tag)
  }
  layer.appendChild(box)
  // fill 'forwards' (not 'both'): the box stays invisible (.sel has opacity 0)
  // until its own turn in the stagger.
  const grow = box.animate(
    [
      { width: '0px', height: '0px', opacity: 1 },
      { width: `${w}px`, height: `${h}px`, opacity: 1 },
    ],
    { duration: cfg.grow, delay, easing: EASE, fill: 'forwards' },
  )
  fadeAndRemove(box, fadeAt)
  if (tag) {
    const end = performance.now() + delay + cfg.grow + 40
    const tick = (now) => {
      const t = grow.effect?.getComputedTiming().progress ?? 1
      tag.textContent = `${el.dataset.tag} · ${Math.round(w * t)}×${Math.round(h * t)}`
      if (now < end && box.isConnected) requestAnimationFrame(tick)
      else tag.textContent = `${el.dataset.tag} · ${w - pad * 2}×${h - pad * 2}`
    }
    requestAnimationFrame(tick)
  }
}

// Old-monitor power-on: a bright horizontal line, then it opens vertically.
function drawCrt(layer, el, delay, cfg, fadeAt) {
  const { x, y, w, h } = frameFor(layer, el, 2)
  const box = document.createElement('div')
  box.className = 'sel sel--crt'
  Object.assign(box.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` })
  layer.appendChild(box)
  box.animate(
    [
      { transform: 'scale(0, 0.006)', opacity: 1, offset: 0 },
      { transform: 'scale(1, 0.006)', opacity: 1, offset: 0.45 },
      { transform: 'scale(1, 1)', opacity: 1, offset: 1 },
    ],
    { duration: cfg.grow, delay, easing: EASE, fill: 'forwards' },
  )
  fadeAndRemove(box, fadeAt)
}

// Border traced around the element's perimeter, like a pen going round.
function drawTrace(layer, el, delay, cfg, fadeAt) {
  const pad = 3
  const { x, y, w, h } = frameFor(layer, el, pad)
  if (w < 4 || h < 4) return
  const ns = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(ns, 'svg')
  svg.setAttribute('class', 'sel-trace')
  svg.setAttribute('width', w)
  svg.setAttribute('height', h)
  Object.assign(svg.style, { left: `${x}px`, top: `${y}px` })
  const rect = document.createElementNS(ns, 'rect')
  Object.entries({ x: 0.75, y: 0.75, width: w - 1.5, height: h - 1.5, rx: 16, pathLength: 1 }).forEach(([k, v]) =>
    rect.setAttribute(k, v),
  )
  Object.assign(rect.style, { fill: 'none', stroke: ROYAL, strokeWidth: 1.5, strokeDasharray: 1, strokeDashoffset: 1 })
  svg.appendChild(rect)
  layer.appendChild(svg)
  rect.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
    duration: cfg.grow,
    delay,
    easing: 'cubic-bezier(0.45, 0, 0.25, 1)',
    fill: 'forwards',
  })
  fadeAndRemove(svg, fadeAt)
}

const DRAW = { box: drawBox, crt: drawCrt, trace: drawTrace }

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
          io.unobserve(el)
          const cfg = FX[el.dataset.fx] || FX.select
          const delay = START + Math.min(k, 9) * step
          // content waits until the frame is fully drawn, plus a small hold
          // effects without a frame wait about as long as a frame would take, so
          // they never jump ahead of a headline that is still being drawn
          const fillDelay = delay + (cfg.overlay ? cfg.grow + HOLD : NO_FRAME_LAG)
          if (cfg.overlay) DRAW[cfg.overlay](layer, el, delay, cfg, fillDelay + cfg.fill * 0.55)
          el.style.setProperty('--fill-delay', `${fillDelay}ms`)
          el.style.setProperty('--fill-dur', `${cfg.fill}ms`)
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

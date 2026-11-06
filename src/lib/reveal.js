import { useEffect } from 'react'

// Scroll-driven build-in. Every `.b` element gets `.in` when it scrolls into view,
// which plays its wireframe -> fill animation. Elements that enter together are
// staggered in document order (`--d`). New `.b` nodes (data arriving, filters,
// "show all") are picked up automatically.
export function useReveal(rootRef, enabled) {
  useEffect(() => {
    const root = rootRef.current
    if (!enabled || !root) return

    const label = (el) => {
      if (!el.dataset.tag) return
      const r = el.getBoundingClientRect()
      el.dataset.label = `${el.dataset.tag} · ${Math.round(r.width)}×${Math.round(r.height)}`
    }

    const io = new IntersectionObserver(
      (entries) => {
        const hits = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target)
          .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
        hits.forEach((el, k) => {
          label(el)
          el.style.setProperty('--d', Math.min(k, 9))
          el.classList.add('in')
          io.unobserve(el)
        })
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    )

    const watch = (node) => {
      if (!(node instanceof Element)) return
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
  }, [rootRef, enabled])
}

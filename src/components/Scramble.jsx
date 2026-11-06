import { useEffect, useRef, useState } from 'react'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFXZ'

// Text that resolves from random glyphs into the real string, left to right.
// It starts when its revealed block (`.b`) actually becomes visible: the reveal
// system adds `.in` and a --fill-delay, and the scramble waits that long (+ `delay`)
// so it plays on screen instead of while the block is still hidden.
export default function Scramble({ text, start, delay = 0, duration = 900 }) {
  const [out, setOut] = useState(text)
  const ref = useRef(null)

  useEffect(() => {
    if (!start) return
    const host = ref.current?.closest('.b')
    let raf = 0
    let timer = 0
    let mo = null

    const run = (wait) => {
      // show glyphs right away so the first visible frame is already scrambled
      setOut(text.replace(/\S/g, () => GLYPHS[(Math.random() * GLYPHS.length) | 0]))
      timer = setTimeout(() => {
        let t0
        const tick = (now) => {
          t0 ??= now
          const p = Math.min(1, (now - t0) / duration)
          const fixed = Math.floor(p * text.length)
          let s = text.slice(0, fixed)
          for (let i = fixed; i < text.length; i++) {
            s += text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0]
          }
          setOut(s)
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      }, wait)
    }

    const fillDelay = () => parseFloat(host?.style.getPropertyValue('--fill-delay')) || 0
    const noMotion = host?.closest('.no-motion')

    if (!host || noMotion) {
      if (!noMotion) run(delay)
    } else if (host.classList.contains('in')) {
      run(fillDelay() + delay)
    } else {
      mo = new MutationObserver(() => {
        if (!host.classList.contains('in')) return
        mo.disconnect()
        run(fillDelay() + delay)
      })
      mo.observe(host, { attributes: true, attributeFilter: ['class'] })
    }

    return () => {
      mo?.disconnect()
      clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [start, text, delay, duration])

  return (
    <span aria-label={text} ref={ref}>
      <span aria-hidden="true">{out}</span>
    </span>
  )
}

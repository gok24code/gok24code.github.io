import { useEffect, useState } from 'react'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFXZ'

// Text that resolves from random glyphs into the real string, left to right.
export default function Scramble({ text, start, delay = 0, duration = 700 }) {
  const [out, setOut] = useState(text)

  useEffect(() => {
    if (!start) return
    let raf
    let t0
    const tick = (now) => {
      t0 ??= now + delay
      const p = Math.min(1, Math.max(0, (now - t0) / duration))
      const fixed = Math.floor(p * text.length)
      let s = text.slice(0, fixed)
      for (let i = fixed; i < text.length; i++) {
        s += text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0]
      }
      setOut(s)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, text, delay, duration])

  return (
    <span aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </span>
  )
}

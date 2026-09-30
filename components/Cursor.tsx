'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    document.documentElement.classList.add('has-cursor')
    const p = { x: innerWidth / 2, y: innerHeight / 2 }
    const r = { x: p.x, y: p.y }
    let raf = 0
    let mag: HTMLElement | null = null
    const move = (e: PointerEvent) => {
      document.documentElement.classList.add('cursor-live')
      p.x = e.clientX
      p.y = e.clientY
      const t = e.target as HTMLElement
      const interactive = t.closest('a,button,input,select,textarea,label,summary')
      const zone = t.closest('[data-cursor]') as HTMLElement | null
      ring.current?.classList.toggle('is-link', !!interactive)
      ring.current?.classList.toggle('is-drag', !interactive && zone?.dataset.cursor === 'drag')
      const m = t.closest('.magnetic') as HTMLElement | null
      if (mag && mag !== m) mag.style.transform = ''
      mag = m
      if (m) {
        const b = m.getBoundingClientRect()
        const dx = e.clientX - (b.left + b.width / 2)
        const dy = e.clientY - (b.top + b.height / 2)
        m.style.transform = `translate(${dx * 0.22}px, ${dy * 0.3}px)`
      }
    }
    const loop = () => {
      r.x += (p.x - r.x) * 0.18
      r.y += (p.y - r.y) * 0.18
      if (dot.current) dot.current.style.transform = `translate(${p.x}px, ${p.y}px)`
      if (ring.current) ring.current.style.transform = `translate(${r.x}px, ${r.y}px)`
      raf = requestAnimationFrame(loop)
    }
    loop()
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
    }
  }, [])
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden><span>Glisser</span></div>
      <div ref={dot} className="cursor-dot" aria-hidden />
    </>
  )
}

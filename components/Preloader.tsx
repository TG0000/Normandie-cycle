'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { xp } from '@/lib/experience'
import { Mark } from './Logo'

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null)
  const [n, setN] = useState(0)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.__lenis?.stop()
    document.documentElement.classList.add('is-loading')
    const o = { v: 0 }
    const t1 = gsap.to(o, { v: 86, duration: reduced ? 0.3 : 1.6, ease: 'power2.out', onUpdate: () => setN(Math.round(o.v)) })
    const start = performance.now()
    let raf = 0
    const finish = () => {
      t1.kill()
      gsap.to(o, {
        v: 100,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: () => setN(Math.round(o.v)),
        onComplete: () => {
          document.documentElement.classList.remove('is-loading')
          document.documentElement.classList.add('is-loaded')
          window.__lenis?.start()
          gsap.to(root.current, {
            clipPath: 'inset(0 0 100% 0)',
            duration: reduced ? 0.2 : 1.1,
            ease: 'expo.inOut',
            onComplete: () => setGone(true),
          })
        },
      })
    }
    const wait = () => {
      const t = performance.now() - start
      if ((xp.ready && t > 1500) || t > 7000) finish()
      else raf = requestAnimationFrame(wait)
    }
    raf = requestAnimationFrame(wait)
    return () => cancelAnimationFrame(raf)
  }, [])

  if (gone) return null
  return (
    <div ref={root} className="preloader" style={{ clipPath: 'inset(0 0 0% 0)' }} aria-hidden>
      <div className="pre-center">
        <Mark className="pre-mark" />
        <p className="pre-name d">Normandie Cycles</p>
        <p className="pre-sub">Specialized Store · Caen</p>
      </div>
      <div className="pre-foot">
        <span className="pre-count d">{String(n).padStart(3, '0')}</span>
        <span className="pre-bar"><i style={{ transform: `scaleX(${n / 100})` }} /></span>
        <span className="pre-label">Préparation du S-Works Tarmac SL9</span>
      </div>
    </div>
  )
}

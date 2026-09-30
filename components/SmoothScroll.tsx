'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: 0, duration: 1.6 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

/** Ouvre le formulaire de réservation avec un motif pré-sélectionné */
export function book(type?: string) {
  if (type) window.dispatchEvent(new CustomEvent('nc:book', { detail: type }))
  scrollToId('reserver')
}

export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis: Lenis | undefined
    const tick = (time: number) => lenis?.raf(time * 1000)
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.095, smoothWheel: true, wheelMultiplier: 0.95 })
      window.__lenis = lenis
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }

    // liens d'ancre internes → défilement doux
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const id = a.getAttribute('href')!.slice(1)
      if (!id || !document.getElementById(id)) return
      e.preventDefault()
      const type = a.dataset.book
      if (type) book(type)
      else scrollToId(id)
    }
    document.addEventListener('click', onClick)

    // révélations génériques
    const ctx = gsap.context(() => {
      if (reduced) return
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 88%',
        once: true,
        onEnter: (els) =>
          gsap.fromTo(els, { y: 48, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
      })
      gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
        const words = el.querySelectorAll('.w > span')
        gsap.fromTo(
          words,
          { yPercent: 110, rotate: 4 },
          { yPercent: 0, rotate: 0, duration: 1.2, ease: 'expo.out', stagger: 0.035, scrollTrigger: { trigger: el, start: 'top 85%', once: true } },
        )
      })
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const amt = Number(el.dataset.parallax) || 80
        gsap.fromTo(el, { y: amt }, { y: -amt, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
    })

    const ro = new ResizeObserver(() => ScrollTrigger.refresh())
    ro.observe(document.body)

    return () => {
      document.removeEventListener('click', onClick)
      ro.disconnect()
      ctx.revert()
      if (lenis) {
        gsap.ticker.remove(tick)
        lenis.destroy()
        window.__lenis = undefined
      }
    }
  }, [])
  return null
}

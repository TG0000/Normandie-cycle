'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SITE } from '@/lib/site'

const TEXT =
  'Depuis 2018, on équipe les cyclistes du Calvados. Route, gravel, VTT, électrique : des vélos Specialized choisis avec vous, réglés à vos cotes et entretenus ici, par des passionnés qui roulent autant que vous.'

export default function Manifesto() {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.mf-word',
        { opacity: 0.14 },
        { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: '.mf-text', start: 'top 80%', end: 'bottom 45%', scrub: true } },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  const stats = [
    { k: String(SITE.since), v: 'Ouverture à Fleury-sur-Orne' },
    { k: `${SITE.rating}/5`, v: `${SITE.reviewsCount} avis Google` },
    { k: '100 %', v: 'des vélos montés & réglés à l’atelier' },
    { k: 'Retül', v: 'Étude posturale 3D' },
  ]
  return (
    <section className="manifesto" ref={root}>
      <p className="eyebrow"><span className="dot-red" /> Le magasin</p>
      <p className="mf-text">
        {TEXT.split(' ').map((w, i) => (
          <span key={i} className="mf-word">{w} </span>
        ))}
      </p>
      <div className="mf-stats">
        {stats.map((s) => (
          <div key={s.v} data-reveal>
            <b className="d">{s.k}</b>
            <span>{s.v}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

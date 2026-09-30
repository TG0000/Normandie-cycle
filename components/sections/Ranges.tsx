'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BikeLine, { type Kind } from '@/components/BikeLine'
import Split from '@/components/Split'

const RANGES: { kind: Kind; name: string; models: string; text: string; tag: string }[] = [
  { kind: 'road', name: 'Route', models: 'Tarmac · Aethos · Roubaix · Allez', text: 'De la sortie du dimanche à la cyclosportive. Légers, rapides, réglés au millimètre.', tag: 'Performance' },
  { kind: 'gravel', name: 'Gravel', models: 'Crux · Diverge', text: 'Chemins de Suisse normande, voies vertes, bikepacking : la liberté hors bitume.', tag: 'Aventure' },
  { kind: 'mtb', name: 'VTT', models: 'Epic · Stumpjumper · Chisel · Rockhopper', text: 'Du cross-country aux singles de la forêt de Cinglais, pour tous les niveaux.', tag: 'Tout-terrain' },
  { kind: 'ebike', name: 'Électrique', models: 'Turbo Levo · Vado · Creo · Como', text: 'L’assistance Turbo : aller plus loin, monter plus haut, laisser la voiture au garage.', tag: 'Turbo' },
  { kind: 'city', name: 'Ville & Fitness', models: 'Sirrus · Turbo Vado · Turbo Como', text: 'Domicile-travail, courses, balades le long de l’Orne. Simple, fiable, confortable.', tag: 'Quotidien' },
  { kind: 'kids', name: 'Enfants', models: 'Hotrock · Jett · Riprock', text: 'Leurs premiers tours de roue sur un vrai vélo, à la bonne taille et bien réglé.', tag: 'Juniors' },
]

export default function Ranges() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const t = track.current!
      const dist = () => t.scrollWidth - window.innerWidth + 64
      const tween = gsap.to(t, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
      gsap.utils.toArray<HTMLElement>('.range-card').forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          containerAnimation: tween,
          start: 'left 85%',
          onEnter: () => card.classList.add('is-drawn'),
        })
      })
    })
    mm.add('(max-width: 899px), (prefers-reduced-motion: reduce)', () => {
      gsap.utils.toArray<HTMLElement>('.range-card').forEach((card) => {
        ScrollTrigger.create({ trigger: card, start: 'top 85%', onEnter: () => card.classList.add('is-drawn') })
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="univers" ref={root} className="ranges">
      <div className="ranges-head">
        <p className="eyebrow"><span className="dot-red" /> Nos univers</p>
        <Split as="h2" className="d h-xl" lines={['Trouvez', 'votre *terrain.*']} />
        <p className="ranges-lede" data-reveal>
          Toute la gamme Specialized, du premier vélo d’enfant au S-Works. On vous conseille, vous essayez, on règle.
        </p>
      </div>
      <div className="ranges-viewport">
        <div className="ranges-track" ref={track}>
          {RANGES.map((r, i) => (
            <article className="range-card" key={r.kind}>
              <div className="range-top">
                <span className="range-idx d">{String(i + 1).padStart(2, '0')}</span>
                <span className="range-tag">{r.tag}</span>
              </div>
              <BikeLine kind={r.kind} />
              <h3 className="d range-name">{r.name}</h3>
              <p className="range-models">{r.models}</p>
              <p className="range-text">{r.text}</p>
              <a href="#reserver" data-book="conseil" className="range-cta">
                Demander conseil <span>→</span>
              </a>
            </article>
          ))}
          <article className="range-card range-card-end">
            <p className="d">Équipement</p>
            <ul>
              <li>Casques Specialized</li>
              <li>Chaussures S-Works</li>
              <li>Textile & vêtements</li>
              <li>Pièces & accessoires</li>
              <li>Selles Body Geometry</li>
            </ul>
            <a href="#magasin" className="btn btn-ghost">Venir en magasin</a>
          </article>
        </div>
      </div>
    </section>
  )
}

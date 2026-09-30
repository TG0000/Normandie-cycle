'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { COLORWAYS, setXp, useXp, xp } from '@/lib/experience'
import { CHAPTERS, HOTSPOTS, chapterAt } from '@/components/photo/views'
import SL9Stage from '@/components/photo/SL9Stage'
import { SITE } from '@/lib/site'
import OpenBadge from '@/components/OpenBadge'

const RAIL = ['Intro', 'Cadre', 'Aéro', 'Roues', 'Pilotage', 'Transmission', 'Couleurs']

function Counter({ to, run, decimals = 0 }: { to: number; run: boolean; decimals?: number }) {
  const [v, setV] = useState(to)
  const done = useRef(false)
  useEffect(() => {
    if (!run || done.current) return
    done.current = true
    const o = { v: 0 }
    gsap.to(o, { v: to, duration: 1.6, ease: 'expo.out', onUpdate: () => setV(o.v) })
  }, [run, to])
  return <>{v.toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>
}

export default function Experience() {
  const root = useRef<HTMLElement>(null)
  const { chapter, colorway } = useXp()
  const [canvasOn, setCanvasOn] = useState(true)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const el = root.current!
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          xp.progress = self.progress
          el.style.setProperty('--p', self.progress.toFixed(4))
          setXp({ chapter: chapterAt(self.progress) })
        },
      })
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => setCanvasOn(self.isActive),
      })

      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.6 } })
      tl.to({}, { duration: 1 }, 0)
      const blocks = gsap.utils.toArray<HTMLElement>('.xp-ch')
      blocks.forEach((b, i) => {
        const { in: a, out: z } = CHAPTERS[i]
        const inner = b.querySelectorAll('[data-in]')
        if (i === 0) {
          tl.to([b, '.xp-hero-tag'], { autoAlpha: 0, y: -80, duration: 0.05, ease: 'power2.in' }, 0.035)
          return
        }
        tl.fromTo(b, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.02 }, a)
        tl.fromTo(inner, { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.05, stagger: 0.008, ease: 'power3.out' }, a)
        if (z < 1) tl.to(b, { autoAlpha: 0, y: -70, duration: 0.035, ease: 'power2.in' }, z - 0.035)
      })
      tl.fromTo('.xp-hint', { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.02 }, 0.02)
    }, el)

    const onMove = (e: PointerEvent) => {
      xp.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      xp.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      ctx.revert()
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  const cw = COLORWAYS.find((c) => c.id === colorway)!

  return (
    <section id="sl9" ref={root} className="xp" aria-label="S-Works Tarmac SL9 en 3D">
      <div className="xp-sticky">
        <div className="xp-studio" aria-hidden />
        <div className="xp-canvas">
          <SL9Stage active={canvasOn} />
        </div>
        <div className="xp-shade" aria-hidden />
        <div className="xp-hotspots" aria-hidden>
          {HOTSPOTS.map((h, i) => (
            <div key={i} data-hotspot className="hotspot-anchor">
              <div className={`hotspot ${chapter === h.ch ? 'is-on' : ''}`} style={{ transitionDelay: chapter === h.ch ? `${(i % 2) * 140 + 350}ms` : '0ms' }}>
                <span className="hotspot-dot" />
                <span className="hotspot-label">
                  <b>{h.t}</b>
                  <i>{h.s}</i>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 0 — HERO */}
        <div className="xp-ch xp-hero">
          <p className="eyebrow hero-in" style={{ ['--d' as string]: '0.05s' }}>
            <span className="dot-red" /> Specialized Store · Caen — Fleury-sur-Orne
          </p>
          <h1 className="hero-title d">
            <span className="line"><span className="hero-in" style={{ ['--d' as string]: '0.1s' }}>Roulez</span></span>
            <span className="line"><span className="hero-in" style={{ ['--d' as string]: '0.18s' }}>plus <em>loin.</em></span></span>
          </h1>
          <p className="hero-sub hero-in" style={{ ['--d' as string]: '0.34s' }}>
            Vélos route, gravel, VTT et électriques Specialized. Atelier toutes marques et étude posturale Retül — à 10 minutes du centre de Caen.
          </p>
          <div className="hero-ctas hero-in" style={{ ['--d' as string]: '0.44s' }}>
            <a href="#reserver" data-book="essai" className="btn btn-red magnetic">
              Réserver un essai <span className="btn-arrow">→</span>
            </a>
            <a href="#magasin" className="btn btn-ghost magnetic">Venir au magasin</a>
          </div>
          <div className="hero-meta hero-in" style={{ ['--d' as string]: '0.54s' }}>
            <a href={SITE.reviewsUrl} target="_blank" rel="noopener" className="meta-item">
              <span className="stars" aria-hidden>★★★★★</span>
              <span><b>{SITE.rating}/5</b> · {SITE.reviewsCount} avis Google</span>
            </a>
            <OpenBadge compact />
            <a href={SITE.phoneHref} className="meta-item">{SITE.phone}</a>
          </div>
        </div>
        <div className="xp-hero-tag hero-in" style={{ ['--d' as string]: '0.7s' }} aria-hidden={chapter !== 0}>
          <span className="tag-new">Nouveau</span>
          <span className="d">S-Works Tarmac SL9</span>
          <span className="tag-sub">Disponible à l&apos;essai sur rendez-vous</span>
        </div>
        <div className="xp-hint" aria-hidden>
          <span>Scrollez pour explorer</span>
          <span className="xp-hint-line" />
        </div>

        {/* 1 — CADRE */}
        <div className="xp-ch xp-left">
          <p className="ch-num" data-in>01 — Cadre FACT 12r</p>
          <p className="ch-big d" data-in>
            <Counter to={687} run={chapter >= 1} /> <small>g</small>
          </p>
          <p className="ch-text" data-in>
            Le cadre du S-Works Tarmac SL9. Conçu selon le <b>Flow State Design</b>&nbsp;: la forme reprend les charges et chaque pli de carbone est placé là où il travaille. Moins de matière, zéro compromis sur la rigidité.
          </p>
          <div className="ch-stats" data-in>
            <div><b>6,5 kg</b><span>vélo complet, à partir de</span></div>
            <div><b>32 mm</b><span>passage de pneus</span></div>
          </div>
        </div>

        {/* 2 — AERO */}
        <div className="xp-ch xp-left">
          <p className="ch-num" data-in>02 — Aérodynamique</p>
          <p className="ch-big d" data-in>
            −4 <small>watts</small>
          </p>
          <p className="ch-text" data-in>
            Face au SL8, à 45&nbsp;km/h. La nouvelle <b>Flow Fork</b> se fond dans un tube diagonal abaissé&nbsp;: l&apos;air glisse, le vélo file. Même face au vent de la plaine de Caen.
          </p>
        </div>

        {/* 3 — ROUES */}
        <div className="xp-ch xp-left">
          <p className="ch-num" data-in>03 — Roues Roval</p>
          <p className="ch-big d" data-in>
            CLX <small>III</small>
          </p>
          <p className="ch-text" data-in>
            Roval Rapide CLX III&nbsp;: rayons carbone, jantes hautes et pneus Cotton. Légères, rigides, stables dans les rafales du bocage. <b>Scrollez&nbsp;: elles tournent.</b>
          </p>
          <div className="ch-stats" data-in>
            <div><b>Carbone</b><span>rayons & jantes</span></div>
            <div><b>30 mm</b><span>pneus Cotton</span></div>
          </div>
        </div>

        {/* 4 — PILOTAGE */}
        <div className="xp-ch xp-left">
          <p className="ch-num" data-in>04 — Pilotage</p>
          <p className="ch-big d" data-in>
            AXS <small>sans fil</small>
          </p>
          <p className="ch-text" data-in>
            Cockpit Roval Rapide monobloc, leviers SRAM RED AXS. Passages instantanés, aucun câble apparent&nbsp;: le poste de pilotage d&apos;un vélo du WorldTour.
          </p>
        </div>

        {/* 5 — ÉCLATÉ */}
        <div className="xp-ch xp-left">
          <p className="ch-num" data-in>05 — Transmission · Préparé ici</p>
          <p className="ch-big d ch-big-sm" data-in>
            Chaque pièce <em>compte.</em>
          </p>
          <p className="ch-text" data-in>
            SRAM RED AXS 2×12, freins à disque, réglée au millimètre par notre atelier. Montage, réglages, étude posturale Retül&nbsp;: vous repartez avec un vélo à vos cotes, pas un vélo sorti du carton.
          </p>
          <a href="#retul" className="link-arrow" data-in>
            Découvrir l&apos;étude posturale <span>→</span>
          </a>
        </div>

        {/* 6 — CONFIGURATEUR */}
        <div className="xp-ch xp-config">
          <div className="cfg-head" data-in>
            <p className="ch-num">06 — Votre SL9</p>
            <h2 className="d cfg-title">S-Works Tarmac SL9</h2>
            <p className="cfg-spec">Modèle présenté&nbsp;: SRAM RED AXS · Existe en Shimano Dura-Ace Di2 · Cadre seul 5&nbsp;799&nbsp;€</p>
          </div>
          <div className="cfg-bottom">
          <div className="cfg-bar" data-in>
            <div className="cfg-swatches" role="radiogroup" aria-label="Finition">
              {COLORWAYS.map((c) => (
                <button
                  key={c.id}
                  role="radio"
                  aria-checked={colorway === c.id}
                  className={`swatch ${colorway === c.id ? 'is-on' : ''}`}
                  onClick={() => setXp({ colorway: c.id })}
                  title={c.name}
                >
                  <span style={{ background: c.swatch }} />
                </button>
              ))}
              <div className="cfg-cw">
                <b>{cw.name}</b>
                <span>{cw.sub}</span>
              </div>
            </div>
            <div className="cfg-price">
              <span className="cfg-from">Prix public · version Dura-Ace Di2</span>
              <b className="d">13&nbsp;999&nbsp;€</b>
            </div>
            <div className="cfg-ctas">
              <a href="#reserver" data-book="essai" className="btn btn-red magnetic">
                Réserver un essai <span className="btn-arrow">→</span>
              </a>
              <a href="#reserver" data-book="conseil" className="btn btn-ghost magnetic">Être rappelé</a>
            </div>
          </div>
          <p className="cfg-note" data-in>
            Photo réelle Red Tint · autres teintes&nbsp;: aperçu simulé, coloris disponibles à confirmer en magasin.
          </p>
          </div>
        </div>

        {/* Rail de progression */}
        <nav className={`xp-rail ${chapter === 0 || chapter === 6 ? 'is-off' : ''}`} aria-hidden>
          {RAIL.map((r, i) => (
            <span key={r} className={chapter === i ? 'is-on' : chapter > i ? 'is-past' : ''}>
              <i>{String(i).padStart(2, '0')}</i>
              {r}
            </span>
          ))}
          <b className="xp-rail-bar" />
        </nav>
      </div>
    </section>
  )
}

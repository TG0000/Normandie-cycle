'use client'

import { useEffect, useRef } from 'react'
import Split from '@/components/Split'

type P = { x: number; y: number }
const sub = (a: P, b: P) => ({ x: a.x - b.x, y: a.y - b.y })
const len = (a: P) => Math.hypot(a.x, a.y)

/** Genou/coude : intersection de deux cercles (IK 2 segments) */
function joint(a: P, b: P, l1: number, l2: number, sign: 1 | -1): P {
  const d = Math.min(len(sub(b, a)), l1 + l2 - 0.01)
  const ex = sub(b, a)
  const el = len(ex) || 1
  const ux = { x: ex.x / el, y: ex.y / el }
  const x = (d * d + l1 * l1 - l2 * l2) / (2 * d)
  const h = Math.sqrt(Math.max(0, l1 * l1 - x * x))
  return { x: a.x + ux.x * x - ux.y * h * sign, y: a.y + ux.y * x + ux.x * h * sign }
}
const angleAt = (o: P, a: P, b: P) => {
  const v1 = sub(a, o)
  const v2 = sub(b, o)
  return (Math.acos((v1.x * v2.x + v1.y * v2.y) / (len(v1) * len(v2))) * 180) / Math.PI
}

const BB = { x: 250, y: 318 }
const HIP = { x: 214, y: 164 }
const SHOULDER = { x: 352, y: 88 }
const HAND = { x: 432, y: 132 }
const CRANK = 36
const THIGH = 96
const SHIN = 94

export default function Retul() {
  const svg = useRef<SVGSVGElement>(null)
  const readout = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = svg.current!
    const q = (id: string) => el.querySelector(`#${id}`) as SVGElement
    const legN = q('leg-near')
    const legF = q('leg-far')
    const crank = q('crank')
    const crankF = q('crank-far')
    const arm = q('arm')
    const arc = q('knee-arc')
    const markers = ['m-ankle', 'm-knee', 'm-heel', 'm-toe'].map((id) => q(id))
    const kneeTxt = readout.current!.querySelector('[data-k="knee"]')!
    const hipTxt = readout.current!.querySelector('[data-k="hip"]')!
    const extTxt = readout.current!.querySelector('[data-k="ext"]')!
    const backTxt = readout.current!.querySelector('[data-k="back"]')!
    const backAngle = (Math.atan2(HIP.y - SHOULDER.y, SHOULDER.x - HIP.x) * 180) / Math.PI
    backTxt.textContent = `${Math.round(backAngle)}°`
    let maxExt = 0
    let th = 0
    let raf = 0
    let last = performance.now()
    let visible = false
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(el)

    const leg = (a: number) => {
      const pedal = { x: BB.x + Math.cos(a) * CRANK, y: BB.y + Math.sin(a) * CRANK }
      const ankle = { x: pedal.x - 6, y: pedal.y - 12 }
      const knee = joint(HIP, ankle, THIGH, SHIN, -1)
      const toe = { x: pedal.x + 22, y: pedal.y + 2 }
      const heel = { x: ankle.x - 16, y: ankle.y + 8 }
      return { pedal, ankle, knee, toe, heel }
    }
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (visible && !reduced) th += dt * 4.2
      const a = th
      const n = leg(a)
      const f = leg(a + Math.PI)
      legN.setAttribute('d', `M${HIP.x} ${HIP.y} L${n.knee.x} ${n.knee.y} L${n.ankle.x} ${n.ankle.y} L${n.heel.x} ${n.heel.y} L${n.toe.x} ${n.toe.y}`)
      legF.setAttribute('d', `M${HIP.x} ${HIP.y} L${f.knee.x} ${f.knee.y} L${f.ankle.x} ${f.ankle.y} L${f.toe.x} ${f.toe.y}`)
      crank.setAttribute('d', `M${BB.x} ${BB.y} L${n.pedal.x} ${n.pedal.y}`)
      crankF.setAttribute('d', `M${BB.x} ${BB.y} L${f.pedal.x} ${f.pedal.y}`)
      const elbow = joint(SHOULDER, HAND, 62, 58, 1)
      arm.setAttribute('d', `M${SHOULDER.x} ${SHOULDER.y} L${elbow.x} ${elbow.y} L${HAND.x} ${HAND.y}`)
      const pts = [n.ankle, n.knee, n.heel, n.toe]
      markers.forEach((m, i) => {
        m.setAttribute('cx', String(pts[i].x))
        m.setAttribute('cy', String(pts[i].y))
      })
      const knee = angleAt(n.knee, HIP, n.ankle)
      const hip = angleAt(HIP, SHOULDER, n.knee)
      maxExt = Math.max(maxExt * 0.999, knee)
      // arc au genou
      const v1 = sub(HIP, n.knee)
      const v2 = sub(n.ankle, n.knee)
      const a1 = Math.atan2(v1.y, v1.x)
      const a2 = Math.atan2(v2.y, v2.x)
      const r = 26
      const p1 = { x: n.knee.x + Math.cos(a1) * r, y: n.knee.y + Math.sin(a1) * r }
      const p2 = { x: n.knee.x + Math.cos(a2) * r, y: n.knee.y + Math.sin(a2) * r }
      arc.setAttribute('d', `M${p1.x} ${p1.y} A${r} ${r} 0 0 0 ${p2.x} ${p2.y}`)
      kneeTxt.textContent = `${Math.round(knee)}°`
      hipTxt.textContent = `${Math.round(hip)}°`
      extTxt.textContent = `${Math.round(maxExt)}°`
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])

  const steps = [
    { t: 'Entretien', d: 'Votre pratique, vos objectifs, vos douleurs éventuelles, votre historique.' },
    { t: 'Capture 3D', d: 'Des marqueurs sur les articulations, et le système Retül enregistre votre pédalage en mouvement.' },
    { t: 'Réglages', d: 'Hauteur et recul de selle, cintre, potence, cales : chaque ajustement est mesuré.' },
    { t: 'Vos cotes', d: 'Un rapport complet, réutilisable pour régler tous vos vélos, aujourd’hui et demain.' },
  ]

  return (
    <section id="retul" className="retul">
      <div className="retul-copy">
        <p className="eyebrow"><span className="dot-red" /> Étude posturale Retül Fit</p>
        <Split as="h2" className="d h-xl" lines={['Votre corps.', 'Vos *cotes.*']} />
        <p className="retul-lede" data-reveal>
          Plus de confort, plus de puissance, moins de douleurs. L’étude posturale Retül analyse votre position en 3D pendant que vous pédalez, pour régler votre vélo au millimètre.
        </p>
        <ol className="retul-steps">
          {steps.map((s, i) => (
            <li key={s.t} data-reveal>
              <span className="d">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <b>{s.t}</b>
                <p>{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
        <a href="#reserver" data-book="retul" className="btn btn-red magnetic" data-reveal>
          Réserver mon étude posturale <span className="btn-arrow">→</span>
        </a>
      </div>

      <div className="retul-vis" data-reveal>
        <div className="retul-screen">
          <div className="retul-hud">
            <span className="rec"><i /> REC · capture dynamique</span>
            <span>Vue côté droit · 90 rpm</span>
          </div>
          <svg ref={svg} viewBox="0 0 520 420" className="retul-svg" role="img" aria-label="Animation d’un cycliste analysé par Retül : angles du genou et de la hanche mesurés en temps réel">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="520" height="420" fill="url(#grid)" />
            {/* vélo */}
            <g className="rs-bike">
              <circle cx="120" cy="318" r="88" />
              <circle cx="408" cy="318" r="88" />
              <path d="M120 318 L250 318 L206 178 L120 318 M206 178 L372 170 L380 200 L250 318 M380 200 L408 318 M204 172 L196 150 M176 148 L230 148 M372 170 L380 146 L420 140 q18 2 16 22 q-2 16 -18 14" />
            </g>
            <path id="leg-far" className="rs-far" />
            <path id="crank-far" className="rs-crank rs-far" />
            {/* buste, tête, bras */}
            <path className="rs-body" d={`M${HIP.x} ${HIP.y} L${SHOULDER.x} ${SHOULDER.y}`} />
            <circle className="rs-head" cx={SHOULDER.x + 36} cy={SHOULDER.y - 34} r="22" />
            <path id="arm" className="rs-body" />
            <path id="leg-near" className="rs-leg" />
            <path id="crank" className="rs-crank" />
            <circle cx={BB.x} cy={BB.y} r="10" className="rs-bb" />
            <path id="knee-arc" className="rs-arc" />
            <path className="rs-guide" d={`M${HIP.x - 60} ${HIP.y} L${SHOULDER.x + 60} ${HIP.y}`} />
            {/* marqueurs Retül */}
            {[HIP, SHOULDER, HAND].map((p, i) => (
              <circle key={i} className="rs-m" cx={p.x} cy={p.y} r="5" />
            ))}
            <circle id="m-ankle" className="rs-m" r="5" />
            <circle id="m-knee" className="rs-m" r="5" />
            <circle id="m-heel" className="rs-m" r="4" />
            <circle id="m-toe" className="rs-m" r="4" />
          </svg>
          <div className="retul-readout" ref={readout}>
            <div><span>Genou</span><b data-k="knee">—</b></div>
            <div><span>Extension max</span><b data-k="ext">—</b></div>
            <div><span>Hanche</span><b data-k="hip">—</b></div>
            <div><span>Dos</span><b data-k="back">—</b></div>
          </div>
        </div>
      </div>
    </section>
  )
}

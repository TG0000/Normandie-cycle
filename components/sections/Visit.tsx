'use client'

import { useEffect, useState } from 'react'
import Split from '@/components/Split'
import OpenBadge from '@/components/OpenBadge'
import { HOURS, SITE, fmtMin, getOpenStatus } from '@/lib/site'

export default function Visit() {
  const [today, setToday] = useState<number | null>(null)
  const [mapOn, setMapOn] = useState(false)
  useEffect(() => setToday(getOpenStatus().today), [])

  return (
    <section id="magasin" className="visit">
      <div className="visit-info">
        <p className="eyebrow"><span className="dot-red" /> Le magasin</p>
        <Split as="h2" className="d h-xl" lines={['Venez', '*rouler* chez nous.']} />
        <OpenBadge />
        <address className="visit-addr" data-reveal>
          <b>Normandie Cycles — Specialized</b>
          <span>{SITE.street}</span>
          <span>{SITE.zip} {SITE.city}</span>
          <span className="visit-muted">Accès également par le {SITE.street2} · Au sud de Caen, route d’Harcourt (D562)</span>
        </address>
        <table className="hours" data-reveal>
          <caption className="sr-only">Horaires d’ouverture</caption>
          <tbody>
            {HOURS.map((h) => (
              <tr key={h.day} className={today === h.day ? 'is-today' : ''}>
                <th scope="row">{h.label}{today === h.day && <em>aujourd’hui</em>}</th>
                <td>{h.slots.length ? h.slots.map(([a, b]) => `${fmtMin(a)} – ${fmtMin(b)}`).join('  ·  ') : 'Fermé'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="visit-ctas" data-reveal>
          <a href={SITE.mapsDirections} target="_blank" rel="noopener" className="btn btn-red magnetic">Itinéraire <span className="btn-arrow">↗</span></a>
          <a href={SITE.phoneHref} className="btn btn-ghost magnetic">{SITE.phone}</a>
        </div>
      </div>
      <div className="visit-map" data-reveal>
        {mapOn ? (
          <iframe title="Plan d’accès Normandie Cycles" src={SITE.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        ) : (
          <button className="map-placeholder" onClick={() => setMapOn(true)}>
            <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden>
              <defs>
                <pattern id="mapgrid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M24 0H0V24" fill="none" stroke="rgba(255,255,255,.06)" />
                </pattern>
              </defs>
              <rect width="400" height="400" fill="url(#mapgrid)" />
              <path d="M-10 150 C60 170 110 120 170 140 S260 170 300 120 S370 80 410 90" className="mp-river" />
              <path d="M150 -10 C160 60 175 110 190 150 S214 250 222 410" className="mp-road" />
              <path d="M-10 250 C80 240 150 225 205 215 S320 200 410 210" className="mp-road mp-road-2" />
              <path d="M40 -10 C60 80 80 150 110 200 S150 330 140 410" className="mp-road mp-road-2" />
              <text x="176" y="70" className="mp-label">CAEN</text>
              <text x="232" y="330" className="mp-label mp-label-sm">D562 · route d’Harcourt</text>
              <text x="236" y="252" className="mp-label mp-label-sm">Fleury-sur-Orne</text>
              <text x="40" y="128" className="mp-label mp-label-sm">L’Orne</text>
              <circle cx="212" cy="240" r="26" className="mp-pulse" />
              <circle cx="212" cy="240" r="9" className="mp-dot" />
            </svg>
            <span className="mp-cta">Afficher la carte interactive</span>
          </button>
        )}
      </div>
    </section>
  )
}

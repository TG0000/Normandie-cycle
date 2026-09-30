import { HOURS, SITE, fmtMin } from '@/lib/site'
import { Mark } from './Logo'

const AREAS = ['Caen', 'Fleury-sur-Orne', 'Ifs', 'Mondeville', 'Hérouville-Saint-Clair', 'Louvigny', 'Bretteville-sur-Odon', 'Saint-André-sur-Orne', 'Cormelles-le-Royal', 'Thury-Harcourt']

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-cta">
        <p className="d">Prêt à rouler ?</p>
        <div>
          <a href="#reserver" className="btn btn-red magnetic">Réserver un essai <span className="btn-arrow">→</span></a>
          <a href={SITE.mapsDirections} target="_blank" rel="noopener" className="btn btn-ghost magnetic">Itinéraire ↗</a>
        </div>
      </div>
      <div className="footer-grid">
        <div>
          <h3>Magasin</h3>
          <p>{SITE.street}<br />{SITE.zip} {SITE.city}</p>
          <p><a href={SITE.phoneHref}>{SITE.phone}</a></p>
        </div>
        <div>
          <h3>Horaires</h3>
          <ul className="f-hours">
            {HOURS.filter((h) => h.slots.length).map((h) => (
              <li key={h.day}><span>{h.label.slice(0, 3)}.</span> {h.slots.map(([a, b]) => `${fmtMin(a)}–${fmtMin(b)}`).join(' / ')}</li>
            ))}
            <li><span>Dim. & lun.</span> Fermé</li>
          </ul>
        </div>
        <div>
          <h3>Explorer</h3>
          <ul>
            <li><a href="#sl9">S-Works Tarmac SL9</a></li>
            <li><a href="#univers">Route, gravel, VTT, électrique</a></li>
            <li><a href="#atelier">Atelier toutes marques</a></li>
            <li><a href="#retul">Étude posturale Retül</a></li>
            <li><a href="#offres">Essai, occasion, location</a></li>
            <li><a href="#faq">Questions fréquentes</a></li>
          </ul>
        </div>
        <div>
          <h3>Nous venons de</h3>
          <p className="f-areas">{AREAS.join(' · ')}</p>
        </div>
      </div>
      <div className="footer-word" aria-hidden>
        <Mark className="fw-mark" />
        <span className="d">Normandie Cycles</span>
      </div>
      <div className="footer-legal">
        <span>© {new Date().getFullYear()} Normandie Cycles · Magasin de vélos à Fleury-sur-Orne, près de Caen (14)</span>
        <span>Specialized, S-Works, Tarmac, Roval et Retül sont des marques de Specialized Bicycle Components, Inc.</span>
      </div>
    </footer>
  )
}

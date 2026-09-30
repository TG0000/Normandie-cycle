import { SITE } from '@/lib/site'

export default function MobileBar() {
  return (
    <div className="mobilebar" role="navigation" aria-label="Actions rapides">
      <a href={SITE.phoneHref}>
        <svg viewBox="0 0 24 24" aria-hidden><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill="currentColor"/></svg>
        Appeler
      </a>
      <a href={SITE.mapsDirections} target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" aria-hidden><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill="currentColor"/></svg>
        Itinéraire
      </a>
      <a href="#reserver" className="is-red">Réserver</a>
    </div>
  )
}

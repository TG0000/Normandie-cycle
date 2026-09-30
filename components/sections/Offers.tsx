import Split from '@/components/Split'

const OFFERS = [
  { k: 'Essai', t: 'Essayez avant de choisir', d: 'Vélos d’essai route, gravel, VTT et électriques. Prenez rendez-vous : on prépare le vélo à votre taille.', cta: 'Réserver un essai', book: 'essai' },
  { k: 'Occasion', t: 'Occasion révisée', d: 'Des vélos d’occasion de qualité, contrôlés et révisés par notre atelier. La bonne affaire, sans mauvaise surprise.', cta: 'Voir les arrivages', book: 'conseil' },
  { k: 'Location', t: 'Location', d: 'Un week-end, des vacances en Normandie ou envie de tester une pratique ? Louez le vélo adapté.', cta: 'Demander une location', book: 'location' },
]

export default function Offers() {
  return (
    <section id="offres" className="offers">
      <div className="offers-head">
        <p className="eyebrow"><span className="dot-red" /> Essai · Occasion · Location</p>
        <Split as="h2" className="d h-xl" lines={['Le bon vélo,', '*sans risque.*']} />
      </div>
      <div className="offers-grid">
        {OFFERS.map((o, i) => (
          <article key={o.k} className="offer" data-reveal>
            <span className="offer-k d">{o.k}</span>
            <span className="offer-i">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="d">{o.t}</h3>
            <p>{o.d}</p>
            <a href="#reserver" data-book={o.book} className="link-arrow">
              {o.cta} <span>→</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

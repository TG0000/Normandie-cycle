import Split from '@/components/Split'

const SERVICES = [
  { n: '01', t: 'Révision & entretien', d: 'Contrôle complet, réglage de la transmission et des freins, serrages au couple. Votre vélo repart comme au premier jour.' },
  { n: '02', t: 'Réparation toutes marques', d: 'Crevaison, câbles, roulements, voilage de roue… Specialized ou pas, on répare tous les vélos.' },
  { n: '03', t: 'Vélos électriques', d: 'Diagnostic moteur et batterie, mises à jour logicielles, entretien spécifique VAE.' },
  { n: '04', t: 'Montage & upgrade', d: 'Roues, transmission, cockpit, capteur de puissance : on monte vos pièces et on optimise votre vélo.' },
  { n: '05', t: 'Tubeless & pneus', d: 'Passage en tubeless, choix des pneus et des pressions selon votre pratique et votre terrain.' },
  { n: '06', t: 'Préparation vélo neuf', d: 'Chaque vélo vendu est monté, contrôlé et réglé par nos mécaniciens avant de vous être remis.' },
]

export default function Workshop() {
  return (
    <section id="atelier" className="workshop">
      <div className="ws-side">
        <p className="eyebrow eyebrow-dark"><span className="dot-red" /> L’atelier</p>
        <Split as="h2" className="d h-xl" lines={['Toutes', 'marques.', '*Tous* vélos.']} />
        <p className="ws-lede" data-reveal>
          Des mécaniciens qualifiés, l’outillage Specialized et le temps de bien faire. On vous explique ce qu’on fait, et on vous conseille pour la suite.
        </p>
        <div className="ws-ctas" data-reveal>
          <a href="#reserver" data-book="atelier" className="btn btn-red magnetic">Prendre rendez-vous <span className="btn-arrow">→</span></a>
        </div>
      </div>
      <ol className="ws-list">
        {SERVICES.map((s) => (
          <li key={s.n} className="ws-item" data-reveal>
            <span className="ws-n d">{s.n}</span>
            <div>
              <h3 className="d">{s.t}</h3>
              <p>{s.d}</p>
            </div>
            <a href="#reserver" data-book="atelier" className="ws-go" aria-label={`Réserver : ${s.t}`}>→</a>
          </li>
        ))}
      </ol>
    </section>
  )
}

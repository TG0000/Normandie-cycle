import { SITE } from '@/lib/site'

export const FAQ = [
  { q: 'Réparez-vous les vélos d’autres marques que Specialized ?', a: 'Oui. Notre atelier entretient et répare tous les vélos, toutes marques : route, VTT, gravel, ville et vélos électriques.' },
  { q: 'Faut-il prendre rendez-vous pour l’atelier ?', a: `C’est recommandé pour être servi rapidement. Réservez via le formulaire ou appelez-nous au ${SITE.phone}.` },
  { q: 'Peut-on essayer un vélo avant de l’acheter ?', a: 'Oui, nous disposons de vélos d’essai. Prenez rendez-vous pour que le vélo soit prêt et réglé à votre taille à votre arrivée.' },
  { q: 'Qu’est-ce que l’étude posturale Retül ?', a: 'Une analyse 3D de votre position pendant que vous pédalez. Elle permet de régler selle, cintre et cales pour gagner en confort, en efficacité et prévenir les douleurs.' },
  { q: 'Vendez-vous des vélos d’occasion ?', a: 'Oui, des vélos d’occasion de qualité, révisés par notre atelier. Les arrivages changent souvent : demandez-nous ce qui est disponible.' },
  { q: 'Quels sont vos horaires ?', a: 'Du mardi au vendredi de 9h30 à 12h et de 14h à 19h, le samedi de 9h30 à 12h et de 14h à 18h. Fermé dimanche et lundi.' },
  { q: 'Proposez-vous la location de vélos ?', a: 'Oui, contactez-nous pour connaître les vélos disponibles à la location et les tarifs.' },
]

export default function Faq() {
  return (
    <section id="faq" className="faq">
      <div className="faq-head">
        <p className="eyebrow"><span className="dot-red" /> Questions fréquentes</p>
        <h2 className="d h-lg">On vous répond.</h2>
      </div>
      <div className="faq-list">
        {FAQ.map((f) => (
          <details key={f.q} className="faq-item" data-reveal>
            <summary>
              <span>{f.q}</span>
              <i aria-hidden />
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

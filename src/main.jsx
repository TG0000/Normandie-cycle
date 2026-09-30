import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Phone,
  MapPin,
  Menu,
  X,
  Plus,
  Minus,
  MoveUpRight,
  Instagram,
} from "lucide-react";
import "@fontsource/barlow-condensed/latin-700.css";
import "@fontsource/barlow-condensed/latin-800.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import Sl9Experience from "./Sl9Experience";
import ContactModal from "./ContactModal";
import { media, sl9Url } from "./media";
import "./style.css";
const PHONE = "tel:+33973588211";
const DIRECTIONS =
  "https://www.google.com/maps/dir/?api=1&destination=Normandie+Cycles+2b+Route+d%27Harcourt+14123+Fleury-sur-Orne";
const SITE = "https://www.normandie-cycles.fr";
function Mark() {
  return (
    <svg viewBox="0 0 48 42" aria-hidden="true">
      <path
        d="M3 34 12 7h9l5 15 5-15h14l-3 8h-8l-5 19H19l-5-15-5 15Z"
        fill="currentColor"
      />
      <path d="m2 38 40-3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
const disciplines = [
  {
    n: "01",
    name: "ROUTE",
    sub: "L’obsession de la vitesse.",
    copy: "La précision du Tarmac. La liberté d’une route qui s’ouvre. Trouvons votre prochain vélo de route.",
    image: "sl9-side",
    interest: "Route",
    source: true,
  },
  {
    n: "02",
    name: "GRAVEL",
    sub: "Le droit de sortir du cadre.",
    copy: "Des routes secondaires aux chemins du Calvados. Parlez-nous de vos envies d’aventure.",
    image: "diverge",
    interest: "Gravel",
    source: true,
  },
  {
    n: "03",
    name: "VTT & ÉLECTRIQUE",
    sub: "Un autre terrain de jeu.",
    copy: "Sentiers, trajets quotidiens ou longues sorties : découvrez avec nous la pratique qui vous ressemble.",
    image: "levo",
    interest: "Électrique",
    source: true,
  },
];
function App() {
  const [menu, setMenu] = useState(false),
    [scrolled, setScrolled] = useState(false),
    [contact, setContact] = useState(null),
    [faq, setFaq] = useState(null);
  const menuButton = useRef(null);
  useEffect(() => {
    const ob = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            ob.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((e) => ob.observe(e));
    const scroll = () => {
      setScrolled(window.scrollY > 40);
      document.documentElement.style.setProperty(
        "--page-progress",
        `${(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%`,
      );
    };
    window.addEventListener("scroll", scroll, { passive: true });
    scroll();
    return () => {
      ob.disconnect();
      window.removeEventListener("scroll", scroll);
    };
  }, []);
  useEffect(() => {
    if (!menu) return;
    document.body.style.overflow = "hidden";
    const key = (e) => {
      if (e.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", key);
    };
  }, [menu]);
  const open = (interest = "Conseil") => {
    setMenu(false);
    setContact(interest);
  };
  const nav = [
    ["#velos", "Les vélos"],
    ["#expertise", "Atelier & Retül"],
    ["#magasin", "Le magasin"],
  ];
  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <div className="reading-progress" />
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <a href="#" className="brand" aria-label="Normandie Cycles, accueil">
          <Mark />
          <span>
            NORMANDIE<span>CYCLES</span>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Navigation principale">
          {nav.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="header-phone"
            href={PHONE}
            aria-label="Appeler Normandie Cycles au 09 73 58 82 11"
          >
            <Phone size={15} />
            <span>09 73 58 82 11</span>
          </a>
          <button className="button small red-button" onClick={() => open()}>
            Votre prochain vélo <ArrowUpRight size={16} />
          </button>
          <button
            ref={menuButton}
            className="menu-button icon-button"
            aria-controls="mobile-nav"
            aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        {menu && (
          <nav
            className="mobile-nav"
            id="mobile-nav"
            aria-label="Navigation mobile"
          >
            {nav.map(([href, label], i) => (
              <a href={href} key={href} onClick={() => setMenu(false)}>
                <span>0{i + 1}</span>
                {label}
                <ArrowUpRight />
              </a>
            ))}
            <button className="button red-button" onClick={() => open()}>
              Parlons de votre projet <ArrowUpRight size={20} />
            </button>
            <a className="mobile-phone" href={PHONE}>
              <Phone size={18} />
              09 73 58 82 11
            </a>
          </nav>
        )}
      </header>
      <main id="contenu">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-top">
            <p className="eyebrow">
              <span className="red-dot" /> L’EXPÉRIENCE SPECIALIZED. EN
              NORMANDIE.
            </p>
            <a href="#magasin" className="hero-place">
              <MapPin size={12} />
              FLEURY-SUR-ORNE / CAEN
            </a>
          </div>
          <div className="hero-copy">
            <p className="hero-kicker">
              <span>PASSION LOCALE.</span> PERFORMANCE SANS LIMITE.
            </p>
            <h1 id="hero-title">
              SANS
              <br />
              <span>COMPROMIS.</span>
            </h1>
            <p className="hero-description">
              Le vélo dans sa forme la plus pure.
              <br />
              L’expérience Specialized, à deux pas de Caen.
            </p>
            <div className="hero-ctas">
              <a href="#velos" className="button red-button">
                Trouvez votre prochain vélo <ArrowUpRight size={20} />
              </a>
              <a href="#magasin" className="quiet-link">
                Passer au magasin <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <Sl9Experience />
          <div className="hero-bottom">
            <a href="#performance" className="scroll-link">
              <span>
                <ArrowDown size={16} />
              </span>
              DÉCOUVRIR L’EXIGENCE
            </a>
            <span className="hero-footnote">
              S-WORKS TARMAC SL9 · PHOTOGRAPHIES OFFICIELLES SPECIALIZED
            </span>
            <span className="hero-count">
              01 <span>/ 06</span>
            </span>
          </div>
          <div className="hero-grid" aria-hidden="true" />
        </section>
        <section
          className="performance"
          id="performance"
          aria-label="Caractéristiques du S-Works Tarmac SL9"
        >
          <div className="performance-intro">
            <span className="eyebrow">S-WORKS TARMAC SL9</span>
            <p>
              Chaque gramme compte.
              <br />
              Chaque détail aussi.
            </p>
          </div>
          <div className="stat">
            <span>
              687<small>g</small>
            </span>
            <p>CADRE FACT 12R CARBON</p>
          </div>
          <div className="stat">
            <span>
              6,6<small>kg</small>
            </span>
            <p>VÉLO COMPLET / TAILLE 56</p>
          </div>
          <div className="stat stat-text">
            <span>RED AXS</span>
            <p>TRANSMISSION SRAM</p>
          </div>
          <a
            href={sl9Url}
            target="_blank"
            rel="noopener noreferrer"
            className="performance-link"
            aria-label="Voir la fiche officielle du S-Works Tarmac SL9"
          >
            <ArrowUpRight size={24} />
          </a>
          <p className="spec-note">
            Données fabricant pour le modèle SRAM RED AXS. Poids variables selon
            taille, peinture et composants. Disponibilité en magasin : nous
            consulter.
          </p>
        </section>
        <section className="engineering section-pad">
          <div className="section-top reveal">
            <p className="eyebrow red">01 / L’EXIGENCE DANS CHAQUE DÉTAIL</p>
            <span className="section-index">S-WORKS / TARMAC SL9</span>
          </div>
          <div className="engineering-heading reveal">
            <h2>
              RIEN N’EST
              <br />
              <span className="outline">LAISSÉ AU HASARD.</span>
            </h2>
            <p>
              Léger. Aérodynamique. Précis.
              <br />
              Le Tarmac SL9 porte l’innovation Specialized jusque dans le
              moindre détail.
            </p>
          </div>
          <div className="detail-grid">
            {[
              {
                asset: "sl9-cockpit",
                title: "Tout commence à l’avant.",
                tag: "01 / ROVAL RAPIDE COCKPIT",
                copy: "Un poste de pilotage intégré. Une ligne épurée. La précision au bout des doigts.",
              },
              {
                asset: "sl9-head",
                title: "L’air n’est plus une limite.",
                tag: "02 / SPEED SNIFFER",
                copy: "Une douille de direction affinée et une fourche Flow Fork conçues pour optimiser l’écoulement de l’air.",
              },
              {
                asset: "sl9-frame",
                title: "La légèreté a du caractère.",
                tag: "03 / FACT 12R CARBON",
                copy: "Un cadre annoncé à 687 grammes. L’ambition de transformer chaque effort en vitesse.",
              },
            ].map((d) => (
              <article className="detail-card reveal" key={d.asset}>
                <div className="detail-image">
                  <img
                    src={media(d.asset)}
                    alt={`Détail officiel Specialized du S-Works Tarmac SL9 : ${d.tag.split("/ ")[1]}`}
                    loading="lazy"
                  />
                  <span className="image-corner">+</span>
                  <span className="image-corner other">+</span>
                </div>
                <p className="eyebrow">{d.tag}</p>
                <h3>{d.title}</h3>
                <p>{d.copy}</p>
              </article>
            ))}
          </div>
          <div className="engineering-bottom reveal">
            <p>
              Un vélo d’exception.
              <br />
              <span>Un projet qui mérite d’en parler.</span>
            </p>
            <button className="text-link" onClick={() => open("Route")}>
              Parlons de votre Tarmac <ArrowUpRight size={18} />
            </button>
          </div>
        </section>
        <div className="ticker" aria-hidden="true">
          <div>
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i}>
                MADE IN RACING <span className="ticker-symbol">+</span> ROOTED
                IN NORMANDIE <span className="ticker-symbol">+</span>
              </span>
            ))}
          </div>
        </div>
        <section className="disciplines section-pad" id="velos">
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow red">
                02 / LE BON VÉLO. VOTRE FAÇON DE ROULER.
              </p>
              <h2>
                VOTRE TERRAIN.
                <br />
                <span className="outline">VOS RÈGLES.</span>
              </h2>
            </div>
            <p>
              De la première sortie à votre prochain défi,
              <br />
              il y a un vélo pour vous. Trouvons-le ensemble.
            </p>
          </div>
          <div className="discipline-grid">
            {disciplines.map((d) => (
              <article className="discipline-card reveal" key={d.n}>
                <button
                  className="discipline-image"
                  onClick={() => open(d.interest)}
                  aria-label={`Découvrir mon projet ${d.interest.toLowerCase()}`}
                >
                  <img
                    src={d.source ? media(d.image) : d.image}
                    alt={
                      d.n === "01"
                        ? "S-Works Tarmac SL9, photographie officielle Specialized"
                        : d.n === "02"
                          ? "S-Works Diverge 4, photographie officielle Specialized"
                          : "S-Works Levo 4 X, photographie officielle Specialized"
                    }
                    loading="lazy"
                  />
                  <span className="discipline-number">/{d.n}</span>
                  <span className="discipline-arrow">
                    <ArrowUpRight size={24} />
                  </span>
                  <span className="discipline-title">{d.name}</span>
                </button>
                <h3>{d.sub}</h3>
                <p>{d.copy}</p>
                <button className="text-link" onClick={() => open(d.interest)}>
                  Découvrir cet univers <ArrowUpRight size={16} />
                </button>
              </article>
            ))}
          </div>
        </section>
        <section className="expertise" id="expertise">
          <div className="expertise-main">
            <div className="expertise-photo">
              <img
                src="/images/service.webp"
                alt="Entretien d’un vélo dans l’atelier Normandie Cycles"
                loading="lazy"
              />
              <div className="photo-label">
                <span>NORMANDIE CYCLES</span>
                <span>L’ATELIER / FLEURY-SUR-ORNE</span>
              </div>
            </div>
            <div className="expertise-copy reveal">
              <p className="eyebrow red">
                03 / L’HUMAIN DERRIÈRE LA PERFORMANCE
              </p>
              <h2>
                VOTRE VÉLO.
                <br />
                ENTRE DE
                <br />
                <span className="accent">BONNES MAINS.</span>
              </h2>
              <p>
                Un réglage précis. Une révision. Une réparation. Notre atelier
                accompagne votre vélo pour que votre seule préoccupation reste
                la prochaine sortie.
              </p>
              <button
                className="button dark-button"
                onClick={() => open("Entretien")}
              >
                Parlons de votre vélo <ArrowUpRight size={19} />
              </button>
              <a className="atelier-phone" href={PHONE}>
                <Phone size={15} /> 09 73 58 82 11
              </a>
            </div>
          </div>
          <div className="retul-row">
            <div className="retul-copy reveal">
              <span className="retul-word">
                retül<span>fit.</span>
              </span>
              <div>
                <p className="eyebrow">ÉTUDE POSTURALE RETÜL FIT</p>
                <h3>
                  Le vélo s’adapte à vous.
                  <br />
                  Pas l’inverse.
                </h3>
                <p>
                  Une position étudiée pour votre pratique, votre confort et vos
                  objectifs. Découvrez l’accompagnement postural proposé au
                  magasin.
                </p>
              </div>
              <button
                className="retul-cta"
                onClick={() => open("Conseil")}
                aria-label="Me renseigner sur le Retül Fit"
              >
                <ArrowUpRight size={27} />
              </button>
            </div>
            <div className="retul-image">
              <img
                src="/images/retul.webp"
                alt="Réglage postural Retül Fit présenté par Normandie Cycles"
                loading="lazy"
              />
            </div>
          </div>
        </section>
        <section className="store section-pad" id="magasin">
          <div className="section-top reveal">
            <p className="eyebrow red">
              04 / UNE PASSION. UN LIEU. DES RENCONTRES.
            </p>
            <span className="section-index">49° N / NORMANDIE</span>
          </div>
          <div className="store-grid">
            <div className="store-copy reveal">
              <h2>
                LA PASSION
                <br />
                NE SE COMMANDE
                <br />
                <span className="outline">PAS EN LIGNE.</span>
              </h2>
              <p>
                Elle se partage. Avec un conseil, un réglage, une conversation
                qui change la suite de vos sorties.
              </p>
              <p>
                Fondé par Cyril en 2008, Normandie Cycles s’installe dans la
                région caennaise en 2018 avec Specialized. Une histoire de vélo,
                de proximité et d’envie d’aller plus loin.
              </p>
              <a
                href={DIRECTIONS}
                target="_blank"
                rel="noopener noreferrer"
                className="button red-button"
              >
                On se retrouve au magasin <ArrowUpRight size={20} />
              </a>
              <div className="store-meta">
                <span>
                  DEPUIS <strong>2008</strong>
                </span>
                <span>
                  FLEURY-SUR-ORNE
                  <br />À DEUX PAS DE CAEN
                </span>
              </div>
            </div>
            <div className="store-info">
              <div className="store-image">
                <img
                  src="/images/equipement.webp"
                  alt="L’espace équipements et vêtements Specialized du magasin Normandie Cycles"
                  loading="lazy"
                />
                <span className="store-image-label">
                  VOTRE PROCHAINE SORTIE COMMENCE ICI.
                </span>
              </div>
              <div className="address-grid">
                <div>
                  <p className="eyebrow red">LE MAGASIN</p>
                  <address>
                    2b Route d’Harcourt
                    <br />
                    et 17b Rue d’Ifs
                    <br />
                    14123 Fleury-sur-Orne
                  </address>
                  <a
                    href={DIRECTIONS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link"
                  >
                    Créer mon itinéraire <ArrowUpRight size={15} />
                  </a>
                </div>
                <div>
                  <p className="eyebrow red">LES HORAIRES</p>
                  <dl className="hours">
                    <div>
                      <dt>Mar. — Ven.</dt>
                      <dd>
                        9h30 — 12h
                        <br />
                        14h — 19h
                      </dd>
                    </div>
                    <div>
                      <dt>Samedi</dt>
                      <dd>
                        9h30 — 12h
                        <br />
                        14h — 18h
                      </dd>
                    </div>
                    <div>
                      <dt>Dim. & Lun.</dt>
                      <dd>Fermé</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="invitation">
          <div className="invitation-copy reveal">
            <p className="eyebrow">MOINS DE SCROLL. PLUS DE KILOMÈTRES.</p>
            <h2>
              LA PROCHAINE
              <br />
              <span>ÉCHAPPÉE,</span>
              <br />
              C’EST LA VÔTRE.
            </h2>
            <div className="invitation-links">
              <button className="button light-button" onClick={() => open()}>
                Parlons de votre projet <ArrowUpRight size={22} />
              </button>
              <a href={PHONE} className="invitation-phone">
                <Phone size={18} />
                09 73 58 82 11
              </a>
            </div>
          </div>
          <div className="invitation-arrow" aria-hidden="true">
            <MoveUpRight strokeWidth={0.7} />
          </div>
        </section>
        <section className="faq section-pad">
          <div className="faq-heading reveal">
            <p className="eyebrow red">05 / AVANT DE PRENDRE LA ROUTE</p>
            <h2>
              ON EN
              <br />
              <span className="outline">PARLE ?</span>
            </h2>
          </div>
          <div className="faq-list">
            {[
              {
                q: "Comment choisir mon prochain vélo ?",
                a: "Parlons de votre terrain, de vos envies, de la fréquence de vos sorties et de votre budget. L’équipe vous accompagne du vélo pour le quotidien au projet de compétition.",
              },
              {
                q: "Le S-Works Tarmac SL9 est-il disponible au magasin ?",
                a: "Les photos présentées sont les vues officielles du fabricant. Contactez-nous pour vérifier les modèles, tailles et finitions actuellement disponibles, et préparer votre projet.",
              },
              {
                q: "Puis-je faire entretenir mon vélo chez vous ?",
                a: "Oui, Normandie Cycles dispose d’un atelier de réparation et d’entretien. Appelez le magasin pour décrire votre besoin et convenir de la prise en charge.",
              },
              {
                q: "Qu’est-ce que l’étude posturale Retül Fit ?",
                a: "C’est un accompagnement pour adapter votre position sur le vélo à votre pratique. Le magasin propose le Retül Fit : contactez l’équipe pour connaître le déroulement et les disponibilités.",
              },
              {
                q: "Où se trouve le magasin et quand venir ?",
                a: "À Fleury-sur-Orne, au 2b Route d’Harcourt et 17b Rue d’Ifs, près de Caen. Du mardi au vendredi : 9h30–12h et 14h–19h. Le samedi : 9h30–12h et 14h–18h. Fermé le dimanche et le lundi.",
              },
            ].map((f, i) => (
              <div className="faq-item" key={f.q}>
                <h3>
                  <button
                    aria-expanded={faq === i}
                    aria-controls={`faq-answer-${i}`}
                    onClick={() => setFaq(faq === i ? null : i)}
                  >
                    <span className="faq-number">0{i + 1}</span>
                    {f.q}
                    {faq === i ? <Minus size={19} /> : <Plus size={19} />}
                  </button>
                </h3>
                <div hidden={faq !== i} id={`faq-answer-${i}`}>
                  <p>{f.a}</p>
                  {i === 1 && (
                    <a className="text-link" href={PHONE}>
                      Vérifier la disponibilité <Phone size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="footer-top">
          <a href="#" className="brand">
            <Mark />
            <span>
              NORMANDIE<span>CYCLES</span>
            </span>
          </a>
          <p>
            PASSION LOCALE.
            <br />
            PERFORMANCE SANS LIMITE.
          </p>
          <div className="footer-social">
            <a
              href="https://www.instagram.com/normandie_cycles/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Normandie Cycles"
            >
              <Instagram size={19} />
            </a>
            <a href={PHONE} aria-label="Appeler le magasin">
              <Phone size={19} />
            </a>
            <a
              href={DIRECTIONS}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Itinéraire vers le magasin"
            >
              <MapPin size={19} />
            </a>
          </div>
        </div>
        <a className="footer-display" href="#" aria-label="Retour en haut">
          NORMANDIE
          <span>
            <ArrowUpRight strokeWidth={1} />
          </span>
        </a>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} NORMANDIE CYCLES</span>
          <span>PHOTOGRAPHIES : SPECIALIZED & NORMANDIE CYCLES</span>
          <div>
            <a
              href={`${SITE}/mentions-legales.html`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Mentions légales
            </a>
            <a
              href={`${SITE}/politique-de-confidentialite.html`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Confidentialité
            </a>
          </div>
        </div>
      </footer>
      {contact !== null && (
        <ContactModal interest={contact} onClose={() => setContact(null)} />
      )}
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);

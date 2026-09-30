import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Maximize2, X } from "lucide-react";
import { media } from "./media";
const views = [
  {
    asset: "sl9-side",
    label: "Profil",
    description:
      "S-Works Tarmac SL9 Satin Silver Dust, vue de profil officielle Specialized",
  },
  {
    asset: "sl9-front",
    label: "Trois-quarts avant",
    description:
      "S-Works Tarmac SL9, vue trois-quarts avant officielle Specialized",
  },
  {
    asset: "sl9-rear",
    label: "Trois-quarts arrière",
    description:
      "S-Works Tarmac SL9, vue trois-quarts arrière officielle Specialized",
  },
];
export default function Sl9Experience() {
  const [view, setView] = useState(1),
    [zoom, setZoom] = useState(false),
    [loaded, setLoaded] = useState({});
  const dialog = useRef(null),
    stage = useRef(null);
  const prev = () => setView((v) => (v + 2) % 3),
    next = () => setView((v) => (v + 1) % 3);
  useEffect(() => {
    if (zoom) {
      dialog.current.showModal();
      const focus = document.activeElement;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
        focus?.focus();
      };
    }
  }, [zoom]);
  const move = (e) => {
    if (
      e.pointerType === "touch" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      "--mx",
      `${((e.clientX - r.left - r.width / 2) / r.width) * 14}px`,
    );
    e.currentTarget.style.setProperty(
      "--my",
      `${((e.clientY - r.top - r.height / 2) / r.height) * 10}px`,
    );
  };
  return (
    <>
      <div
        ref={stage}
        className="sl9-stage"
        onPointerMove={move}
        onPointerLeave={(e) => {
          e.currentTarget.style.setProperty("--mx", "0px");
          e.currentTarget.style.setProperty("--my", "0px");
        }}
      >
        <div className="stage-glow" />
        <span className="stage-word" aria-hidden="true">
          SL9
        </span>
        <div className="product-views">
          {views.map((v, i) => (
            <img
              key={v.asset}
              className={view === i ? "product-view active" : "product-view"}
              src={media(v.asset)}
              alt={v.description}
              fetchPriority={i === 1 ? "high" : "auto"}
              onLoad={() => setLoaded((l) => ({ ...l, [i]: true }))}
              onError={() => setLoaded((l) => ({ ...l, [i]: false }))}
              aria-hidden={view !== i}
            />
          ))}
        </div>
        <div className="stage-label">
          <span className="mini-cross">+</span>
          <div>
            S-WORKS TARMAC SL9<span>SATIN SILVER DUST / SRAM RED AXS</span>
          </div>
        </div>
        <span className="stage-edition">SPECIALIZED / 2026</span>
        <button
          className="stage-zoom icon-button"
          onClick={() => setZoom(true)}
          aria-label="Agrandir la photographie du Tarmac SL9"
        >
          <Maximize2 size={18} />
        </button>
        <div className="stage-controls">
          <button
            className="icon-button"
            onClick={prev}
            aria-label="Vue précédente du Tarmac SL9"
          >
            <ArrowLeft size={18} />
          </button>
          <div
            className="view-buttons"
            role="group"
            aria-label="Vues officielles du Tarmac SL9"
          >
            {views.map((v, i) => (
              <button
                key={v.asset}
                className={view === i ? "active" : ""}
                onClick={() => setView(i)}
                aria-pressed={view === i}
              >
                {v.label}
              </button>
            ))}
          </div>
          <button
            className="icon-button"
            onClick={next}
            aria-label="Vue suivante du Tarmac SL9"
          >
            <ArrowRight size={18} />
          </button>
        </div>
        {loaded[view] === false && (
          <p className="media-error" role="status">
            La photographie Specialized n’a pas pu être chargée.
          </p>
        )}
      </div>
      {zoom && (
        <dialog
          ref={dialog}
          className="image-dialog"
          onCancel={() => setZoom(false)}
          onClick={(e) => {
            if (e.target === e.currentTarget) setZoom(false);
          }}
        >
          <button
            className="image-close icon-button"
            aria-label="Fermer la photographie"
            onClick={() => setZoom(false)}
          >
            <X />
          </button>
          <img src={media(views[view].asset)} alt={views[view].description} />
          <div className="zoom-caption">
            <span>S-WORKS TARMAC SL9</span>
            <span>{views[view].label} · Photographie Specialized</span>
          </div>
        </dialog>
      )}
    </>
  );
}

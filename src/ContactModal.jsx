import { useEffect, useRef, useState } from "react";
import { X, Check, ArrowRight, ArrowUpRight, LoaderCircle } from "lucide-react";
export default function ContactModal({ interest, onClose }) {
  const dialog = useRef(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  useEffect(() => {
    const prev = document.activeElement;
    dialog.current.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, []);
  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("unavailable");
      setStatus("sent");
    } catch {
      setStatus("idle");
      setError(
        "L’envoi est momentanément indisponible. Vous pouvez contacter le magasin depuis son site actuel.",
      );
    }
  }
  return (
    <dialog
      ref={dialog}
      className="contact-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        className="dialog-close icon-button"
        aria-label="Fermer le formulaire"
        onClick={onClose}
      >
        <X size={22} />
      </button>
      {status === "sent" ? (
        <div className="success">
          <span className="success-icon">
            <Check />
          </span>
          <p className="eyebrow">MESSAGE ENVOYÉ</p>
          <h2>
            Le début d’une
            <br />
            belle sortie.
          </h2>
          <p>Votre message a été transmis au magasin. À bientôt !</p>
          <button className="button dark" onClick={onClose}>
            Revenir au site <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <>
          <p className="eyebrow red">CHAQUE PROJET COMMENCE PAR UN ÉCHANGE</p>
          <h2>Parlons vélo.</h2>
          <p className="dialog-intro">
            Une envie, une question, un prochain défi ?<br />
            Dites-nous ce qui vous fait pédaler.
          </p>
          <form onSubmit={submit}>
            <div className="form-row">
              <label>
                Votre prénom
                <input
                  name="name"
                  autoComplete="given-name"
                  required
                  minLength={2}
                  maxLength={80}
                  placeholder="Camille"
                />
              </label>
              <label>
                Votre e-mail
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  placeholder="camille@exemple.fr"
                />
              </label>
            </div>
            <label>
              Votre projet
              <select name="interest" defaultValue={interest || "Conseil"}>
                {["Conseil", "Route", "Gravel", "Électrique", "Entretien"].map(
                  (x) => (
                    <option key={x}>{x}</option>
                  ),
                )}
              </select>
            </label>
            <label>
              Un peu plus sur votre envie
              <textarea
                name="message"
                required
                minLength={10}
                maxLength={3000}
                rows={3}
                placeholder="Vos sorties, vos envies, le vélo que vous imaginez…"
              />
            </label>
            <div className="honeypot" aria-hidden="true">
              <label>
                Ne pas remplir
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <label className="consent">
              <input type="checkbox" name="consent" value="yes" required />
              <span>
                J’accepte que mes coordonnées soient utilisées pour répondre à
                cette demande.
              </span>
            </label>
            {error && (
              <p role="alert" className="form-error">
                {error}{" "}
                <a
                  href="tel:+33973588211"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Appeler le magasin <ArrowUpRight size={14} />
                </a>
              </p>
            )}
            <button
              disabled={status === "sending"}
              className="button red-button submit"
            >
              {status === "sending" ? (
                <>
                  Envoi en cours <LoaderCircle className="spin" size={18} />
                </>
              ) : (
                <>
                  Envoyer mon message <ArrowUpRight size={18} />
                </>
              )}
            </button>
            <p className="form-note">
              Vos informations servent uniquement à cet échange.
            </p>
          </form>
        </>
      )}
    </dialog>
  );
}

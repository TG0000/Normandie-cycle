'use client'

import { useEffect, useState } from 'react'
import Split from '@/components/Split'
import { SITE } from '@/lib/site'

const TYPES = [
  { id: 'essai', label: 'Essai d’un vélo' },
  { id: 'atelier', label: 'Atelier / réparation' },
  { id: 'retul', label: 'Étude posturale Retül' },
  { id: 'conseil', label: 'Conseil achat' },
  { id: 'location', label: 'Location' },
]

type State = 'idle' | 'sending' | 'ok' | 'offline' | 'error'

export default function Booking() {
  const [type, setType] = useState('essai')
  const [state, setState] = useState<State>('idle')
  const [err, setErr] = useState('')
  const [minDate, setMinDate] = useState<string>()

  useEffect(() => {
    setMinDate(new Date().toISOString().slice(0, 10))
    const on = (e: Event) => {
      const t = (e as CustomEvent<string>).detail
      if (TYPES.some((x) => x.id === t)) setType(t)
      setState('idle')
    }
    window.addEventListener('nc:book', on)
    return () => window.removeEventListener('nc:book', on)
  }, [])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const data = Object.fromEntries(fd.entries()) as Record<string, string>
    data.type = type
    if (!data.name?.trim() || !data.phone?.trim()) {
      setErr('Merci d’indiquer votre nom et votre téléphone.')
      return
    }
    setErr('')
    setState('sending')
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) {
        setErr(j.error || 'Une erreur est survenue.')
        setState('error')
        return
      }
      setState(j.delivered ? 'ok' : 'offline')
    } catch {
      setState('error')
      setErr('Connexion impossible.')
    }
  }

  const label = TYPES.find((t) => t.id === type)?.label

  return (
    <section id="reserver" className="booking">
      <div className="booking-copy">
        <p className="eyebrow"><span className="dot-red" /> Réservation</p>
        <Split as="h2" className="d h-xl" lines={['Prenez', '*rendez-vous.*']} />
        <p className="booking-lede" data-reveal>
          Essai, atelier, Retül ou simple conseil : laissez-nous vos coordonnées, on vous rappelle pour fixer le créneau. Vous préférez parler tout de suite ?
        </p>
        <a href={SITE.phoneHref} className="booking-phone d" data-reveal>{SITE.phone}</a>
      </div>

      <div className="booking-card" data-reveal>
        {state === 'ok' || state === 'offline' ? (
          <div className="booking-done" role="status">
            <span className="done-check" aria-hidden>
              <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" /><path d="M15 27 l7 7 l15 -16" /></svg>
            </span>
            {state === 'ok' ? (
              <>
                <h3 className="d">Demande envoyée.</h3>
                <p>Merci ! Nous vous rappelons très vite pour confirmer votre rendez-vous « {label} ».</p>
              </>
            ) : (
              <>
                <h3 className="d">Presque fini.</h3>
                <p>La réservation en ligne n’est pas encore active. Pour confirmer votre rendez-vous « {label} », appelez-nous directement :</p>
                <a href={SITE.phoneHref} className="btn btn-red">{SITE.phone}</a>
              </>
            )}
            <button className="link-arrow" onClick={() => setState('idle')}>Nouvelle demande <span>→</span></button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <fieldset className="chips">
              <legend>Motif</legend>
              {TYPES.map((t) => (
                <label key={t.id} className={`chip ${type === t.id ? 'is-on' : ''}`}>
                  <input type="radio" name="type_ui" value={t.id} checked={type === t.id} onChange={() => setType(t.id)} />
                  {t.label}
                </label>
              ))}
            </fieldset>
            <div className="grid2">
              <label className="field">
                <span>Nom *</span>
                <input name="name" autoComplete="name" required placeholder="Camille Martin" />
              </label>
              <label className="field">
                <span>Téléphone *</span>
                <input name="phone" type="tel" autoComplete="tel" required placeholder="06 12 34 56 78" />
              </label>
              <label className="field">
                <span>E-mail</span>
                <input name="email" type="email" autoComplete="email" placeholder="vous@exemple.fr" />
              </label>
              <label className="field">
                <span>Date souhaitée</span>
                <input name="date" type="date" min={minDate} />
              </label>
            </div>
            <label className="field">
              <span>{type === 'atelier' ? 'Votre vélo et l’intervention souhaitée' : type === 'essai' ? 'Le vélo que vous aimeriez essayer' : 'Votre message'}</span>
              <textarea name="message" rows={3} placeholder={type === 'essai' ? 'Ex. S-Works Tarmac SL9, taille 56' : type === 'atelier' ? 'Ex. révision complète VAE Turbo Vado' : 'Dites-nous en plus…'} />
            </label>
            <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden />
            <label className="consent">
              <input type="checkbox" name="consent" required />
              <span>J’accepte d’être recontacté(e) par Normandie Cycles au sujet de ma demande.</span>
            </label>
            {err && <p className="form-err" role="alert">{err}</p>}
            <button className="btn btn-red btn-wide magnetic" disabled={state === 'sending'}>
              {state === 'sending' ? 'Envoi…' : 'Envoyer ma demande'} <span className="btn-arrow">→</span>
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

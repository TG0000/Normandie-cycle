import { NextResponse } from 'next/server'

const TYPES: Record<string, string> = {
  essai: 'Essai d’un vélo',
  atelier: 'Atelier / réparation',
  retul: 'Étude posturale Retül',
  conseil: 'Conseil achat',
  location: 'Location',
}

const clean = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

/**
 * Réception des demandes de rendez-vous.
 * Envoi par e-mail via Resend si RESEND_API_KEY + CONTACT_TO sont définis,
 * et/ou vers un webhook (Zapier, Make, Slack…) si CONTACT_WEBHOOK_URL est défini.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }
  if (clean(body.website)) return NextResponse.json({ ok: true, delivered: true }) // pot de miel

  const data = {
    type: TYPES[clean(body.type, 20)] ?? 'Demande',
    name: clean(body.name, 120),
    phone: clean(body.phone, 40),
    email: clean(body.email, 160),
    date: clean(body.date, 20),
    message: clean(body.message, 2000),
  }
  if (!data.name || !/^[+\d][\d\s.()-]{7,}$/.test(data.phone)) {
    return NextResponse.json({ error: 'Nom et numéro de téléphone valides requis.' }, { status: 422 })
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return NextResponse.json({ error: 'Adresse e-mail invalide.' }, { status: 422 })
  }

  const text = [
    `Nouvelle demande : ${data.type}`,
    `Nom : ${data.name}`,
    `Téléphone : ${data.phone}`,
    data.email && `E-mail : ${data.email}`,
    data.date && `Date souhaitée : ${data.date}`,
    data.message && `\n${data.message}`,
  ]
    .filter(Boolean)
    .join('\n')

  let delivered = false
  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM, CONTACT_WEBHOOK_URL } = process.env

  if (RESEND_API_KEY && CONTACT_TO) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: CONTACT_FROM || 'Normandie Cycles <onboarding@resend.dev>',
        to: CONTACT_TO.split(','),
        reply_to: data.email || undefined,
        subject: `[Site] ${data.type} — ${data.name}`,
        text,
      }),
    }).catch(() => null)
    delivered = !!r?.ok
  }
  if (CONTACT_WEBHOOK_URL) {
    const r = await fetch(CONTACT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, text }),
    }).catch(() => null)
    delivered = delivered || !!r?.ok
  }
  if (!delivered) console.info('[contact] demande reçue (aucun canal configuré)\n' + text)

  return NextResponse.json({ ok: true, delivered })
}

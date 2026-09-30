export const SITE = {
  name: 'Normandie Cycles',
  tagline: 'Specialized Store · Caen · Fleury-sur-Orne',
  url: 'https://www.normandie-cycles.fr',
  phone: '09 73 58 82 11',
  phoneHref: 'tel:+33973588211',
  street: "2 bis route d'Harcourt",
  street2: "17 bis rue d'Ifs",
  zip: '14123',
  city: 'Fleury-sur-Orne',
  mapsDirections:
    'https://www.google.com/maps/dir/?api=1&destination=Normandie+Cycles%2C+2+bis+route+d%27Harcourt%2C+14123+Fleury-sur-Orne',
  mapsEmbed:
    'https://www.google.com/maps?q=Normandie+Cycles,+2+bis+route+d%27Harcourt,+14123+Fleury-sur-Orne&z=15&output=embed',
  reviewsUrl: 'https://www.google.com/search?q=Normandie+Cycles+Fleury-sur-Orne+avis',
  rating: '4,9',
  reviewsCount: '100+',
  since: 2018,
}

/** Horaires — 0 = dimanche … 6 = samedi. Créneaux en minutes depuis minuit. */
export const HOURS: { day: number; label: string; slots: [number, number][] }[] = [
  { day: 1, label: 'Lundi', slots: [] },
  { day: 2, label: 'Mardi', slots: [[570, 720], [840, 1140]] },
  { day: 3, label: 'Mercredi', slots: [[570, 720], [840, 1140]] },
  { day: 4, label: 'Jeudi', slots: [[570, 720], [840, 1140]] },
  { day: 5, label: 'Vendredi', slots: [[570, 720], [840, 1140]] },
  { day: 6, label: 'Samedi', slots: [[570, 720], [840, 1080]] },
  { day: 0, label: 'Dimanche', slots: [] },
]

export const fmtMin = (m: number) => {
  const h = Math.floor(m / 60)
  const mm = m % 60
  return `${h}h${mm ? String(mm).padStart(2, '0') : ''}`
}

const DAY_NAMES = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']

export type OpenStatus = { open: boolean; label: string; detail: string; today: number }

/** Statut d'ouverture en temps réel, calculé à l'heure de Paris. */
export function getOpenStatus(date = new Date()): OpenStatus {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Paris',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const wd = parts.find((p) => p.type === 'weekday')?.value ?? 'Mon'
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(wd)
  const now = Number(parts.find((p) => p.type === 'hour')?.value) * 60 + Number(parts.find((p) => p.type === 'minute')?.value)
  const slotsOf = (d: number) => HOURS.find((h) => h.day === d)?.slots ?? []

  for (const [a, b] of slotsOf(day)) {
    if (now >= a && now < b) {
      const left = b - now
      return {
        open: true,
        today: day,
        label: 'Ouvert maintenant',
        detail: left <= 45 ? `Ferme bientôt · ${fmtMin(b)}` : `Jusqu'à ${fmtMin(b)}`,
      }
    }
  }
  // prochaine ouverture
  for (let i = 0; i < 8; i++) {
    const d = (day + i) % 7
    const next = slotsOf(d).find(([a]) => i > 0 || a > now)
    if (next) {
      const when = i === 0 ? "aujourd'hui" : i === 1 ? 'demain' : DAY_NAMES[d]
      return { open: false, today: day, label: 'Fermé', detail: `Ouvre ${when} à ${fmtMin(next[0])}` }
    }
  }
  return { open: false, today: day, label: 'Fermé', detail: '' }
}

/**
 * Chorégraphie « caméra » sur la photo (coordonnées image, 1999 × 1125).
 * zoom = multiplicateur de l'échelle de base (vélo entier à l'écran).
 * shift = décalage du point visé à l'écran (fraction largeur / hauteur).
 */
export type View = {
  from: number
  to: number
  c: [number, number]
  zoom: number
  shift: [number, number]
  shiftMobile: [number, number]
  zoomMobile?: number
  spin: number
}

export const VIEWS: View[] = [
  // 0 — Hero
  { from: 0, to: 0.035, c: [1000, 600], zoom: 0.84, shift: [0.19, 0.04], shiftMobile: [0, 0.2], zoomMobile: 1, spin: 0 },
  // 1 — Cadre
  { from: 0.15, to: 0.21, c: [1010, 540], zoom: 1.2, shift: [0.24, 0.02], shiftMobile: [0, 0.2], zoomMobile: 1.5, spin: 0 },
  // 2 — Flow Fork
  { from: 0.29, to: 0.35, c: [1400, 520], zoom: 1.85, shift: [0.25, 0.02], shiftMobile: [0, 0.18], zoomMobile: 2.2, spin: 0 },
  // 3 — Roues
  { from: 0.43, to: 0.49, c: [540, 720], zoom: 1.6, shift: [0.24, 0.02], shiftMobile: [0, 0.2], zoomMobile: 1.9, spin: 1 },
  // 4 — Cockpit
  { from: 0.56, to: 0.62, c: [1420, 260], zoom: 2.2, shift: [0.24, 0.06], shiftMobile: [0, 0.22], zoomMobile: 2.6, spin: 0 },
  // 5 — Transmission
  { from: 0.69, to: 0.77, c: [760, 770], zoom: 1.9, shift: [0.28, 0.02], shiftMobile: [0, 0.2], zoomMobile: 2.2, spin: 0.35 },
  // 6 — Configurateur
  { from: 0.87, to: 1, c: [1000, 600], zoom: 0.78, shift: [0, 0.05], shiftMobile: [0, 0.02], zoomMobile: 1, spin: 0 },
]

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export function sampleViews(p: number) {
  if (p <= VIEWS[0].to) return { a: VIEWS[0], b: VIEWS[0], k: 0 }
  for (let i = 0; i < VIEWS.length; i++) {
    const V = VIEWS[i]
    if (p >= V.from && p <= V.to) return { a: V, b: V, k: 0 }
    const N = VIEWS[i + 1]
    if (N && p > V.to && p < N.from) return { a: V, b: N, k: ease((p - V.to) / (N.from - V.to)) }
  }
  const L = VIEWS[VIEWS.length - 1]
  return { a: L, b: L, k: 0 }
}

export const CHAPTERS: { in: number; out: number }[] = [
  { in: 0, out: 0.07 },
  { in: 0.12, out: 0.24 },
  { in: 0.26, out: 0.38 },
  { in: 0.4, out: 0.52 },
  { in: 0.53, out: 0.65 },
  { in: 0.66, out: 0.8 },
  { in: 0.84, out: 1.01 },
]

export function chapterAt(p: number) {
  let c = 0
  CHAPTERS.forEach((ch, i) => {
    if (p >= ch.in - 0.02) c = i
  })
  return c
}

/** Points d'intérêt (coordonnées image) */
export const HOTSPOTS: { p: [number, number]; ch: number; t: string; s: string }[] = [
  { p: [1010, 296], ch: 1, t: 'FACT 12r', s: 'Cadre 687 g' },
  { p: [705, 560], ch: 1, t: 'Haubans abaissés', s: 'Confort & aéro' },
  { p: [1420, 570], ch: 2, t: 'Flow Fork', s: 'Couronne intégrée' },
  { p: [1340, 330], ch: 2, t: 'Douille aéro', s: 'Section tronquée' },
  { p: [262, 560], ch: 3, t: 'Rapide CLX III', s: 'Rayons carbone' },
  { p: [525, 404], ch: 3, t: 'Cotton', s: 'Pneus S-Works 30 mm' },
  { p: [1300, 212], ch: 4, t: 'Cockpit Rapide', s: 'Monobloc carbone' },
  { p: [1528, 250], ch: 4, t: 'SRAM RED AXS', s: 'Leviers sans fil' },
  { p: [952, 798], ch: 5, t: 'Pédalier RED', s: '2 × 12 vitesses' },
  { p: [505, 790], ch: 5, t: 'Dérailleur AXS', s: 'Sans fil' },
  { p: [604, 690], ch: 5, t: 'Freins à disque', s: 'SRAM RED' },
]

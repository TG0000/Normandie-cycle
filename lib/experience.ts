'use client'

import { useSyncExternalStore } from 'react'

export type Colorway = 'rouge' | 'carbone' | 'bleu' | 'vert' | 'or'

/** hue = rotation de teinte (tours), sat / val = multiplicateurs, appliqués à la peinture de la photo */
export const COLORWAYS: { id: Colorway; name: string; sub: string; swatch: string; k: [number, number, number] }[] = [
  { id: 'rouge', name: 'Red Tint', sub: 'Finition d’origine · photo réelle', swatch: 'radial-gradient(circle at 30% 30%,#ff4a4a,#9b0c16 55%,#3a0206)', k: [0, 1, 1] },
  { id: 'carbone', name: 'Carbone brut', sub: 'Aperçu couleur simulé', swatch: 'radial-gradient(circle at 30% 30%,#6a6a70,#232327 60%,#0b0b0c)', k: [0, 0.03, 0.58] },
  { id: 'bleu', name: 'Bleu Cobalt', sub: 'Aperçu couleur simulé', swatch: 'radial-gradient(circle at 30% 30%,#5b8cff,#1432a8 60%,#050d3a)', k: [-0.4, 1, 1.05] },
  { id: 'vert', name: 'Vert Bocage', sub: 'Aperçu couleur simulé', swatch: 'radial-gradient(circle at 30% 30%,#57d98a,#0c6b3a 60%,#022614)', k: [0.4, 0.85, 0.95] },
  { id: 'or', name: 'Or Champion', sub: 'Aperçu couleur simulé', swatch: 'radial-gradient(circle at 30% 30%,#ffe08a,#b8860b 60%,#4a3004)', k: [0.115, 0.9, 1.2] },
]

/**
 * État partagé entre le DOM (GSAP / scroll) et la scène WebGL.
 * Mutable à dessein : lu à 60 fps dans la boucle de rendu sans re-render React.
 */
export const xp = {
  progress: 0,
  chapter: 0,
  colorway: 'rouge' as Colorway,
  velocity: 0,
  pointer: { x: 0, y: 0 },
  ready: false,
}

type Listener = () => void
const listeners = new Set<Listener>()
let snapshot = { chapter: 0, colorway: 'rouge' as Colorway, ready: false }

export function setXp(patch: Partial<typeof snapshot>) {
  let changed = false
  for (const k of Object.keys(patch) as (keyof typeof snapshot)[]) {
    if (snapshot[k] !== patch[k]) changed = true
  }
  if (!changed) return
  Object.assign(xp, patch)
  snapshot = { ...snapshot, ...patch }
  listeners.forEach((l) => l())
}

export function useXp() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => snapshot,
    () => snapshot,
  )
}

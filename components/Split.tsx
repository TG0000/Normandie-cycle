import { createElement, type ReactNode } from 'react'

type Props = {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  className?: string
  /** Lignes : chaque entrée est une ligne ; `*mot*` = accent italique rouge */
  lines: string[]
  id?: string
}

/** Titre découpé en mots pour une révélation « masquée » au scroll. */
export default function Split({ as = 'h2', className, lines, id }: Props) {
  const children: ReactNode[] = []
  let inAccent = false
  lines.forEach((line, li) => {
    const words = line.split(' ')
    words.forEach((word, wi) => {
      let clean = word
      if (clean.startsWith('*')) {
        inAccent = true
        clean = clean.slice(1)
      }
      const accent = inAccent
      if (clean.endsWith('*')) {
        inAccent = false
        clean = clean.slice(0, -1)
      }
      children.push(
        <span className="w" key={`${li}-${wi}`}>
          <span className={accent ? 'accent' : undefined}>{clean}</span>
        </span>,
      )
      if (wi < words.length - 1) children.push(' ')
    })
    if (li < lines.length - 1) children.push(<br key={`br-${li}`} />)
  })
  return createElement(as, { className, 'data-split': '', id }, children)
}

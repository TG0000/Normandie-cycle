'use client'

import { useEffect, useState } from 'react'
import Logo from './Logo'
import { SITE } from '@/lib/site'

const LINKS = [
  { href: '#sl9', label: 'Tarmac SL9' },
  { href: '#univers', label: 'Vélos' },
  { href: '#atelier', label: 'Atelier' },
  { href: '#retul', label: 'Retül Fit' },
  { href: '#offres', label: 'Essai & occasion' },
  { href: '#magasin', label: 'Le magasin' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const on = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setHidden(y > last && y > 400)
      last = y
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    if (open) window.__lenis?.stop()
    else window.__lenis?.start()
  }, [open])

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${hidden && !open ? 'is-hidden' : ''}`}>
        <a href="#top" className="nav-logo" aria-label="Normandie Cycles — accueil" onClick={() => setOpen(false)}>
          <Logo />
        </a>
        <nav className="nav-links" aria-label="Navigation principale">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">
              <span>{l.label}</span>
            </a>
          ))}
        </nav>
        <div className="nav-right">
          <span className="nav-badge">Specialized Store</span>
          <a href={SITE.phoneHref} className="nav-phone" aria-label={`Appeler le ${SITE.phone}`}>
            <svg viewBox="0 0 24 24" aria-hidden><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill="currentColor"/></svg>
            <span>{SITE.phone}</span>
          </a>
          <a href="#reserver" className="btn btn-red btn-sm magnetic">Réserver</a>
          <button className={`burger ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            <span /><span />
          </button>
        </div>
      </header>
      <div className={`menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav>
          {LINKS.map((l, i) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ ['--i' as string]: i }} className="d">
              <i>{String(i + 1).padStart(2, '0')}</i>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="menu-foot">
          <a href={SITE.phoneHref}>{SITE.phone}</a>
          <span>{SITE.street}, {SITE.zip} {SITE.city}</span>
        </div>
      </div>
    </>
  )
}

const WORDS = ['Route', 'Gravel', 'VTT', 'Électrique Turbo', 'Atelier toutes marques', 'Retül Fit', 'Occasion', 'Location']

export default function Marquee() {
  const row = (
    <div className="marquee-row">
      {WORDS.map((w) => (
        <span key={w} className="d">
          {w}
          <svg viewBox="0 0 48 32" aria-hidden><path d="M33 30 L41 2 H47 L39 30 Z" fill="currentColor" /></svg>
        </span>
      ))}
    </div>
  )
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-inner">
        {row}
        {row}
      </div>
    </div>
  )
}

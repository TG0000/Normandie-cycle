/** Illustrations « trait » de vélos, dessinées au scroll (stroke-dashoffset). */
export type Kind = 'road' | 'gravel' | 'mtb' | 'ebike' | 'city' | 'kids'

function Wheel({ cx, cy, r, fat = false }: { cx: number; cy: number; r: number; fat?: boolean }) {
  return (
    <g className="bl-wheel" style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <circle cx={cx} cy={cy} r={r} pathLength={1} />
      {fat && <circle cx={cx} cy={cy} r={r - 7} pathLength={1} className="bl-thin" />}
      <circle cx={cx} cy={cy} r={r - (fat ? 14 : 9)} pathLength={1} className="bl-thin" />
      {[0, 60, 120].map((a) => {
        const rad = (a * Math.PI) / 180
        const rr = r - (fat ? 14 : 9)
        return <line key={a} x1={cx - Math.cos(rad) * rr} y1={cy - Math.sin(rad) * rr} x2={cx + Math.cos(rad) * rr} y2={cy + Math.sin(rad) * rr} pathLength={1} className="bl-thin" />
      })}
      <circle cx={cx} cy={cy} r={4} className="bl-hub" />
    </g>
  )
}

export default function BikeLine({ kind }: { kind: Kind }) {
  const kids = kind === 'kids'
  const s = kids ? 0.78 : 1
  const R = { x: 100, y: 172 }
  const F = { x: kids ? 262 : 302, y: 172 }
  const r = kids ? 50 : kind === 'mtb' ? 66 : 62
  const BB = { x: kids ? 172 : 188, y: 180 }
  const fat = kind === 'mtb' || kind === 'gravel' || kind === 'ebike'

  let frame = ''
  let extra: React.ReactNode = null
  switch (kind) {
    case 'road':
    case 'gravel':
      frame = `M${R.x} ${R.y} L${BB.x} ${BB.y} L163 84 L${R.x} ${R.y} M163 84 L272 80 L280 110 L${BB.x} ${BB.y} M280 110 Q290 140 ${F.x} ${F.y} M160 84 L155 70 M138 68 L176 68 M272 80 L276 70 L292 70 M292 70 q${kind === 'gravel' ? '20 2 22 16 q0 14 -16 16' : '16 0 17 14 q0 13 -13 14'}`
      break
    case 'mtb':
      frame = `M${R.x} ${R.y} L150 150 L${BB.x} ${BB.y} L170 96 M150 150 L175 118 M172 100 L276 88 L284 118 L${BB.x} ${BB.y} M284 118 L292 142 M288 132 L${F.x} ${F.y} M170 96 L164 64 M146 62 L184 62 M276 88 L280 70 M262 68 L306 72`
      extra = <rect x="190" y="128" width="30" height="10" rx="4" transform="rotate(-35 205 133)" className="bl-accent" />
      break
    case 'ebike':
      frame = `M${R.x} ${R.y} L${BB.x} ${BB.y} L166 90 L${R.x} ${R.y} M166 90 L272 86 L280 114 L${BB.x} ${BB.y} M280 114 Q292 142 ${F.x} ${F.y} M164 90 L158 70 M140 68 L178 68 M272 86 L270 66 L296 64`
      extra = (
        <>
          <rect x="206" y="118" width="70" height="18" rx="8" transform="rotate(-50 241 127)" className="bl-accent" />
          <circle cx={BB.x} cy={BB.y} r="18" className="bl-accent-stroke" pathLength={1} />
        </>
      )
      break
    case 'city':
      frame = `M${R.x} ${R.y} L${BB.x} ${BB.y} L170 96 L${R.x} ${R.y} M${BB.x} ${BB.y} Q220 130 276 98 L282 118 M282 118 Q292 146 ${F.x} ${F.y} M168 96 L162 72 M144 70 L182 70 M276 98 L268 72 L250 70 M${R.x - 60} ${R.y - 10} A62 62 0 0 1 ${R.x + 40} ${R.y - 50} M${F.x - 40} ${F.y - 50} A62 62 0 0 1 ${F.x + 60} ${F.y - 10} M80 110 L140 110`
      break
    case 'kids':
      frame = `M${R.x} ${R.y} L${BB.x} ${BB.y} L150 110 L${R.x} ${R.y} M150 110 L232 104 L238 126 L${BB.x} ${BB.y} M238 126 L${F.x} ${F.y} M148 110 L144 92 M128 90 L160 90 M232 104 L236 88 L220 84 M236 88 L252 88`
      break
  }
  return (
    <svg className={`bikeline bikeline-${kind}`} viewBox="0 0 400 250" aria-hidden style={{ ['--s' as string]: s }}>
      <Wheel cx={R.x} cy={R.y} r={r} fat={fat} />
      <Wheel cx={F.x} cy={F.y} r={r} fat={fat} />
      <path d={frame} pathLength={1} className="bl-frame" />
      {extra}
      <g className="bl-crank" style={{ transformOrigin: `${BB.x}px ${BB.y}px` }}>
        <circle cx={BB.x} cy={BB.y} r={kids ? 11 : 15} pathLength={1} />
        <line x1={BB.x} y1={BB.y} x2={BB.x + 18} y2={BB.y + 24} pathLength={1} />
      </g>
    </svg>
  )
}

export function Mark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" aria-hidden>
      <path d="M6 30 L14 2 H21 L27 18 L31.5 2 H38.5 L30.5 30 H23.5 L17.5 14 L13 30 Z" fill="currentColor" />
      <path d="M33 30 L41 2 H47 L39 30 Z" fill="#e10a1d" />
    </svg>
  )
}

export default function Logo({ className }: { className?: string }) {
  return (
    <span className={`logo ${className ?? ''}`}>
      <Mark className="logo-mark" />
      <span className="logo-text">
        <b>Normandie</b>
        <span>Cycles</span>
      </span>
    </span>
  )
}

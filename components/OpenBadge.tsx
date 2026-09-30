'use client'

import { useEffect, useState } from 'react'
import { getOpenStatus, type OpenStatus } from '@/lib/site'

export default function OpenBadge({ compact = false }: { compact?: boolean }) {
  const [s, setS] = useState<OpenStatus | null>(null)
  useEffect(() => {
    const up = () => setS(getOpenStatus())
    up()
    const id = setInterval(up, 30000)
    return () => clearInterval(id)
  }, [])
  if (!s) return <span className={`open-badge ${compact ? 'is-compact' : ''}`} aria-hidden />
  return (
    <span className={`open-badge ${s.open ? 'is-open' : 'is-closed'} ${compact ? 'is-compact' : ''}`}>
      <span className="pulse" aria-hidden />
      <b>{s.label}</b>
      {s.detail && <span className="open-detail">· {s.detail}</span>}
    </span>
  )
}

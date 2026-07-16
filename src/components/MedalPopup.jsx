import { useEffect } from 'react'
import { MEDALS } from '../constants'

/** Celebratory toast shown when a medal is unlocked. */
export default function MedalPopup({ medalId, onDismiss, duration = 3300 }) {
  useEffect(() => {
    if (!medalId) return undefined
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [medalId, onDismiss, duration])

  if (!medalId) return null
  const medal = MEDALS.find((m) => m.id === medalId)
  if (!medal) return null

  return (
    <div className="medal-pop" role="status" aria-live="polite">
      <div className="medal-pop__icon">{medal.icon}</div>
      <div style={{ color: '#B45309', fontSize: 12, fontWeight: 900, letterSpacing: '0.1em', marginTop: 8 }}>
        🎉 ميدالية جديدة
      </div>
      <div style={{ fontSize: 19, fontWeight: 900, marginTop: 4 }}>{medal.name}</div>
      <div style={{ color: 'var(--ink-sub)', fontSize: 13, marginTop: 4, fontWeight: 600 }}>
        {medal.desc}
      </div>
    </div>
  )
}

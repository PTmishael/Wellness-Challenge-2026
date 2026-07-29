import { avatarColor } from '../lib/utils'

/** A clean initial-based avatar on a soft coloured disc (no emoji). */
export default function Avatar({ name = '', colorIndex = 0, size = 44, style = {} }) {
  const { bg, accent } = avatarColor(colorIndex)
  const initial = (name.trim()[0] || '؟').toUpperCase()

  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        background: bg,
        border: `2px solid ${accent}`,
        color: accent,
        fontSize: Math.round(size * 0.42),
        fontWeight: 800,
        ...style,
      }}
    >
      {initial}
    </div>
  )
}

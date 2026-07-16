import { avatarColor, avatarSkin } from '../lib/utils'

/** Emoji avatar on a soft coloured disc. */
export default function Avatar({ skinIndex = 0, colorIndex = 0, size = 44, style = {} }) {
  const { bg, accent } = avatarColor(colorIndex)

  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        background: bg,
        border: `2.5px solid ${accent}`,
        fontSize: Math.round(size * 0.44),
        ...style,
      }}
    >
      {avatarSkin(skinIndex)}
    </div>
  )
}

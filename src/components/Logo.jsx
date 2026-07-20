/**
 * Coach Mishael's "M" mark.
 * variant="original" → the green logo as-is (for light backgrounds)
 * variant="white"    → the white cut-out (for the dark hero)
 */
export default function Logo({ size = 64, variant = 'original', style = {} }) {
  const file = variant === 'white' ? 'logo-white.png' : 'logo.png'

  return (
    <img
      src={`${import.meta.env.BASE_URL}${file}`}
      alt="Coach Mishael"
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'block',
        ...style,
      }}
    />
  )
}

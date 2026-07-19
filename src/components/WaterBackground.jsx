/**
 * Water-surface background using the real pool photo.
 *
 * animated=true  → welcome/splash: photo breathes slowly + soft wave
 *                  layers drift across the bottom (subtle motion).
 * animated=false → main app: same photo, fully still, with a stronger
 *                  white veil so cards and text stay easy to read.
 */
export default function WaterBackground({ animated = true }) {
  const photo = `${import.meta.env.BASE_URL}water.jpg`

  return (
    <div className="water-bg" aria-hidden="true">
      <div
        className={`water-bg__photo${animated ? ' water-bg__photo--breathe' : ''}`}
        style={{ backgroundImage: `url(${photo})` }}
      />
      <div className={`water-bg__veil${animated ? '' : ' water-bg__veil--strong'}`} />

      {animated && (
        <>
          <svg className="wave wave--slow" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              d="M0,192 C120,160 240,224 360,208 C480,192 600,128 720,144 C840,160 960,240 1080,240 C1200,240 1320,176 1440,160 L1440,320 L0,320 Z"
              fill="#FFFFFF" opacity="0.35"
            />
          </svg>
          <svg className="wave wave--mid" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              d="M0,224 C160,192 280,256 420,240 C560,224 660,160 800,176 C940,192 1060,256 1200,248 C1320,242 1400,208 1440,200 L1440,320 L0,320 Z"
              fill="#FFFFFF" opacity="0.45"
            />
          </svg>
          <svg className="wave wave--fast" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              d="M0,256 C180,232 320,280 480,268 C640,256 760,208 920,220 C1080,232 1200,280 1440,256 L1440,320 L0,320 Z"
              fill="#FFFFFF" opacity="0.55"
            />
          </svg>

          <svg className="shimmer" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
            <path d="M40 120 q60 -18 130 -6 q80 14 150 -8" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
            <path d="M-20 260 q90 -22 180 -4 q90 18 260 -14" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
            <path d="M60 420 q70 -16 150 -2 q80 14 160 -10" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
            <path d="M80 690 q80 -18 170 -4 q70 10 150 -8" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.55" />
          </svg>
        </>
      )}
    </div>
  )
}

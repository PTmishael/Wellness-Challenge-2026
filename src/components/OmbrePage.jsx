/**
 * A full-bleed page on one continuous ombre gradient — no seams,
 * just a thin bright wave line riding on top of the color, plus
 * two faint ripple lines for texture.
 *
 * @param {string} ombre - CSS gradient string
 * @param {{d: string, top: number}} wave - path + vertical position (%)
 */
export default function OmbrePage({ ombre, wave, children, className = '' }) {
  return (
    <div className={`ombre-page ${className}`} style={{ '--ombre': ombre }}>
      <svg
        className="ombre-page__ripple"
        viewBox="0 0 300 340"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M-10 40 q80 -20 160 -3 q80 18 160 -10"
          stroke="#FFFFFF"
          strokeWidth="1.3"
          fill="none"
          opacity="0.22"
          strokeLinecap="round"
        />
        <path
          d="M-10 250 q90 -22 180 -3 q60 16 130 -9"
          stroke="#FFFFFF"
          strokeWidth="1.3"
          fill="none"
          opacity="0.16"
          strokeLinecap="round"
        />
      </svg>

      {wave && (
        <svg
          className="ombre-page__wave"
          viewBox="0 0 300 40"
          preserveAspectRatio="none"
          style={{ top: `${wave.top}%` }}
          aria-hidden="true"
        >
          <path
            d={wave.d}
            stroke="#FFFDF7"
            strokeWidth="1.6"
            fill="none"
            opacity="0.5"
            strokeLinecap="round"
          />
        </svg>
      )}

      <div className="ombre-page__inner">{children}</div>
    </div>
  )
}

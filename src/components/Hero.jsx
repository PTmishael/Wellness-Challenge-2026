/**
 * The dark cinematic top section, with one soft ripple line
 * and a curved white sheet rising into it.
 */
export function Hero({ children, height }) {
  return (
    <div className="hero" style={height ? { minHeight: height } : undefined}>
      <div className="hero__glow" />
      <svg
        className="hero__ripple"
        viewBox="0 0 400 40"
        preserveAspectRatio="none"
        style={{ bottom: 54 }}
        aria-hidden="true"
      >
        <path
          d="M-20 26 q70 -20 150 -4 q80 16 150 -10 q60 -18 140 -2"
          stroke="var(--deep-line)"
          strokeWidth="1.4"
          fill="none"
          opacity="0.28"
          strokeLinecap="round"
        />
      </svg>
      <div className="hero__inner">{children}</div>
    </div>
  )
}

/** The curved white panel that overlaps the hero above it. */
export function Sheet({ children }) {
  return (
    <div className="sheet">
      <svg className="sheet__curve" viewBox="0 0 400 44" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,44 L0,24 C110,-8 292,50 400,10 L400,44 Z" fill="var(--sheet)" />
      </svg>
      <div className="sheet__body">{children}</div>
    </div>
  )
}

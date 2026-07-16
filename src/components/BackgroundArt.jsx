/** Decorative animated blobs & shapes behind the whole app. */
export default function BackgroundArt() {
  return (
    <div className="bg-art" aria-hidden="true">
      <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <g className="blob-a"><ellipse cx="350" cy="70"  rx="175" ry="150" fill="#37693D22" /></g>
        <g className="blob-b"><ellipse cx="15"  cy="245" rx="140" ry="118" fill="#8B5CF61C" /></g>
        <g className="blob-c"><ellipse cx="385" cy="435" rx="130" ry="110" fill="#38BDF81E" /></g>
        <g className="blob-a" style={{ animationDelay: '-4s' }}>
          <ellipse cx="40" cy="600" rx="160" ry="128" fill="#FFA62B1E" />
        </g>
        <g className="blob-b" style={{ animationDelay: '-6s' }}>
          <ellipse cx="360" cy="725" rx="118" ry="140" fill="#FF6B6B18" />
        </g>
        <g className="blob-c" style={{ animationDelay: '-2s' }}>
          <ellipse cx="195" cy="145" rx="85" ry="62" fill="#FACC1518" />
        </g>

        <path d="M340 110 Q398 232 314 322" stroke="#37693D" strokeWidth="1.6" fill="none" strokeOpacity=".22" strokeDasharray="6 9" />
        <path d="M22 460 Q104 388 206 432"  stroke="#8B5CF6" strokeWidth="1.6" fill="none" strokeOpacity=".2"  strokeDasharray="4 7" />
        <path d="M198 612 Q352 662 388 742" stroke="#38BDF8" strokeWidth="1.6" fill="none" strokeOpacity=".2"  strokeDasharray="5 8" />

        <circle cx="318" cy="205" r="7" fill="#FF6B6B" opacity=".28" />
        <circle cx="76"  cy="356" r="5" fill="#FFA62B" opacity=".32" />
        <circle cx="352" cy="548" r="6" fill="#37693D" opacity=".26" />
        <circle cx="132" cy="658" r="8" fill="#8B5CF6" opacity=".22" />
        <circle cx="298" cy="742" r="5" fill="#FACC15" opacity=".3" />
        <circle cx="60"  cy="112" r="6" fill="#38BDF8" opacity=".26" />

        <polygon points="58,78 80,46 102,78"      fill="#FACC15" opacity=".2" />
        <polygon points="330,362 352,334 374,362" fill="#FF6B6B" opacity=".2" />
        <polygon points="38,682 60,654 82,682"    fill="#8B5CF6" opacity=".18" />

        <path d="M296 296 q16 -24 36 -26 q-5 26 -25 35 q-9 -2 -11 -9z" fill="#37693D" opacity=".18" />
        <path d="M64 516 q14 -22 32 -24 q-4 24 -22 32 q-8 -2 -10 -8z"   fill="#37693D" opacity=".16" />
      </svg>
    </div>
  )
}

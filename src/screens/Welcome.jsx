import Logo from '../components/Logo'
import { PILLARS } from '../constants'

const PILL_CLASSES = ['pill--green', 'pill--sky', 'pill--coral', 'pill--violet', 'pill--amber']

export default function Welcome({ onNavigate }) {
  return (
    <div className="screen-center">
      <Logo size={112} style={{ marginBottom: 24 }} />

      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 5 }}>Wellness Challenge</h1>
      <p style={{ color: 'var(--brand)', fontSize: 15, fontWeight: 800, marginBottom: 16 }}>
        برنامج التحدي الصحي مع كوتش مشاعل 🌿
      </p>
      <p
        style={{
          color: 'var(--ink-sub)',
          fontSize: 14,
          lineHeight: 1.95,
          maxWidth: 315,
          margin: '0 auto 14px',
          fontWeight: 600,
        }}
      >
        ٥ عادات يومية · ٣ مستويات لكل عادة · مجتمع نسائي يشجّعك خطوة بخطوة
      </p>

      <div
        style={{
          display: 'flex',
          gap: 6,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 28,
        }}
      >
        {PILLARS.map((pillar, i) => (
          <span key={pillar.id} className={`pill ${PILL_CLASSES[i]}`}>
            {pillar.icon} {pillar.name}
          </span>
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: 312 }}>
        <button className="btn btn--brand" onClick={() => onNavigate('register')}>
          🌱 انضمّي للتحدي
        </button>
        <button className="btn btn--ghost" onClick={() => onNavigate('login')}>
          لديّ حساب
        </button>
        <button className="btn--link" onClick={() => onNavigate('admin')}>
          دخول الإدارة
        </button>
        <p className="offline-note">📴 يعمل بدون إنترنت · بياناتك محفوظة على جهازك</p>
      </div>
    </div>
  )
}

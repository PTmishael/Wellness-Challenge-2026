import Logo from '../components/Logo'
import { PILLARS } from '../constants'

const PILL_CLASSES = ['pill--green', 'pill--sky', 'pill--coral', 'pill--violet', 'pill--amber']

export default function Welcome({ onNavigate }) {
  return (
    <div className="screen-center">
      <Logo size={112} style={{ marginBottom: 24 }} />

      <h1 style={{ fontSize: 31, fontWeight: 900, marginBottom: 8 }}>Wellness Challenge</h1>
      <p style={{ color: 'var(--brand)', fontSize: 18, fontWeight: 800, marginBottom: 18 }}>
        مجتمع نسائي، نشجّع بعض 🌿
      </p>

      <p
        style={{
          color: 'var(--ink-sub)',
          fontSize: 17,
          lineHeight: 2,
          maxWidth: 340,
          margin: '0 auto 18px',
          fontWeight: 600,
        }}
      >
        سجّلي إنجازك اليومي بكل صدق واجمعي الميداليات…
        <br />
        <span style={{ color: 'var(--brand-dark)', fontWeight: 800 }}>
          والميدالية الحقيقية هي صحتك 💚
        </span>
      </p>

      <div
        style={{
          display: 'flex',
          gap: 7,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 30,
        }}
      >
        {PILLARS.map((pillar, i) => (
          <span
            key={pillar.id}
            className={`pill ${PILL_CLASSES[i]}`}
            style={{ fontSize: 14, padding: '5px 13px' }}
          >
            {pillar.icon} {pillar.name}
          </span>
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: 320 }}>
        <button className="btn btn--brand" style={{ fontSize: 18 }} onClick={() => onNavigate('register')}>
          🌱 انضمّي للتحدي
        </button>
        <button className="btn btn--ghost" style={{ fontSize: 17 }} onClick={() => onNavigate('login')}>
          لديّ حساب
        </button>
        <button className="btn--link" style={{ fontSize: 14 }} onClick={() => onNavigate('admin')}>
          دخول الإدارة
        </button>
      </div>
    </div>
  )
}

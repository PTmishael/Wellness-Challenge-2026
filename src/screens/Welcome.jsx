import Logo from '../components/Logo'
import { Hero, Sheet } from '../components/Hero'
import { PILLARS, CHALLENGE_DAYS } from '../constants'
import { arabicDigits } from '../lib/utils'

export default function Welcome({ onNavigate }) {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--sheet)' }}>
      <Hero>
        <div style={{ textAlign: 'center', paddingBottom: 74 }}>
          <Logo size={78} variant="white" style={{ margin: '0 auto 20px' }} />

          <h1 className="hero__title">
            مجتمع نسائي
            <br />
            نشجّع بعض
          </h1>
          <p className="hero__sub">
            سجّلي إنجازك اليومي بكل صدق
            <br />
            واجمعي الميداليات
          </p>
        </div>
      </Hero>

      <Sheet>
        <p
          style={{
            color: 'var(--brand-dark)',
            fontSize: 15,
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: 18,
          }}
        >
          الميدالية الحقيقية هي صحتك 💚
        </p>

        <div
          style={{
            display: 'flex',
            gap: 7,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 22,
          }}
        >
          {PILLARS.map((pillar) => (
            <span
              key={pillar.id}
              style={{
                background: '#EDF3EF',
                color: '#3D5147',
                fontSize: 13,
                fontWeight: 700,
                padding: '6px 13px',
                borderRadius: 20,
              }}
            >
              {pillar.icon} {pillar.name.split(' ')[0]}
            </span>
          ))}
        </div>

        <p
          style={{
            textAlign: 'center',
            color: 'var(--ink-mute)',
            fontSize: 12.5,
            fontWeight: 700,
            marginBottom: 18,
          }}
        >
          ٥ عادات · ٣ مستويات · {arabicDigits(CHALLENGE_DAYS)} يوم
        </p>

        <button className="btn btn--deep" style={{ fontSize: 17 }} onClick={() => onNavigate('register')}>
          انضمّي للتحدي
        </button>
        <button className="btn btn--soft" style={{ fontSize: 16 }} onClick={() => onNavigate('login')}>
          لديّ حساب
        </button>
        <button className="btn--link" style={{ fontSize: 13 }} onClick={() => onNavigate('admin')}>
          دخول الإدارة
        </button>
      </Sheet>
    </div>
  )
}

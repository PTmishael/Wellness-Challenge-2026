import Logo from '../components/Logo'
import { Hero, Sheet } from '../components/Hero'

export default function Welcome({ onNavigate }) {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--sheet)' }}>
      <Hero>
        <div style={{ textAlign: 'center', paddingBottom: 78 }}>
          <Logo size={80} variant="white" style={{ margin: '0 auto 20px' }} />

          <h1 style={{ color: 'var(--deep-text)', fontSize: 28, fontWeight: 900, letterSpacing: '-0.01em' }}>
            تحدي العافية
          </h1>
          <p style={{ color: 'var(--deep-sub)', fontSize: 15, fontWeight: 700, marginTop: 8 }}>
            ٢٨ يوم نبني فيها عادات تدوم
          </p>
        </div>
      </Hero>

      <Sheet>
        <p
          style={{
            color: 'var(--ink-sub)',
            fontSize: 15,
            lineHeight: 2,
            fontWeight: 600,
            textAlign: 'center',
            marginBottom: 12,
          }}
        >
          سجّلي عاداتك اليومية، تابعي تقدمك، وشجّعي البنات معك.
        </p>
        <p
          style={{
            color: 'var(--brand-dark)',
            fontSize: 15,
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.9,
            marginBottom: 24,
          }}
        >
          كل ميدالية تمثّل وعدًا قطعتيه لنفسك
        </p>

        <button className="btn btn--deep" style={{ fontSize: 17 }} onClick={() => onNavigate('register')}>
          ابدئي رحلتك
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

import Logo from '../components/Logo'

export default function Splash() {
  return (
    <div className="screen-center">
      <Logo size={98} bob style={{ marginBottom: 22 }} />
      <h1 style={{ fontSize: 25, fontWeight: 900, marginBottom: 5 }}>Wellness Challenge</h1>
      <p style={{ color: 'var(--brand)', fontSize: 14, fontWeight: 800, marginBottom: 18 }}>
        كوتش مشاعل · Coach Mishael
      </p>
      <p style={{ color: 'var(--ink-mute)', fontSize: 13, fontWeight: 600 }}>جاري التحميل…</p>
    </div>
  )
}

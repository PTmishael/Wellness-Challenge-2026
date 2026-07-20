import Logo from '../components/Logo'

export default function Splash() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(168deg,#2C4640 0%,#1B2E2A 48%,#12201D 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 24,
      }}
    >
      <Logo size={104} variant="white" style={{ marginBottom: 22 }} />
      <h1 style={{ color: 'var(--deep-text)', fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
        Wellness Challenge
      </h1>
      <p style={{ color: 'var(--deep-sub)', fontSize: 14, fontWeight: 700 }}>
        كوتش مشاعل · Coach Mishael
      </p>
    </div>
  )
}

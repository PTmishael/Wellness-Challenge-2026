import Logo from '../components/Logo'

export default function Splash() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(172deg,#B9A88C 0%,#7C8A7E 44%,#465862 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 24,
      }}
    >
      <Logo size={104} variant="white" style={{ marginBottom: 22 }} />
      <h1 style={{ color: '#FCF8F0', fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
        Wellness Challenge
      </h1>
      <p style={{ color: '#EDE6D8', fontSize: 14, fontWeight: 700 }}>
        كوتش مشاعل · Coach Mishael
      </p>
    </div>
  )
}

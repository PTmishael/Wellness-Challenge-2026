import Logo from '../components/Logo'
import { APP_OMBRE } from '../constants'

export default function Splash() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: APP_OMBRE,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 24,
      }}
    >
      <Logo size={72} variant="white" style={{ marginBottom: 20, opacity: 0.95 }} />
      <h1 style={{ color: '#FFFDF7', fontSize: 21, fontWeight: 800, marginBottom: 6 }}>
        Wellness Challenge
      </h1>
      <p style={{ color: '#EAF2E5', fontSize: 13, fontWeight: 700 }}>كوتش مشاعل · Coach Mishael</p>
    </div>
  )
}

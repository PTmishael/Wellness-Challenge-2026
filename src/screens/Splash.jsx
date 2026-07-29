import Logo from '../components/Logo'
import { SCENES } from '../constants'

export default function Splash() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 24,
        background: '#E6EDE4',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${import.meta.env.BASE_URL}${SCENES.app.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, background: SCENES.app.wash }} />

      <div style={{ position: 'relative' }}>
        <Logo size={72} style={{ margin: '0 auto 20px' }} />
        <h1 className="scene-title" style={{ fontSize: 21, marginBottom: 6 }}>
          Wellness Challenge
        </h1>
        <p className="scene-sub" style={{ fontSize: 13 }}>كوتش مشاعل · Coach Mishael</p>

        <div className="splash-dots" aria-label="جاري التحميل">
          <span />
          <span />
          <span />
        </div>
        <p className="scene-sub" style={{ fontSize: 11.5, marginTop: 14, opacity: 0.85 }}>
          جاري التحميل… أول فتحة تاخذ شوي
        </p>
      </div>
    </div>
  )
}

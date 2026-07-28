import Logo from '../components/Logo'
import OmbrePage from '../components/OmbrePage'
import { APP_OMBRE, APP_WAVE } from '../constants'

export default function Welcome({ onNavigate }) {
  return (
    <OmbrePage ombre={APP_OMBRE} wave={APP_WAVE}>
      <div style={{ paddingTop: 14, textAlign: 'center' }}>
        <div
          style={{
            width: 64,
            height: 64,
            margin: '0 auto 16px',
            borderRadius: 20,
            background: 'rgba(255,255,255,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Logo size={38} />
        </div>

        <h1 className="ombre-title" style={{ fontSize: 26 }}>تحدي العافية</h1>
        <p className="ombre-sub" style={{ fontSize: 12.5, marginTop: 7 }}>
          ٢٨ يوم نبني فيها عادات تدوم
        </p>
        <p className="ombre-sub" style={{ fontSize: 12.5, lineHeight: 2.1, marginTop: 12 }}>
          سجّلي عاداتك اليومية
          <br />
          تابعي تقدمك، وشجّعي البنات معك
        </p>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 40 }}>
        <button className="btn btn--ombre-solid" style={{ fontSize: 16 }} onClick={() => onNavigate('register')}>
          ابدئي رحلتك
        </button>
        <button className="btn btn--ombre-ghost" style={{ fontSize: 15 }} onClick={() => onNavigate('login')}>
          لديّ حساب
        </button>
        <button
          className="btn--link"
          style={{ fontSize: 12.5, color: '#FFFDF7', fontWeight: 800 }}
          onClick={() => onNavigate('admin')}
        >
          دخول الإدارة
        </button>
      </div>
    </OmbrePage>
  )
}

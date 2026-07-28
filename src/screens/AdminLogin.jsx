import { useState } from 'react'
import Logo from '../components/Logo'
import OmbrePage from '../components/OmbrePage'
import { ADMIN_USERNAME, ADMIN_PASSWORD, APP_OMBRE, APP_WAVE } from '../constants'
import { fetchMemberById, saveMember, saveSession } from '../lib/storage'
import { createMember, today } from '../lib/utils'

export default function AdminLogin({ onSignedIn, onBack }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit() {
    setError('')

    if (username.trim() !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      setError('اسم المستخدم أو كلمة السر غلط ❌')
      return
    }

    setBusy(true)
    try {
      let admin = await fetchMemberById('admin')

      if (!admin) {
        const draft = createMember({ id: 'admin', name: 'كوتش مشاعل', skinIndex: 1, isAdmin: true })
        draft.joinDate = '2025-01-01'
        admin = await saveMember(draft)
      }

      if (!admin) {
        setError('تعذّر الاتصال بقاعدة البيانات')
        return
      }

      saveSession({ userId: 'admin', date: today(), todayLog: {}, checkedIn: false })
      onSignedIn(admin, true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <OmbrePage ombre={APP_OMBRE} wave={APP_WAVE}>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 52,
            height: 52,
            margin: '0 auto 14px',
            borderRadius: 17,
            background: 'rgba(255,255,255,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Logo size={30} />
        </div>
        <p className="ombre-sub" style={{ fontSize: 11, letterSpacing: '0.06em' }}>دخول الإدارة</p>
        <h1 className="ombre-title" style={{ fontSize: 21, marginTop: 4 }}>كوتش مشاعل</h1>
      </div>

      <div style={{ marginTop: 22 }}>
        <input
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="اسم المستخدم"
          style={{ marginBottom: 10, fontSize: 16, background: 'rgba(255,255,255,0.9)' }}
          autoFocus
        />
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="كلمة السر"
          style={{ fontSize: 16, background: 'rgba(255,255,255,0.9)' }}
        />
        {error && <p className="error-text">{error}</p>}

        <button className="btn btn--ombre-solid" style={{ fontSize: 16 }} onClick={handleSubmit} disabled={busy}>
          {busy ? 'لحظة…' : 'دخول الإدارة'}
        </button>
        <button className="btn btn--ombre-ghost" onClick={onBack}>رجوع</button>
      </div>
    </OmbrePage>
  )
}

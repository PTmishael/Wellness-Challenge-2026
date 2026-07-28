import { useState } from 'react'
import Logo from '../components/Logo'
import OmbrePage from '../components/OmbrePage'
import { APP_OMBRE, APP_WAVE } from '../constants'
import { fetchMemberByName, saveMember, getSession, saveSession } from '../lib/storage'
import { today } from '../lib/utils'

export default function Login({ onSignedIn, onBack }) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit() {
    const trimmed = name.trim()
    setError('')

    if (!trimmed) {
      setError('اكتبي اسمك')
      return
    }

    setBusy(true)
    try {
      const found = await fetchMemberByName(trimmed)

      if (!found || found.isAdmin) {
        setError('الاسم غير موجود — سجّلي أولاً كعضوة جديدة')
        return
      }

      if (found.password) {
        if (found.password !== password) {
          setError('كلمة السر غلط، جربي مرة ثانية')
          return
        }
      } else {
        if (password.length < 4) {
          setError('كلمة السر لازم تكون ٤ أحرف أو أكثر')
          return
        }
        found.password = password
        await saveMember(found)
      }

      const session = getSession() ?? {}
      const sameDay = session.userId === found.id && session.date === today()
      const todayLog = sameDay ? session.todayLog ?? {} : {}
      const checkedIn = sameDay ? Boolean(session.checkedIn) : false

      saveSession({ userId: found.id, date: today(), todayLog, checkedIn })
      onSignedIn(found, false, { todayLog, checkedIn })
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
        <p className="ombre-sub" style={{ fontSize: 11, letterSpacing: '0.06em' }}>دخول الحساب</p>
        <h1 className="ombre-title" style={{ fontSize: 21, marginTop: 4 }}>أهلاً بعودتك</h1>
      </div>

      <div style={{ marginTop: 22 }}>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسمك في التطبيق…"
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
          {busy ? 'لحظة…' : 'دخول'}
        </button>
        <button className="btn btn--ombre-ghost" onClick={onBack}>رجوع</button>
      </div>
    </OmbrePage>
  )
}

import { useState } from 'react'
import Logo from '../components/Logo'
import { getMembers, getSession, saveSession, upsertMember } from '../lib/storage'
import { today } from '../lib/utils'

export default function Login({ onSignedIn, onBack }) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    const trimmed = name.trim()
    setError('')

    if (!trimmed) {
      setError('اكتبي اسمك')
      return
    }

    const members = getMembers()
    const found = Object.values(members).find((m) => m.name === trimmed && !m.isAdmin)

    if (!found) {
      setError('الاسم غير موجود — سجّلي أولاً كعضوة جديدة')
      return
    }

    // Older accounts (created before passwords existed) adopt the first
    // password they log in with.
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
      upsertMember(found)
    }

    const session = getSession() ?? {}
    const sameDay = session.userId === found.id && session.date === today()
    const todayLog = sameDay ? session.todayLog ?? {} : {}
    const checkedIn = sameDay ? Boolean(session.checkedIn) : false

    saveSession({ userId: found.id, date: today(), todayLog, checkedIn })
    onSignedIn(found, false, { todayLog, checkedIn })
  }

  return (
    <div className="screen-center">
      <div style={{ width: '100%', maxWidth: 372 }}>
        <Logo size={58} style={{ marginBottom: 18 }} />

        <div className="card fade-up">
          <p className="section-label">دخول الحساب</p>
          <h3 style={{ fontSize: 21, fontWeight: 900, marginBottom: 16 }}>أهلاً بعودتك 👋</h3>

          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسمك في التطبيق…"
            style={{ marginBottom: 10, fontSize: 16 }}
            autoFocus
          />
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="كلمة السر"
            style={{ fontSize: 16 }}
          />
          {error && <p className="error-text">{error}</p>}

          <button className="btn btn--brand" style={{ fontSize: 17 }} onClick={handleSubmit}>
            دخول ←
          </button>
          <button className="btn btn--ghost" onClick={onBack}>رجوع</button>
        </div>
      </div>
    </div>
  )
}

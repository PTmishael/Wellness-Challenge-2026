import { useState } from 'react'
import Logo from '../components/Logo'
import { getMembers, getSession, saveSession } from '../lib/storage'
import { today } from '../lib/utils'

export default function Login({ onSignedIn, onBack }) {
  const [name, setName] = useState('')
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

    // Restore today's in-progress check-in if it belongs to this member.
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
          <h3 style={{ fontSize: 19, fontWeight: 900, marginBottom: 16 }}>أهلاً بعودتك 👋</h3>

          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="اسمك في التطبيق…"
            autoFocus
          />
          {error && <p className="error-text">{error}</p>}

          <button className="btn btn--brand" onClick={handleSubmit}>دخول ←</button>
          <button className="btn btn--ghost" onClick={onBack}>رجوع</button>
        </div>
      </div>
    </div>
  )
}

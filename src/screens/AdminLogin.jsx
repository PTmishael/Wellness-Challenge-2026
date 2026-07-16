import { useState } from 'react'
import Logo from '../components/Logo'
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../constants'
import { getMembers, upsertMember, saveSession } from '../lib/storage'
import { createMember, today } from '../lib/utils'

export default function AdminLogin({ onSignedIn, onBack }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    setError('')

    if (username.trim() !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      setError('اسم المستخدم أو كلمة السر غلط ❌')
      return
    }

    const members = getMembers()
    let admin = members.admin

    if (!admin) {
      admin = createMember({
        id: 'admin',
        name: 'كوتش مشاعل',
        skinIndex: 1,
        isAdmin: true,
      })
      admin.joinDate = '2025-01-01'
      upsertMember(admin)
    }

    saveSession({ userId: 'admin', date: today(), todayLog: {}, checkedIn: false })
    onSignedIn(admin, true)
  }

  return (
    <div className="screen-center">
      <div style={{ width: '100%', maxWidth: 372 }}>
        <Logo size={58} style={{ marginBottom: 18 }} />

        <div className="card fade-up">
          <p className="section-label">دخول الإدارة</p>
          <h3 style={{ fontSize: 19, fontWeight: 900, marginBottom: 16 }}>كوتش مشاعل 👑</h3>

          <input
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="اسم المستخدم"
            style={{ marginBottom: 10 }}
            autoFocus
          />
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="كلمة السر"
          />
          {error && <p className="error-text">{error}</p>}

          <button className="btn btn--danger" onClick={handleSubmit}>دخول الإدارة ←</button>
          <button className="btn btn--ghost" onClick={onBack}>رجوع</button>
        </div>
      </div>
    </div>
  )
}

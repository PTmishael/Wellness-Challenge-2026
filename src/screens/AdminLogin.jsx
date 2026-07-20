import { useState } from 'react'
import Logo from '../components/Logo'
import { Hero, Sheet } from '../components/Hero'
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
      admin = createMember({ id: 'admin', name: 'كوتش مشاعل', skinIndex: 1, isAdmin: true })
      admin.joinDate = '2025-01-01'
      upsertMember(admin)
    }

    saveSession({ userId: 'admin', date: today(), todayLog: {}, checkedIn: false })
    onSignedIn(admin, true)
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--sheet)' }}>
      <Hero>
        <div style={{ paddingBottom: 62 }}>
          <Logo size={54} variant="white" style={{ margin: '0 auto 16px' }} />
          <p className="hero__eyebrow" style={{ textAlign: 'center' }}>دخول الإدارة</p>
          <h1 className="hero__title" style={{ fontSize: 22, textAlign: 'center', marginTop: 5 }}>
            كوتش مشاعل 👑
          </h1>
        </div>
      </Hero>

      <Sheet>
        <input
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="اسم المستخدم"
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

        <button className="btn btn--deep" style={{ fontSize: 17 }} onClick={handleSubmit}>
          دخول الإدارة
        </button>
        <button className="btn btn--soft" onClick={onBack}>رجوع</button>
      </Sheet>
    </div>
  )
}

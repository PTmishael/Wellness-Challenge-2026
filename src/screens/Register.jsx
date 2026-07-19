import { useState } from 'react'
import Logo from '../components/Logo'
import { SKINS, MAX_MEMBERS } from '../constants'
import { getMembers, upsertMember, saveSession } from '../lib/storage'
import { createMember } from '../lib/utils'

export default function Register({ onSignedIn, onBack }) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function handleSubmit() {
    const trimmed = name.trim()
    setError('')

    if (!trimmed) {
      setError('اكتبي اسمك')
      return
    }
    if (password.length < 4) {
      setError('كلمة السر لازم تكون ٤ أحرف أو أكثر')
      return
    }

    setBusy(true)
    const members = getMembers()
    const nonAdmins = Object.values(members).filter((m) => !m.isAdmin)

    if (nonAdmins.length >= MAX_MEMBERS) {
      setError(`وصلنا للحد الأقصى (${MAX_MEMBERS} عضوة) — تواصلي مع كوتش مشاعل`)
      setBusy(false)
      return
    }

    if (Object.values(members).some((m) => m.name === trimmed)) {
      setError('هذا الاسم موجود، جربي اسماً آخر')
      setBusy(false)
      return
    }

    // Avatar is assigned automatically — no picking step.
    const skinIndex = Math.floor(Math.random() * SKINS.length)
    const member = createMember({ name: trimmed, skinIndex })
    member.password = password
    upsertMember(member)
    saveSession({ userId: member.id, date: '', todayLog: {}, checkedIn: false })
    onSignedIn(member, false)
  }

  return (
    <div className="screen-center">
      <div style={{ width: '100%', maxWidth: 372 }}>
        <Logo size={58} style={{ marginBottom: 18 }} />

        <div className="card fade-up">
          <p className="section-label">عضوة جديدة</p>
          <h3 style={{ fontSize: 21, fontWeight: 900, marginBottom: 16 }}>أهلاً فيك 🌸</h3>

          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسمك أو لقبك…"
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

          <button className="btn btn--brand" style={{ fontSize: 17 }} onClick={handleSubmit} disabled={busy}>
            {busy ? 'جاري التسجيل…' : '🌱 انضمّي للتحدي!'}
          </button>
          <button className="btn btn--ghost" onClick={onBack}>رجوع</button>
        </div>
      </div>
    </div>
  )
}

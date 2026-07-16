import { useState } from 'react'
import Logo from '../components/Logo'
import Avatar from '../components/Avatar'
import { SKINS, MAX_MEMBERS } from '../constants'
import { getMembers, upsertMember, saveSession } from '../lib/storage'
import { createMember } from '../lib/utils'

export default function Register({ onSignedIn, onBack }) {
  const [name, setName] = useState('')
  const [skinIndex, setSkinIndex] = useState(0)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function handleSubmit() {
    const trimmed = name.trim()
    setError('')

    if (!trimmed) {
      setError('اكتبي اسمك')
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

    const member = createMember({ name: trimmed, skinIndex })
    upsertMember(member)
    saveSession({ userId: member.id, date: '', todayLog: {}, checkedIn: false })
    onSignedIn(member, false)
  }

  return (
    <div className="screen-center" style={{ justifyContent: 'flex-start', paddingTop: 40 }}>
      <div style={{ width: '100%', maxWidth: 372 }}>
        <Logo size={58} style={{ marginBottom: 18 }} />

        <div className="card fade-up">
          <p className="section-label">عضوة جديدة — خطوة ١ من ٢</p>
          <h3 style={{ fontSize: 19, fontWeight: 900, marginBottom: 14 }}>ما اسمك؟ 🌸</h3>

          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="اكتبي اسمك أو لقبك…"
            autoFocus
          />
          {error && <p className="error-text">{error}</p>}

          <div style={{ marginTop: 20 }}>
            <p className="section-label">خطوة ٢ من ٢ — اختاري رمزك</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {SKINS.map((skin, i) => (
                <button
                  key={skin}
                  onClick={() => setSkinIndex(i)}
                  aria-label={`رمز ${skin}`}
                  style={{
                    fontSize: 26,
                    background: skinIndex === i ? 'var(--brand-tint)' : '#F3F7F4',
                    border: `2.5px solid ${skinIndex === i ? 'var(--brand)' : 'var(--border)'}`,
                    borderRadius: 14,
                    padding: '9px 0',
                    cursor: 'pointer',
                    transition: 'all .18s ease',
                    transform: skinIndex === i ? 'scale(1.06)' : 'scale(1)',
                    width: '100%',
                  }}
                >
                  {skin}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--brand-tint)',
              borderRadius: 16,
              padding: '13px 15px',
              margin: '16px 0 4px',
            }}
          >
            <Avatar skinIndex={skinIndex} colorIndex={skinIndex} size={48} />
            <span style={{ fontSize: 15, fontWeight: 900 }}>{name.trim() || 'اسمك هنا'}</span>
          </div>

          <button className="btn btn--brand" onClick={handleSubmit} disabled={busy}>
            {busy ? 'جاري التسجيل…' : '🌱 انضمّي للتحدي!'}
          </button>
          <button className="btn btn--ghost" onClick={onBack}>رجوع</button>
        </div>
      </div>
    </div>
  )
}

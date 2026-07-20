import { useState } from 'react'
import Logo from '../components/Logo'
import { Hero, Sheet } from '../components/Hero'
import { SKINS, MAX_MEMBERS } from '../constants'
import { fetchMembers, saveMember, saveSession } from '../lib/storage'
import { createMember } from '../lib/utils'

export default function Register({ onSignedIn, onBack }) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit() {
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
    try {
      const members = await fetchMembers()
      const nonAdmins = Object.values(members).filter((m) => !m.isAdmin)

      if (nonAdmins.length >= MAX_MEMBERS) {
        setError(`وصلنا للحد الأقصى (${MAX_MEMBERS} عضوة) — تواصلي مع كوتش مشاعل`)
        return
      }
      if (Object.values(members).some((m) => m.name === trimmed)) {
        setError('هذا الاسم موجود، جربي اسماً آخر')
        return
      }

      const skinIndex = Math.floor(Math.random() * SKINS.length)
      const draft = createMember({ name: trimmed, skinIndex, bio: bio.trim() })
      draft.password = password

      const saved = await saveMember(draft)
      if (!saved) {
        setError('تعذّر الحفظ، تأكدي من الاتصال وحاولي مرة ثانية')
        return
      }

      saveSession({ userId: saved.id, date: '', todayLog: {}, checkedIn: false })
      onSignedIn(saved, false)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--sheet)' }}>
      <Hero>
        <div style={{ paddingBottom: 62 }}>
          <Logo size={54} variant="white" style={{ margin: '0 auto 16px' }} />
          <p className="hero__eyebrow" style={{ textAlign: 'center' }}>عضوة جديدة</p>
          <h1 className="hero__title" style={{ fontSize: 22, textAlign: 'center', marginTop: 5 }}>
            أهلاً فيك
          </h1>
        </div>
      </Hero>

      <Sheet>
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
          placeholder="كلمة السر"
          style={{ marginBottom: 10, fontSize: 16 }}
        />
        <textarea
          className="input"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, 160))}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
          placeholder="قوليلي شي مميز عنك…"
          style={{ fontSize: 15, lineHeight: 1.7 }}
        />
        <p
          style={{
            color: 'var(--ink-mute)',
            fontSize: 11.5,
            fontWeight: 600,
            marginTop: 6,
            textAlign: 'left',
          }}
        >
          {bio.length}/160 · اختياري
        </p>

        {error && <p className="error-text">{error}</p>}

        <button className="btn btn--deep" style={{ fontSize: 17 }} onClick={handleSubmit} disabled={busy}>
          {busy ? 'جاري التسجيل…' : 'ابدئي رحلتك'}
        </button>
        <button className="btn btn--soft" onClick={onBack}>رجوع</button>
      </Sheet>
    </div>
  )
}

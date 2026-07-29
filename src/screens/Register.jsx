import { useState } from 'react'
import Logo from '../components/Logo'
import ScenePage from '../components/ScenePage'
import { SKINS, MAX_MEMBERS, SCENES } from '../constants'
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
    <ScenePage scene={SCENES.app}>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 52,
            height: 52,
            margin: '0 auto 14px',
            borderRadius: 17,
            background: 'rgba(255,255,255,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Logo size={30} />
        </div>
        <p className="scene-sub" style={{ fontSize: 11, letterSpacing: '0.06em' }}>عضوة جديدة</p>
        <h1 className="scene-title" style={{ fontSize: 21, marginTop: 4 }}>أهلاً فيك</h1>
      </div>

      <div style={{ marginTop: 22 }}>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسمك أو لقبك…"
          style={{ marginBottom: 10, fontSize: 16, background: 'rgba(255,255,255,0.92)' }}
          autoFocus
        />
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة السر"
          style={{ marginBottom: 10, fontSize: 16, background: 'rgba(255,255,255,0.92)' }}
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
          placeholder="قوليلي شئ مميز عنك…"
          style={{ fontSize: 15, lineHeight: 1.7, background: 'rgba(255,255,255,0.92)' }}
        />
        <p style={{ color: 'var(--ink-scene-sub)', fontSize: 11.5, fontWeight: 600, marginTop: 6, textAlign: 'left' }}>
          {bio.length}/160 · اختياري
        </p>

        {error && <p className="error-text">{error}</p>}

        <button className="btn btn--scene-solid" style={{ fontSize: 16 }} onClick={handleSubmit} disabled={busy}>
          {busy ? 'جاري التسجيل…' : 'ابدئي رحلتك'}
        </button>
        <button className="btn btn--scene-ghost" onClick={onBack}>رجوع</button>
      </div>
    </ScenePage>
  )
}

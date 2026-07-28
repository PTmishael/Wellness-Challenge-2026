import { useState } from 'react'
import OmbrePage from '../components/OmbrePage'
import { UNLOCKS, APP_OMBRE } from '../constants'
import { arabicDigits, unlockedIds } from '../lib/utils'

// Wave sits lower here, giving the title + subtitle room to breathe above it.
const ACHIEVEMENTS_WAVE = { d: 'M0,20 C90,-6 200,44 300,12', top: 11 }

export default function AchievementsTab({ member, isAdmin = false }) {
  const [openId, setOpenId] = useState(null)
  const [article, setArticle] = useState(null)

  const points = member.points
  const unlocked = new Set(isAdmin ? UNLOCKS.map((u) => u.id) : unlockedIds(points))

  const nextLock = UNLOCKS.find((u) => !unlocked.has(u.id))
  const prevThreshold = [...UNLOCKS].reverse().find((u) => unlocked.has(u.id))?.threshold ?? 0
  const nextThreshold = nextLock?.threshold ?? points
  const span = Math.max(nextThreshold - prevThreshold, 1)
  const progress = nextLock ? Math.min(((points - prevThreshold) / span) * 100, 100) : 100

  if (article) {
    return (
      <OmbrePage ombre={APP_OMBRE} wave={ACHIEVEMENTS_WAVE}>
        <button onClick={() => setArticle(null)} style={backBtn}>← رجوع</button>
        <h2 className="ombre-title--light" style={{ fontSize: 19, marginTop: 16, lineHeight: 1.5 }}>
          {article.q}
        </h2>
        <div className="ombre-sub--light" style={{ fontSize: 14, lineHeight: 2, marginTop: 16, whiteSpace: 'pre-wrap' }}>
          {article.body || article.placeholder}
        </div>
      </OmbrePage>
    )
  }

  if (openId) {
    const lib = UNLOCKS.find((u) => u.id === openId)
    return (
      <OmbrePage ombre={APP_OMBRE} wave={ACHIEVEMENTS_WAVE}>
        <button onClick={() => setOpenId(null)} style={backBtn}>← رجوع</button>
        <h2 className="ombre-title--light" style={{ fontSize: 20, marginTop: 16 }}>{lib.title}</h2>
        <p className="ombre-sub--light" style={{ fontSize: 12, marginTop: 4, lineHeight: 1.7 }}>{lib.subtitle}</p>

        <div style={{ marginTop: 17, display: 'flex', flexDirection: 'column', gap: 9 }}>
          {lib.articles.map((a, i) => (
            <button
              key={i}
              onClick={() => setArticle({ ...a, placeholder: lib.placeholder })}
              style={{
                background: 'rgba(255,255,255,0.13)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 14,
                padding: '13px 15px',
                textAlign: 'right',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ color: '#FFFDF7', fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>{a.q}</span>
              <span style={{ color: '#FFFDF7', fontSize: 15 }}>←</span>
            </button>
          ))}
        </div>
      </OmbrePage>
    )
  }

  return (
    <OmbrePage ombre={APP_OMBRE} wave={ACHIEVEMENTS_WAVE}>
      <div style={{ textAlign: 'center' }}>
        <h2 className="ombre-title" style={{ fontSize: 21 }}>إنجازاتك</h2>
        <p className="ombre-sub" style={{ fontSize: 12, marginTop: 3 }}>
          كل ما تجمعين نقاط، تفتحين أسرار جديدة
        </p>
      </div>

      {isAdmin ? (
        <div
          style={{
            marginTop: 16,
            textAlign: 'center',
            background: 'rgba(255,255,255,0.32)',
            borderRadius: 20,
            padding: '8px 14px',
            color: 'var(--ink-on-ombre)',
            fontSize: 11.5,
            fontWeight: 800,
          }}
        >
          👑 وضع الأدمن · كل المحتوى مفتوح
        </div>
      ) : (
        <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.24)', borderRadius: 16, padding: 15 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
            <span style={{ color: 'var(--ink-on-ombre)', fontSize: 13, fontWeight: 800 }}>
              {arabicDigits(points)} نقطة
            </span>
            {nextLock && (
              <span style={{ color: 'var(--ink-on-ombre-sub)', fontSize: 11, fontWeight: 700 }}>
                القادم: {arabicDigits(nextLock.threshold)}
              </span>
            )}
          </div>
          <div style={{ height: 8, background: 'rgba(0,0,0,0.14)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg,#37693D,#1E3D21)', borderRadius: 20 }} />
          </div>
        </div>
      )}

      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {UNLOCKS.map((u) => {
          const open = unlocked.has(u.id)
          return (
            <button
              key={u.id}
              onClick={() => open && setOpenId(u.id)}
              disabled={!open}
              style={{
                background: open ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                border: `1.5px solid ${open ? 'rgba(255,255,255,0.42)' : 'rgba(255,255,255,0.14)'}`,
                borderRadius: 15,
                padding: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: open ? 'pointer' : 'default',
                opacity: open ? 1 : 0.65,
                fontFamily: 'inherit',
                textAlign: 'right',
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  flexShrink: 0,
                  background: open ? 'rgba(255,255,255,0.26)' : 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 19,
                }}
              >
                {open ? '🔓' : '🔒'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#FFFDF7', fontSize: 13.5, fontWeight: 800 }}>{u.title}</div>
                <div style={{ color: '#EAF2E5', fontSize: 10.5, marginTop: 2, lineHeight: 1.5 }}>
                  {open ? 'مفتوحة — اضغطي للقراءة' : `تفتح عند ${arabicDigits(u.threshold)} نقطة`}
                </div>
              </div>
              {open && <span style={{ color: '#FFFDF7', fontSize: 15 }}>←</span>}
            </button>
          )
        })}
      </div>
    </OmbrePage>
  )
}

const backBtn = {
  background: 'rgba(255,255,255,0.14)',
  border: 'none',
  color: '#FFFDF7',
  borderRadius: 12,
  padding: '8px 15px',
  fontSize: 13,
  fontWeight: 800,
  cursor: 'pointer',
  fontFamily: 'inherit',
}

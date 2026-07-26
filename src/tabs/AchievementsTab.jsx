import { useState } from 'react'
import { UNLOCKS } from '../constants'
import { arabicDigits, unlockedIds } from '../lib/utils'

export default function AchievementsTab({ member, isAdmin = false }) {
  const [openId, setOpenId] = useState(null)
  const [article, setArticle] = useState(null)

  const points = member.points
  const unlocked = new Set(isAdmin ? UNLOCKS.map((u) => u.id) : unlockedIds(points))

  // Next locked threshold, for the progress bar.
  const nextLock = UNLOCKS.find((u) => !unlocked.has(u.id))
  const prevThreshold = [...UNLOCKS].reverse().find((u) => unlocked.has(u.id))?.threshold ?? 0
  const nextThreshold = nextLock?.threshold ?? points
  const span = Math.max(nextThreshold - prevThreshold, 1)
  const progress = nextLock ? Math.min(((points - prevThreshold) / span) * 100, 100) : 100

  // Reading a single article
  if (article) {
    return (
      <div className="fullscreen" style={{ background: 'linear-gradient(172deg,#B3B992 0%,#849072 45%,#505E44 100%)' }}>
        <div className="fullscreen__inner">
          <button onClick={() => setArticle(null)} style={backBtn}>← رجوع</button>
          <h2 style={{ color: '#FCF8F0', fontSize: 20, fontWeight: 800, marginTop: 16, lineHeight: 1.5 }}>
            {article.q}
          </h2>
          <div style={{ color: '#F7F4EC', fontSize: 14.5, lineHeight: 2, marginTop: 16, whiteSpace: 'pre-wrap' }}>
            {article.body || article.placeholder}
          </div>
        </div>
      </div>
    )
  }

  // Browsing one unlocked library
  if (openId) {
    const lib = UNLOCKS.find((u) => u.id === openId)
    return (
      <div className="fullscreen" style={{ background: 'linear-gradient(172deg,#B3B992 0%,#849072 45%,#505E44 100%)' }}>
        <div className="fullscreen__inner">
          <button onClick={() => setOpenId(null)} style={backBtn}>← رجوع</button>
          <h2 style={{ color: '#FCF8F0', fontSize: 21, fontWeight: 800, marginTop: 16 }}>{lib.title}</h2>
          <p style={{ color: '#EDE6D8', fontSize: 12.5, marginTop: 4, lineHeight: 1.7 }}>{lib.subtitle}</p>

          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {lib.articles.map((a, i) => (
              <button
                key={i}
                onClick={() => setArticle({ ...a, placeholder: lib.placeholder })}
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
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
                <span style={{ color: '#FCF8F0', fontSize: 13.5, fontWeight: 600, lineHeight: 1.6 }}>{a.q}</span>
                <span style={{ color: '#FCF8F0', fontSize: 15 }}>←</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // The unlock list
  return (
    <div className="fullscreen" style={{ background: 'linear-gradient(172deg,#B3B992 0%,#849072 45%,#505E44 100%)' }}>
      <div className="fullscreen__inner">
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#FCF8F0', fontSize: 21, fontWeight: 800 }}>إنجازاتك</h2>
          <p style={{ color: '#EDE6D8', fontSize: 12.5, marginTop: 3 }}>
            كل ما تجمعين نقاط، تفتحين أسرار جديدة
          </p>
        </div>

        {isAdmin ? (
          <div
            style={{
              marginTop: 14,
              textAlign: 'center',
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.35)',
              borderRadius: 20,
              padding: '8px 14px',
              color: '#FCF8F0',
              fontSize: 11.5,
              fontWeight: 800,
            }}
          >
            👑 وضع الأدمن · كل المحتوى مفتوح
          </div>
        ) : (
          <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.14)', borderRadius: 16, padding: 15 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
              <span style={{ color: '#FCF8F0', fontSize: 13, fontWeight: 800 }}>
                {arabicDigits(points)} نقطة
              </span>
              {nextLock && (
                <span style={{ color: '#EDE6D8', fontSize: 11.5 }}>
                  القادم: {arabicDigits(nextLock.threshold)}
                </span>
              )}
            </div>
            <div style={{ height: 9, background: 'rgba(255,255,255,0.2)', borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg,#EFE5CF,#F5D76E)', borderRadius: 20 }} />
            </div>
          </div>
        )}

        {/* unlock cards */}
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 11 }}>
          {UNLOCKS.map((u) => {
            const open = unlocked.has(u.id)
            return (
              <button
                key={u.id}
                onClick={() => open && setOpenId(u.id)}
                disabled={!open}
                style={{
                  background: open ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${open ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.12)'}`,
                  borderRadius: 16,
                  padding: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 13,
                  cursor: open ? 'pointer' : 'default',
                  opacity: open ? 1 : 0.55,
                  fontFamily: 'inherit',
                  textAlign: 'right',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    flexShrink: 0,
                    background: open ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                  }}
                >
                  {open ? '🔓' : '🔒'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: open ? '#FCF8F0' : '#EDE6D8', fontSize: 14, fontWeight: 800 }}>
                    {u.title}
                  </div>
                  <div style={{ color: open ? '#EDE6D8' : '#D8CFC0', fontSize: 11, marginTop: 2, lineHeight: 1.5 }}>
                    {open ? 'مفتوحة — اضغطي للقراءة' : `تفتح عند ${arabicDigits(u.threshold)} نقطة`}
                  </div>
                </div>
                {open && <span style={{ color: '#FCF8F0', fontSize: 16 }}>←</span>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const backBtn = {
  background: 'rgba(255,255,255,0.1)',
  border: 'none',
  color: '#FCF8F0',
  borderRadius: 12,
  padding: '8px 15px',
  fontSize: 13,
  fontWeight: 800,
  cursor: 'pointer',
  fontFamily: 'inherit',
}

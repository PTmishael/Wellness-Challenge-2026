import { useState } from 'react'
import ScenePage from '../components/ScenePage'
import { UNLOCKS, SCENES } from '../constants'
import { arabicDigits, unlockedIds } from '../lib/utils'


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
      <ScenePage scene={SCENES.app}>
        <button onClick={() => setArticle(null)} style={backBtn}>← رجوع</button>
        <h2 className="scene-title" style={{ fontSize: 19, marginTop: 16, lineHeight: 1.5 }}>
          {article.q}
        </h2>
        <div className="scene-card" style={{ marginTop: 16 }}><div style={{ color: 'var(--ink-scene-sub)', fontSize: 14, lineHeight: 2, whiteSpace: 'pre-wrap', fontWeight: 600 }}>
          {article.body || article.placeholder}
        </div></div>
      </ScenePage>
    )
  }

  if (openId) {
    const lib = UNLOCKS.find((u) => u.id === openId)
    return (
      <ScenePage scene={SCENES.app}>
        <button onClick={() => setOpenId(null)} style={backBtn}>← رجوع</button>
        <h2 className="scene-title" style={{ fontSize: 20, marginTop: 16 }}>{lib.title}</h2>
        <p className="scene-sub" style={{ fontSize: 12, marginTop: 4, lineHeight: 1.7 }}>{lib.subtitle}</p>

        <div style={{ marginTop: 17, display: 'flex', flexDirection: 'column', gap: 9 }}>
          {lib.articles.map((a, i) => (
            <button
              key={i}
              onClick={() => setArticle({ ...a, placeholder: lib.placeholder })}
              style={{
                background: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(30,61,33,0.16)',
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
              <span style={{ color: 'var(--ink-scene)', fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>{a.q}</span>
              <span style={{ color: 'var(--brand-deep)', fontSize: 15 }}>←</span>
            </button>
          ))}
        </div>
      </ScenePage>
    )
  }

  return (
    <ScenePage scene={SCENES.app}>
      <div style={{ textAlign: 'center' }}>
        <h2 className="scene-title" style={{ fontSize: 21 }}>إنجازاتك</h2>
        <p className="scene-sub" style={{ fontSize: 12, marginTop: 3 }}>
          كل ما تجمعين نقاط، تفتحين أسرار جديدة
        </p>
      </div>

      {isAdmin ? (
        <div
          style={{
            marginTop: 16,
            textAlign: 'center',
            background: 'rgba(255,255,255,0.78)',
            borderRadius: 20,
            padding: '8px 14px',
            color: 'var(--ink-scene)',
            fontSize: 11.5,
            fontWeight: 800,
          }}
        >
          👑 وضع الأدمن · كل المحتوى مفتوح
        </div>
      ) : (
        <div className="scene-card" style={{ marginTop: 16, padding: 15 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
            <span style={{ color: 'var(--ink-scene)', fontSize: 13, fontWeight: 800 }}>
              {arabicDigits(points)} نقطة
            </span>
            {nextLock && (
              <span style={{ color: 'var(--ink-scene-sub)', fontSize: 11, fontWeight: 700 }}>
                القادم: {arabicDigits(nextLock.threshold)}
              </span>
            )}
          </div>
          <div style={{ height: 8, background: 'rgba(30,61,33,0.14)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg,#5C9463,#1E3D21)', borderRadius: 20 }} />
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
                background: open ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.45)',
                border: `1.5px solid ${open ? 'rgba(30,61,33,0.3)' : 'rgba(30,61,33,0.12)'}`,
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
                  background: open ? 'rgba(30,61,33,0.12)' : 'rgba(30,61,33,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 19,
                }}
              >
                {open ? '🔓' : '🔒'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--ink-scene)', fontSize: 13.5, fontWeight: 800 }}>{u.title}</div>
                <div style={{ color: 'var(--ink-scene-sub)', fontSize: 10.5, marginTop: 2, lineHeight: 1.5 }}>
                  {open ? 'مفتوحة — اضغطي للقراءة' : `تفتح عند ${arabicDigits(u.threshold)} نقطة`}
                </div>
              </div>
              {open && <span style={{ color: 'var(--brand-deep)', fontSize: 15 }}>←</span>}
            </button>
          )
        })}
      </div>
    </ScenePage>
  )
}

const backBtn = {
  background: 'rgba(255,255,255,0.78)',
  border: '1px solid rgba(30,61,33,0.16)',
  color: 'var(--ink-scene)',
  borderRadius: 12,
  padding: '8px 15px',
  fontSize: 13,
  fontWeight: 800,
  cursor: 'pointer',
  fontFamily: 'inherit',
}

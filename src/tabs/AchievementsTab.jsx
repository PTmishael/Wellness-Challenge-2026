import { useState } from 'react'
import ScenePage from '../components/ScenePage'
import ArticleFigure from '../components/ArticleFigure'
import PlankChallenge from '../components/PlankChallenge'
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

  /* ── Reading one article ── */
  if (article) {
    return (
      <ScenePage scene={SCENES.app}>
        <button onClick={() => setArticle(null)} style={backBtn}>← رجوع</button>
        <h2 className="scene-title" style={{ fontSize: 19, marginTop: 16, lineHeight: 1.5 }}>
          {article.q}
        </h2>

        {article.video && <VideoButton href={article.video} label={article.videoLabel} />}

        {article.figure && (
          <div style={{ marginTop: 14 }}>
            <ArticleFigure id={article.figure} />
          </div>
        )}

        <div className="scene-card" style={{ marginTop: article.figure ? 0 : 14 }}>
          <div
            style={{
              color: 'var(--ink-scene-sub)',
              fontSize: 14,
              lineHeight: 2,
              whiteSpace: 'pre-wrap',
              fontWeight: 600,
            }}
          >
            {article.body || article.placeholder}
          </div>
        </div>
      </ScenePage>
    )
  }

  /* ── Browsing one library ── */
  if (openId) {
    const lib = UNLOCKS.find((u) => u.id === openId)
    return (
      <ScenePage scene={SCENES.app}>
        <button onClick={() => setOpenId(null)} style={backBtn}>← رجوع</button>
        <h2 className="scene-title" style={{ fontSize: 20, marginTop: 16 }}>{lib.title}</h2>
        <p className="scene-sub" style={{ fontSize: 12, marginTop: 4, lineHeight: 1.7 }}>{lib.subtitle}</p>

        {/* library-level video sits at the very top */}
        {lib.video && <VideoButton href={lib.video} label={lib.videoLabel} />}

        {/* the plank challenge lives inside its unlock */}
        {lib.challenge === 'plank' && (
          <div style={{ marginTop: 16 }}>
            <PlankChallenge member={member} />
          </div>
        )}

        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 9 }}>
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
              <span style={{ color: 'var(--ink-scene)', fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>
                {a.q}
              </span>
              <span style={{ color: 'var(--brand-deep)', fontSize: 15 }}>←</span>
            </button>
          ))}
        </div>
      </ScenePage>
    )
  }

  /* ── The unlock list, with a teaser under each ── */
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
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg,#5C9463,#1E3D21)',
                borderRadius: 20,
              }}
            />
          </div>
        </div>
      )}

      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {UNLOCKS.map((u) => {
          const open = unlocked.has(u.id)
          const teaser = u.articles.slice(0, 2)

          return (
            <button
              key={u.id}
              onClick={() => open && setOpenId(u.id)}
              disabled={!open}
              style={{
                background: open ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.5)',
                border: `1.5px solid ${open ? 'rgba(30,61,33,0.3)' : 'rgba(30,61,33,0.12)'}`,
                borderRadius: 15,
                padding: 13,
                cursor: open ? 'pointer' : 'default',
                opacity: open ? 1 : 0.75,
                fontFamily: 'inherit',
                textAlign: 'right',
                display: 'block',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 11,
                    flexShrink: 0,
                    background: open ? 'rgba(30,61,33,0.12)' : 'rgba(30,61,33,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 17,
                  }}
                >
                  {open ? '🔓' : '🔒'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--ink-scene)', fontSize: 13.5, fontWeight: 800 }}>{u.title}</div>
                  <div style={{ color: 'var(--ink-scene-sub)', fontSize: 10.5, marginTop: 2 }}>
                    {open ? 'مفتوحة — اضغطي للقراءة' : `تفتح عند ${arabicDigits(u.threshold)} نقطة`}
                  </div>
                </div>
                <span style={{ color: open ? 'var(--brand-deep)' : 'rgba(30,61,33,0.35)', fontSize: 16 }}>←</span>
              </div>

              {/* teaser — a glimpse of what's inside */}
              <div
                style={{
                  marginTop: 9,
                  paddingTop: 9,
                  borderTop: '1px dashed rgba(30,61,33,0.18)',
                  color: 'var(--ink-scene-sub)',
                  fontSize: 10.5,
                  lineHeight: 1.9,
                  fontWeight: 600,
                }}
              >
                {teaser.map((a, i) => (
                  <div key={i}>• {a.q}</div>
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </ScenePage>
  )
}

/** Opens YouTube in a new tab — embedding is blocked on many videos. */
function VideoButton({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 14,
        background: 'var(--brand-deep)',
        color: 'var(--cream)',
        borderRadius: 14,
        padding: 13,
        fontSize: 13.5,
        fontWeight: 800,
        textDecoration: 'none',
      }}
    >
      ▶︎ {label ?? 'شاهدي الفيديو'}
    </a>
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
  alignSelf: 'flex-start',
}

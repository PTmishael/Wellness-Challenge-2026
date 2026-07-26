import { useState } from 'react'
import { PILLARS, OPTION_POINTS, CHALLENGE_DAYS } from '../constants'
import { arabicDigits, challengeDay, funFactFor } from '../lib/utils'

export default function CheckInFlow({ onComplete, onCancel }) {
  const [index, setIndex] = useState(0)
  const [picks, setPicks] = useState({}) // { pillarId: 'one' | 'two' }
  const [dir, setDir] = useState('next') // wipe direction: 'next' | 'prev'
  const [done, setDone] = useState(false) // celebration screen after submit

  function goTo(target) {
    setDir(target > index ? 'next' : 'prev')
    setIndex(Math.max(0, Math.min(target, PILLARS.length - 1)))
  }

  const pillar = PILLARS[index]
  const isLast = index === PILLARS.length - 1
  const day = challengeDay()
  const doneCount = Object.keys(picks).length
  const totalPoints = Object.values(picks).reduce((s, opt) => s + OPTION_POINTS[opt], 0)

  function choose(option) {
    setPicks((prev) => {
      const next = { ...prev }
      if (next[pillar.id] === option) delete next[pillar.id]
      else next[pillar.id] = option
      return next
    })
    // gentle auto-advance after picking
    if (!isLast) setTimeout(() => goTo(index + 1), 380)
  }

  function submit() {
    setDone(true)
    const log = Object.fromEntries(
      Object.entries(picks).map(([id, opt]) => [id, OPTION_POINTS[opt]])
    )
    // Let the celebration show for a moment before returning home.
    setTimeout(() => onComplete(log, totalPoints), 2400)
  }

  const selected = picks[pillar.id]

  // ── Celebration after submitting ──
  if (done) {
    return (
      <div
        className="fullscreen checkin-celebrate"
        style={{ background: 'linear-gradient(172deg,#B3B992 0%,#849072 45%,#505E44 100%)' }}
      >
        <div className="fullscreen__inner" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div className="celebrate-ring">
            <div style={{ color: '#FCF8F0', fontSize: 40, fontWeight: 800 }}>
              +{arabicDigits(totalPoints)}
            </div>
          </div>
          <h2 style={{ color: '#FCF8F0', fontSize: 23, fontWeight: 800, marginTop: 22 }}>
            أحسنتِ يا بطلة 🌿
          </h2>
          <p style={{ color: '#F3ECE0', fontSize: 15, lineHeight: 1.9, marginTop: 10, maxWidth: 260 }}>
            سجّلتِ إنجازات اليوم! روحي لصفحة <b>سواليف</b> وشوفي كيف سوّوا باقي البنات وشجّعوا بعض 💬
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fullscreen" style={{ background: `linear-gradient(172deg, ${pillar.grad[0]} 0%, ${pillar.grad[1]} 45%, ${pillar.grad[2]} 100%)` }}>
      <svg className="fullscreen__ripple" viewBox="0 0 400 220" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-20 150 q90 -28 180 -6 q100 24 200 -14" stroke="#F3ECE0" strokeWidth="1.6" fill="none" opacity="0.45" strokeLinecap="round" />
      </svg>

      <div
        key={pillar.id}
        className={`fullscreen__inner checkin-page checkin-page--${dir}`}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {/* top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={onCancel}
            style={{ background: 'none', border: 'none', color: '#F3ECE0', fontSize: 20, cursor: 'pointer', padding: 4 }}
            aria-label="رجوع"
          >
            ✕
          </button>
          <span style={{ color: '#EDE6D8', fontSize: 12 }}>
            اليوم {arabicDigits(day)} من {arabicDigits(CHALLENGE_DAYS)}
          </span>
          <span style={{ color: '#EDE6D8', fontSize: 11.5 }}>
            {arabicDigits(doneCount)}/{arabicDigits(PILLARS.length)}
          </span>
        </div>

        {/* circular badge */}
        <div style={{ textAlign: 'center', marginTop: 26 }}>
          <div
            style={{
              width: 138,
              height: 138,
              margin: '0 auto',
              borderRadius: '50%',
              background: selected ? 'rgba(255,255,255,0.24)' : 'rgba(255,255,255,0.16)',
              border: `2px solid ${selected ? '#FFFFFF' : 'rgba(255,255,255,0.5)'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ color: '#FFFFFF', fontSize: 27, fontWeight: 800 }}>{pillar.name}</div>
            {selected ? (
              <div style={{ color: '#FBF6EC', fontSize: 13, marginTop: 4, fontWeight: 700 }}>
                +{arabicDigits(OPTION_POINTS[selected])} {OPTION_POINTS[selected] === 1 ? 'نقطة' : 'نقاط'} ✓
              </div>
            ) : (
              <div style={{ color: '#F3ECE0', fontSize: 12, marginTop: 4 }}>اختاري مستواك</div>
            )}
          </div>
          {pillar.note && (
            <div style={{ color: '#EDE6D8', fontSize: 11.5, marginTop: 12, lineHeight: 1.75, padding: '0 6px' }}>
              {pillar.note}
            </div>
          )}
        </div>

        {/* fun fact — right under the pillar */}
        <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.16)', borderRadius: 16, padding: '13px 16px' }}>
          <div style={{ color: '#FBF6EC', fontSize: 10.5, fontWeight: 800, marginBottom: 5 }}>💡 معلومة اليوم</div>
          <div style={{ color: '#FCF8F0', fontSize: 12.5, lineHeight: 1.8 }}>{funFactFor(pillar.id)}</div>
        </div>

        {/* two options */}
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 11 }}>
          <OptionButton label={pillar.options.one} points={1} active={selected === 'one'} onClick={() => choose('one')} />
          <OptionButton label={pillar.options.two} points={2} active={selected === 'two'} onClick={() => choose('two')} gold />
        </div>

        {/* nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }}>
          {index > 0 && (
            <button
              onClick={() => goTo(index - 1)}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--deep-text)', borderRadius: 14, padding: '12px 18px', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              السابق
            </button>
          )}
          {isLast ? (
            <button
              onClick={submit}
              disabled={doneCount === 0}
              style={{
                flex: 1,
                background: doneCount === 0 ? 'rgba(255,255,255,0.12)' : '#F2F7F4',
                color: doneCount === 0 ? 'var(--deep-sub)' : '#16241F',
                border: 'none',
                borderRadius: 14,
                padding: 14,
                fontSize: 15,
                fontWeight: 800,
                cursor: doneCount === 0 ? 'default' : 'pointer',
                fontFamily: 'inherit',
              }}
            >
              احفظ إنجازات اليوم ✅ {totalPoints > 0 && `· +${arabicDigits(totalPoints)}`}
            </button>
          ) : (
            <button
              onClick={() => goTo(index + 1)}
              style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--deep-text)', borderRadius: 14, padding: 14, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              التالي ←
            </button>
          )}
        </div>

        {/* dots */}
        <div style={{ display: 'flex', gap: 7, justifyContent: 'center', marginTop: 14 }}>
          {PILLARS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => goTo(i)}
              aria-label={p.name}
              style={{
                width: i === index ? 22 : 8,
                height: 8,
                borderRadius: 20,
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                background: i === index ? '#9BD3AC' : picks[p.id] ? '#4E7862' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.25s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function OptionButton({ label, points, active, onClick, gold = false }) {
  const accent = gold ? '#F5D76E' : '#9BD3AC'
  const tintBg = gold ? 'rgba(245,215,110,0.14)' : 'rgba(155,211,172,0.16)'
  const badgeText = gold ? '#3A2E08' : '#14261B'

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        border: `2px solid ${active ? accent : 'rgba(255,255,255,0.16)'}`,
        background: active ? tintBg : 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: '14px 15px',
        cursor: 'pointer',
        fontFamily: 'inherit',
        textAlign: 'right',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        transition: 'all 0.18s ease',
      }}
    >
      <span style={{ color: 'var(--deep-text)', fontSize: 13.5, fontWeight: 600, lineHeight: 1.5 }}>{label}</span>
      <span
        style={{
          background: active ? accent : 'rgba(255,255,255,0.12)',
          color: active ? badgeText : '#CFE3D8',
          fontSize: 12,
          fontWeight: 800,
          padding: '4px 11px',
          borderRadius: 12,
          whiteSpace: 'nowrap',
        }}
      >
        +{points === 1 ? '١ نقطة' : '٢ نقاط'}
      </span>
    </button>
  )
}

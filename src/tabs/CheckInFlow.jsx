import { useState } from 'react'
import ScenePage from '../components/ScenePage'
import { PILLARS, OPTION_POINTS, CHALLENGE_DAYS, SCENES } from '../constants'
import { arabicDigits, challengeDay, funFactFor } from '../lib/utils'

export default function CheckInFlow({ onComplete, onCancel }) {
  const [index, setIndex] = useState(0)
  const [picks, setPicks] = useState({}) // { pillarId: 'one' | 'two' }
  const [dir, setDir] = useState('next')
  const [done, setDone] = useState(false)

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
    if (!isLast) setTimeout(() => goTo(index + 1), 380)
  }

  function submit() {
    setDone(true)
    const log = Object.fromEntries(Object.entries(picks).map(([id, opt]) => [id, OPTION_POINTS[opt]]))
    setTimeout(() => onComplete(log, totalPoints), 2400)
  }

  const selected = picks[pillar.id]

  // ── Celebration after submitting ──
  if (done) {
    return (
      <ScenePage scene={SCENES.pillar}>
        <div style={{ margin: 'auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="celebrate-ring">
            <div style={{ color: 'var(--brand-deep)', fontSize: 44, fontWeight: 800, lineHeight: 1 }}>
              +{arabicDigits(totalPoints)}
            </div>
            <div style={{ color: 'var(--ink-scene-sub)', fontSize: 12, fontWeight: 700, marginTop: 4 }}>
              نقطة اليوم
            </div>
          </div>
          <h2 className="scene-title" style={{ fontSize: 22, marginTop: 26 }}>أحسنتِ يا بطلة 🌿</h2>
          <p className="scene-sub" style={{ fontSize: 14, lineHeight: 1.9, marginTop: 10, maxWidth: 270 }}>
            سجّلتِ إنجازات اليوم! روحي لصفحة <b>سواليف</b> وشوفي كيف سوّوا باقي البنات وشجّعوا بعض 💬
          </p>
        </div>
      </ScenePage>
    )
  }

  return (
    <ScenePage scene={SCENES.pillar} key={pillar.id} className={`checkin-page checkin-page--${dir}`}>
      {/* top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onCancel}
          className="scene-title"
          style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', padding: 4 }}
          aria-label="رجوع"
        >
          ✕
        </button>
        <span className="scene-sub" style={{ fontSize: 12.5, fontWeight: 800 }}>
          اليوم {arabicDigits(day)} من {arabicDigits(CHALLENGE_DAYS)}
        </span>
        <span className="scene-sub" style={{ fontSize: 12, fontWeight: 800 }}>
          {arabicDigits(doneCount)}/{arabicDigits(PILLARS.length)}
        </span>
      </div>

      {/* circular badge */}
      <div style={{ textAlign: 'center', marginTop: 22 }}>
        <div
          style={{
            width: 132,
            height: 132,
            margin: '0 auto',
            borderRadius: '50%',
            background: selected ? 'rgba(30,61,33,0.85)' : 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(6px)',
            border: `2px solid ${selected ? 'var(--brand-deep)' : 'rgba(30,61,33,0.35)'}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ color: selected ? 'var(--cream)' : 'var(--ink-scene)', fontSize: 24, fontWeight: 800 }}>
            {pillar.name}
          </div>
          {selected ? (
            <div style={{ color: '#D9E9DB', fontSize: 12, marginTop: 4, fontWeight: 700 }}>
              +{arabicDigits(OPTION_POINTS[selected])} {OPTION_POINTS[selected] === 1 ? 'نقطة' : 'نقاط'} ✓
            </div>
          ) : (
            <div style={{ color: 'var(--ink-scene-sub)', fontSize: 11.5, marginTop: 4 }}>اختاري مستواك</div>
          )}
        </div>
        {pillar.note && (
          <div className="scene-sub" style={{ fontSize: 11, marginTop: 11, lineHeight: 1.75, padding: '0 6px' }}>
            {pillar.note}
          </div>
        )}
      </div>

      {/* fun fact — right under the pillar */}
      <div className="scene-card" style={{ marginTop: 14 }}>
        <div style={{ color: 'var(--brand-deep)', fontSize: 10, fontWeight: 800, marginBottom: 4 }}>
          💡 معلومة اليوم
        </div>
        <div style={{ color: 'var(--ink-scene-sub)', fontSize: 11.5, lineHeight: 1.75, fontWeight: 600 }}>
          {funFactFor(pillar.id)}
        </div>
      </div>

      {/* two options */}
      <div style={{ marginTop: 13, display: 'flex', flexDirection: 'column', gap: 9 }}>
        <OptionButton label={pillar.options.one} points={1} active={selected === 'one'} onClick={() => choose('one')} />
        <OptionButton label={pillar.options.two} points={2} active={selected === 'two'} onClick={() => choose('two')} />
      </div>

      {/* nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto', paddingTop: 16 }}>
        {index > 0 && (
          <button
            onClick={() => goTo(index - 1)}
            className="btn--scene-ghost"
            style={{
              borderRadius: 14,
              padding: '13px 18px',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'inherit',
              margin: 0,
            }}
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
              background: doneCount === 0 ? 'rgba(30,61,33,0.25)' : 'var(--brand-deep)',
              color: 'var(--cream)',
              border: 'none',
              borderRadius: 14,
              padding: 14,
              fontSize: 14.5,
              fontWeight: 900,
              cursor: doneCount === 0 ? 'default' : 'pointer',
              fontFamily: 'inherit',
              boxShadow: doneCount === 0 ? 'none' : '0 6px 18px rgba(30,61,33,0.3)',
            }}
          >
            احفظ إنجازات اليوم ✅ {totalPoints > 0 && `· +${arabicDigits(totalPoints)}`}
          </button>
        ) : (
          <button
            onClick={() => goTo(index + 1)}
            style={{
              flex: 1,
              background: 'var(--brand-deep)',
              border: 'none',
              color: 'var(--cream)',
              borderRadius: 14,
              padding: 14,
              fontSize: 14.5,
              fontWeight: 900,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 6px 18px rgba(30,61,33,0.3)',
            }}
          >
            التالي ←
          </button>
        )}
      </div>

      {/* dots */}
      <div style={{ display: 'flex', gap: 7, justifyContent: 'center', marginTop: 13 }}>
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
              background:
                i === index ? 'var(--brand-deep)' : picks[p.id] ? 'rgba(30,61,33,0.55)' : 'rgba(30,61,33,0.22)',
              transition: 'all 0.25s ease',
            }}
          />
        ))}
      </div>
    </ScenePage>
  )
}

function OptionButton({ label, points, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        border: active ? '2px solid var(--brand-deep)' : '1.5px solid rgba(30,61,33,0.22)',
        background: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.68)',
        backdropFilter: 'blur(6px)',
        borderRadius: 15,
        padding: '13px 14px',
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
      <span style={{ color: 'var(--ink-scene)', fontSize: 13, fontWeight: active ? 800 : 600, lineHeight: 1.5 }}>
        {label}
      </span>
      <span
        style={{
          background: active ? 'var(--brand-deep)' : 'rgba(30,61,33,0.14)',
          color: active ? 'var(--cream)' : 'var(--brand-deep)',
          fontSize: 11.5,
          fontWeight: 800,
          padding: '4px 10px',
          borderRadius: 12,
          whiteSpace: 'nowrap',
        }}
      >
        +{points === 1 ? '١ نقطة' : '٢ نقاط'}
      </span>
    </button>
  )
}

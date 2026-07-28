import { useState } from 'react'
import OmbrePage from '../components/OmbrePage'
import { PILLARS, OPTION_POINTS, CHALLENGE_DAYS, APP_OMBRE } from '../constants'
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
      <OmbrePage ombre={APP_OMBRE} className="checkin-celebrate">
        <div style={{ margin: 'auto', textAlign: 'center' }}>
          <div className="celebrate-ring">
            <div className="ombre-title--light" style={{ fontSize: 36 }}>
              +{arabicDigits(totalPoints)}
            </div>
          </div>
          <h2 className="ombre-title--light" style={{ fontSize: 21, marginTop: 20 }}>
            أحسنتِ يا بطلة 🌿
          </h2>
          <p className="ombre-sub--light" style={{ fontSize: 14, lineHeight: 1.9, marginTop: 10, maxWidth: 260, marginInline: 'auto' }}>
            سجّلتِ إنجازات اليوم! روحي لصفحة <b>سواليف</b> وشوفي كيف سوّوا باقي البنات وشجّعوا بعض 💬
          </p>
        </div>
      </OmbrePage>
    )
  }

  return (
    <OmbrePage ombre={pillar.ombre} wave={pillar.wave} key={pillar.id} className={`checkin-page checkin-page--${dir}`}>
      {/* top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onCancel}
          style={{ background: 'none', border: 'none', color: '#FFFDF7', fontSize: 20, cursor: 'pointer', padding: 4 }}
          aria-label="رجوع"
        >
          ✕
        </button>
        <span style={{ color: '#FFFDF7', fontSize: 12, fontWeight: 700 }}>
          اليوم {arabicDigits(day)} من {arabicDigits(CHALLENGE_DAYS)}
        </span>
        <span style={{ color: '#FFFDF7', fontSize: 11.5, fontWeight: 700 }}>
          {arabicDigits(doneCount)}/{arabicDigits(PILLARS.length)}
        </span>
      </div>

      {/* circular badge */}
      <div style={{ textAlign: 'center', marginTop: 22 }}>
        <div
          style={{
            width: 134,
            height: 134,
            margin: '0 auto',
            borderRadius: '50%',
            background: selected ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.18)',
            border: `2px solid ${selected ? '#FFFDF7' : 'rgba(255,255,255,0.5)'}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ color: '#FFFDF7', fontSize: 25, fontWeight: 800 }}>{pillar.name}</div>
          {selected ? (
            <div style={{ color: '#FFFDF7', fontSize: 12, marginTop: 4, fontWeight: 700 }}>
              +{arabicDigits(OPTION_POINTS[selected])} {OPTION_POINTS[selected] === 1 ? 'نقطة' : 'نقاط'} ✓
            </div>
          ) : (
            <div style={{ color: '#F3EFE2', fontSize: 11.5, marginTop: 4 }}>اختاري مستواك</div>
          )}
        </div>
        {pillar.note && (
          <div style={{ color: '#FFFDF0', fontSize: 11, marginTop: 11, lineHeight: 1.75, padding: '0 6px' }}>
            {pillar.note}
          </div>
        )}
      </div>

      {/* fun fact — right under the pillar */}
      <div style={{ marginTop: 14, background: 'rgba(255,255,255,0.16)', borderRadius: 14, padding: '11px 14px' }}>
        <div style={{ color: '#FFFDF0', fontSize: 10, fontWeight: 800, marginBottom: 4 }}>💡 معلومة اليوم</div>
        <div style={{ color: '#FFFDF7', fontSize: 11.5, lineHeight: 1.75 }}>{funFactFor(pillar.id)}</div>
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
            style={{
              background: 'rgba(255,255,255,0.14)',
              border: 'none',
              color: '#FFFDF7',
              borderRadius: 13,
              padding: '12px 16px',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'inherit',
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
              background: doneCount === 0 ? 'rgba(255,255,255,0.14)' : '#FFFDF7',
              color: doneCount === 0 ? 'rgba(255,255,255,0.6)' : 'var(--ink-on-ombre)',
              border: 'none',
              borderRadius: 13,
              padding: 13,
              fontSize: 14,
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
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.14)',
              border: 'none',
              color: '#FFFDF7',
              borderRadius: 13,
              padding: 13,
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'inherit',
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
              background: i === index ? '#FFFDF7' : picks[p.id] ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)',
              transition: 'all 0.25s ease',
            }}
          />
        ))}
      </div>
    </OmbrePage>
  )
}

function OptionButton({ label, points, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        border: active ? 'none' : '1.5px solid rgba(255,255,255,0.3)',
        background: active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.13)',
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
      <span style={{ color: active ? 'var(--ink-on-ombre)' : '#FFFDF7', fontSize: 13, fontWeight: active ? 700 : 600, lineHeight: 1.5 }}>
        {label}
      </span>
      <span
        style={{
          background: active ? 'var(--ink-on-ombre)' : 'rgba(255,255,255,0.22)',
          color: '#FFFDF7',
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

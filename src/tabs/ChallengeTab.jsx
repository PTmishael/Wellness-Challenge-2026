import { Hero, Sheet } from '../components/Hero'
import {
  PILLARS,
  TIER_POINTS,
  TIER_ORDER,
  TIER_LABELS,
  TIER_EMOJI,
  MEDALS,
  DAILY_QUOTE,
  CHALLENGE_DAYS,
} from '../constants'
import { arabicDigits, challengeDay } from '../lib/utils'

const RING_CIRCUMFERENCE = 2 * Math.PI * 48 // r = 48

export default function ChallengeTab({
  member,
  isAdmin,
  todayLog,
  checkedIn,
  onToggleTier,
  onSubmit,
  onSignOut,
}) {
  const dayPoints = Object.values(todayLog).reduce(
    (sum, tier) => sum + (TIER_POINTS[tier] ?? 0),
    0
  )
  const hasSelection = Object.keys(todayLog).length > 0
  const locked = checkedIn && !isAdmin
  const history = member.history ?? []
  const day = challengeDay()
  const perfect = dayPoints === 15

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--sheet)', paddingBottom: 84 }}>
      <Hero>
        {/* Day counter + streak */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 18,
          }}
        >
          <span className="day-chip">
            <span className="day-chip__dot" />
            اليوم {arabicDigits(day)} من {arabicDigits(CHALLENGE_DAYS)}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="day-chip">{arabicDigits(member.streak)} أيام متتالية</span>
            <button className="topbar__signout" onClick={onSignOut}>خروج</button>
          </div>
        </div>

        {/* Progress ring */}
        <div style={{ textAlign: 'center', paddingBottom: 66 }}>
          <div className="ring-wrap">
            <svg width="116" height="116" viewBox="0 0 116 116">
              <circle className="ring-track" cx="58" cy="58" r="48" fill="none" strokeWidth="9" />
              <circle
                className={`ring-fill${perfect ? ' ring-fill--full' : ''}`}
                cx="58"
                cy="58"
                r="48"
                fill="none"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * dayPoints) / 15}
              />
            </svg>
            <div className="ring-center">
              <div style={{ color: 'var(--deep-text)', fontSize: 32, fontWeight: 800, lineHeight: 1 }}>
                {arabicDigits(dayPoints)}
              </div>
              <div style={{ color: 'var(--deep-sub)', fontSize: 11.5, fontWeight: 700, marginTop: 3 }}>
                من ١٥ نقطة
              </div>
            </div>
          </div>

          <div style={{ color: 'var(--deep-text)', fontSize: 17, fontWeight: 800, marginTop: 14 }}>
            {member.name}
          </div>
          <div style={{ color: 'var(--deep-sub)', fontSize: 12.5, fontWeight: 700, marginTop: 3 }}>
            {arabicDigits(member.points)} نقطة · {arabicDigits(member.medals.length)} ميدالية
          </div>
        </div>
      </Hero>

      <Sheet>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 7,
          }}
        >
          <h3 style={{ fontSize: 20, fontWeight: 900 }}>متابعة اليومية</h3>
          {checkedIn && !isAdmin && <span className="pill pill--green">✅ تمّ اليوم</span>}
          {isAdmin && <span className="pill pill--solid">👑 أدمن</span>}
        </div>

        <p
          style={{
            color: 'var(--ink-mute)',
            fontSize: 15,
            lineHeight: 1.8,
            fontStyle: 'italic',
            borderRight: '3px solid var(--brand)',
            paddingRight: 10,
            marginBottom: 20,
            fontWeight: 600,
          }}
        >
          {DAILY_QUOTE}
        </p>

        {PILLARS.map((pillar) => (
          <div key={pillar.id} style={{ marginBottom: 18 }}>
            <div style={{ marginBottom: 9 }}>
              <span style={{ fontSize: 17, fontWeight: 900 }}>{pillar.name}</span>
            </div>

            {pillar.note && (
              <p
                style={{
                  color: 'var(--ink-sub)',
                  fontSize: 13.5,
                  fontWeight: 700,
                  lineHeight: 1.8,
                  background: 'var(--brand-tint)',
                  border: '1.5px solid #BBCFBD',
                  borderRadius: 12,
                  padding: '8px 12px',
                  marginBottom: 9,
                }}
              >
                {pillar.note}
              </p>
            )}

            <div className="tier-row">
              {TIER_ORDER.map((tier) => {
                const selected = todayLog[pillar.id] === tier
                return (
                  <button
                    key={tier}
                    className={`tier${selected ? ` is-${tier}` : ''}`}
                    disabled={locked}
                    onClick={() => onToggleTier(pillar.id, tier)}
                  >
                    {TIER_EMOJI[tier]}
                    <br />
                    {TIER_LABELS[tier]}
                    <div className="tier__hint">{pillar.tiers[tier]}</div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {locked ? (
          <div
            style={{
              background: 'linear-gradient(135deg, var(--brand-tint), var(--brand-tint-2))',
              borderRadius: 16,
              padding: 20,
              textAlign: 'center',
              border: '2px solid #B5CDB8',
              marginTop: 8,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 6 }}>🌟</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--brand-dark)' }}>
              ما شاء الله! اليوم خلص
            </div>
            <div style={{ color: 'var(--ink-sub)', fontSize: 12, marginTop: 4, fontWeight: 600 }}>
              تعالي بكرة للمتابعة الجديدة 💪
            </div>
          </div>
        ) : (
          <button className="btn btn--deep" style={{ fontSize: 16 }} onClick={onSubmit} disabled={!hasSelection}>
            احفظ إنجازات اليوم ✅
            {dayPoints > 0 && ` · +${arabicDigits(dayPoints)} نقاط`}
          </button>
        )}

        {history.length > 0 && (
          <div style={{ marginTop: 22 }}>
            <p className="section-label">سجل أيامك</p>
            {[...history]
              .reverse()
              .slice(0, 7)
              .map((entry, i, arr) => {
                const tone =
                  entry.points >= 12 ? 'pill--green' : entry.points >= 8 ? 'pill--amber' : 'pill--gray'
                return (
                  <div
                    key={`${entry.date}-${i}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '11px 0',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span style={{ color: 'var(--ink-mute)', fontSize: 12, fontWeight: 700 }}>
                        {entry.date}
                      </span>
                      <span style={{ color: 'var(--ink-sub)', fontSize: 12, fontWeight: 700 }}>
                        {arabicDigits(Object.keys(entry.log ?? {}).length)}/٥ أعمدة
                      </span>
                    </div>
                    <span className={`pill ${tone}`}>+{arabicDigits(entry.points)} نقاط</span>
                  </div>
                )
              })}
          </div>
        )}

        {member.medals.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 7,
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 20,
            }}
          >
            {MEDALS.map((medal) => {
              const earned = member.medals.includes(medal.id)
              return (
                <span
                  key={medal.id}
                  title={medal.name}
                  style={{
                    fontSize: 21,
                    opacity: earned ? 1 : 0.18,
                    filter: earned ? 'none' : 'grayscale(1)',
                  }}
                >
                  {medal.icon}
                </span>
              )
            })}
          </div>
        )}
      </Sheet>
    </div>
  )
}

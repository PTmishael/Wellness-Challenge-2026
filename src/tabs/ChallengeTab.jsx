import Avatar from '../components/Avatar'
import {
  PILLARS,
  TIER_POINTS,
  TIER_ORDER,
  TIER_LABELS,
  TIER_EMOJI,
  MEDALS,
  DAILY_QUOTE,
} from '../constants'

export default function ChallengeTab({
  member,
  isAdmin,
  todayLog,
  checkedIn,
  onToggleTier,
  onSubmit,
}) {
  const pendingPoints = Object.values(todayLog).reduce(
    (sum, tier) => sum + (TIER_POINTS[tier] ?? 0),
    0
  )
  const hasSelection = Object.keys(todayLog).length > 0
  const locked = checkedIn && !isAdmin
  const history = member.history ?? []

  return (
    <div className="tab-body">
      {/* ── Profile card ─────────────────────────────── */}
      <div className="card card--brand" style={{ padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar
            skinIndex={member.skinIndex}
            colorIndex={member.colorIndex}
            size={58}
            style={{ border: '3px solid rgba(255,255,255,.45)' }}
          />
          <div>
            <div style={{ fontSize: 19, fontWeight: 900, color: '#fff' }}>{member.name}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 7, flexWrap: 'wrap' }}>
              <span className="pill pill--ghost">⚡ {member.points} نقطة</span>
              <span className="pill pill--sun">🔥 {member.streak} يوم</span>
            </div>
          </div>
        </div>

        {member.medals.length > 0 && (
          <div style={{ display: 'flex', gap: 7, marginTop: 15, flexWrap: 'wrap' }}>
            {MEDALS.map((medal) => {
              const earned = member.medals.includes(medal.id)
              return (
                <span
                  key={medal.id}
                  title={medal.name}
                  style={{
                    fontSize: 20,
                    opacity: earned ? 1 : 0.2,
                    filter: earned ? 'none' : 'grayscale(1)',
                  }}
                >
                  {medal.icon}
                </span>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Daily check-in ───────────────────────────── */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
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
            marginBottom: 17,
            fontWeight: 600,
          }}
        >
          {DAILY_QUOTE}
        </p>

        {PILLARS.map((pillar) => (
          <div key={pillar.id} style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9 }}>
              <span style={{ fontSize: 21 }}>{pillar.icon}</span>
              <span style={{ fontSize: 17, fontWeight: 900 }}>{pillar.name}</span>
            </div>

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
          <button className="btn btn--brand" onClick={onSubmit} disabled={!hasSelection}>
            ✅ سجّلي متابعتك اليومية
            {pendingPoints > 0 && ` · +${pendingPoints} نقاط`}
          </button>
        )}
      </div>

      {/* ── History ──────────────────────────────────── */}
      {history.length > 0 && (
        <div className="card">
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
                    <div style={{ display: 'flex', gap: 3 }}>
                      {Object.keys(entry.log ?? {}).map((pillarId) => {
                        const pillar = PILLARS.find((p) => p.id === pillarId)
                        return pillar ? (
                          <span key={pillarId} style={{ fontSize: 14 }}>
                            {pillar.icon}
                          </span>
                        ) : null
                      })}
                    </div>
                  </div>
                  <span className={`pill ${tone}`}>+{entry.points} نقاط</span>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}

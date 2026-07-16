import Avatar from '../components/Avatar'
import { MEDALS } from '../constants'

const STAT_STYLES = [
  { bg: '#E8F0E9', border: '#BBCFBD', text: '#1E3D21' },
  { bg: '#FFF2DF', border: '#FBD9A5', text: '#B45309' },
  { bg: '#E3F5FE', border: '#B5E5FB', text: '#0369A1' },
  { bg: '#F1EBFE', border: '#DDD0FB', text: '#6D3FD6' },
]

export default function MedalsTab({ member }) {
  const earned = MEDALS.filter((m) => member.medals.includes(m.id))
  const locked = MEDALS.filter((m) => !member.medals.includes(m.id))
  const percent = Math.round((member.medals.length / MEDALS.length) * 100)

  const stats = [
    [member.points, 'نقطة'],
    [member.streak, 'يوم'],
    [member.checkIns ?? 0, 'متابعة'],
    [member.medals.length, 'ميدالية'],
  ]

  return (
    <div className="tab-body">
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 17 }}>
          <Avatar skinIndex={member.skinIndex} colorIndex={member.colorIndex} size={62} />
          <div>
            <div style={{ fontSize: 19, fontWeight: 900 }}>{member.name}</div>
            <div
              style={{
                color: 'var(--ink-mute)',
                fontSize: 12,
                marginTop: 3,
                fontWeight: 600,
              }}
            >
              انضمّت {member.joinDate ?? 'مؤخراً'}
            </div>
          </div>
        </div>

        <div className="stat-grid">
          {stats.map(([value, label], i) => (
            <div
              key={label}
              className="stat"
              style={{ background: STAT_STYLES[i].bg, borderColor: STAT_STYLES[i].border }}
            >
              <div className="stat__value" style={{ color: STAT_STYLES[i].text }}>
                {value}
              </div>
              <div className="stat__label">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
          <span style={{ fontSize: 13, fontWeight: 900 }}>تقدّمك</span>
          <span style={{ color: 'var(--brand)', fontSize: 13, fontWeight: 900 }}>
            {member.medals.length} / {MEDALS.length}
          </span>
        </div>
        <div className="progress">
          <div className="progress__fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {earned.length > 0 && (
        <>
          <p className="section-label">ميداليات حصلتِ عليها ✅</p>
          {earned.map((medal) => (
            <div
              key={medal.id}
              className="card"
              style={{
                padding: '15px 17px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 9,
                background: 'linear-gradient(135deg, var(--brand-tint), #DEEADF)',
                borderColor: '#B5CDB8',
              }}
            >
              <div style={{ fontSize: 34 }}>{medal.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 900 }}>{medal.name}</div>
                <div
                  style={{
                    color: 'var(--ink-sub)',
                    fontSize: 12,
                    marginTop: 2,
                    fontWeight: 600,
                  }}
                >
                  {medal.desc}
                </div>
              </div>
              <span style={{ color: 'var(--brand)', fontSize: 21, fontWeight: 900 }}>✓</span>
            </div>
          ))}
        </>
      )}

      {locked.length > 0 && (
        <>
          <p className="section-label" style={{ marginTop: 15 }}>قريباً 🔒</p>
          {locked.map((medal) => (
            <div
              key={medal.id}
              className="card"
              style={{
                padding: '15px 17px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 9,
                opacity: 0.5,
              }}
            >
              <div style={{ fontSize: 34, filter: 'grayscale(1)' }}>{medal.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--ink-sub)', fontSize: 14, fontWeight: 900 }}>
                  {medal.name}
                </div>
                <div
                  style={{
                    color: 'var(--ink-mute)',
                    fontSize: 12,
                    marginTop: 2,
                    fontWeight: 600,
                  }}
                >
                  {medal.requirement}
                </div>
              </div>
              <span style={{ fontSize: 19 }}>🔒</span>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

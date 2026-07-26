import { useMemo, useState } from 'react'
import Avatar from '../components/Avatar'
import ConfirmDialog from '../components/ConfirmDialog'
import { MAX_MEMBERS } from '../constants'
import { unlockedIds } from '../lib/utils'

const STAT_STYLES = [
  { bg: '#E8F0E9', border: '#BBCFBD', text: '#1E3D21' },
  { bg: '#FFF2DF', border: '#FBD9A5', text: '#B45309' },
  { bg: '#E3F5FE', border: '#B5E5FB', text: '#0369A1' },
  { bg: '#FFE9E9', border: '#FCC4C4', text: '#C93A3A' },
]

function rankBadge(member, index) {
  if (member.isAdmin) return '👑'
  if (index === 1) return '🥇'
  if (index === 2) return '🥈'
  if (index === 3) return '🥉'
  return index
}

export default function MembersTab({ members, onDeleteMember }) {
  const [query, setQuery] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)

  const all = useMemo(() => Object.values(members), [members])
  const nonAdmins = all.filter((m) => !m.isAdmin)

  const used = nonAdmins.length
  const free = MAX_MEMBERS - used
  const active = nonAdmins.filter((m) => (m.checkIns ?? 0) > 0).length
  const inactive = used - active

  const filtered = useMemo(() => {
    return all
      .filter((m) => !query.trim() || m.name.includes(query.trim()))
      .sort((a, b) => {
        if (a.isAdmin) return -1
        if (b.isAdmin) return 1
        return b.points - a.points
      })
  }, [all, query])

  const stats = [
    ['👥', used, 'مسجّلة'],
    ['🆓', free, 'مقعد'],
    ['📅', active, 'نشطة'],
    ['😴', inactive, 'غير نشطة'],
  ]

  const capacityPercent = Math.round((used / MAX_MEMBERS) * 100)
  const isFull = used >= MAX_MEMBERS

  return (
    <div className="tab-body">
      {/* ── Summary stats ────────────────────────────── */}
      <div className="stat-grid" style={{ marginBottom: 14 }}>
        {stats.map(([icon, value, label], i) => (
          <div
            key={label}
            className="stat"
            style={{ background: STAT_STYLES[i].bg, borderColor: STAT_STYLES[i].border }}
          >
            <div style={{ fontSize: 19, marginBottom: 3 }}>{icon}</div>
            <div className="stat__value" style={{ color: STAT_STYLES[i].text }}>
              {value}
            </div>
            <div className="stat__label">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Capacity ─────────────────────────────────── */}
      <div className="card" style={{ padding: '15px 17px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
          <span style={{ fontSize: 13, fontWeight: 900 }}>سعة التسجيل</span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 900,
              color: isFull ? 'var(--danger)' : 'var(--brand)',
            }}
          >
            {used} / {MAX_MEMBERS}
            {isFull && ' — ممتلئ ❌'}
          </span>
        </div>
        <div className="progress">
          <div className="progress__fill" style={{ width: `${capacityPercent}%` }} />
        </div>
      </div>

      {/* ── Inactive tip ─────────────────────────────── */}
      {inactive > 0 && (
        <div
          style={{
            background: 'var(--amber-tint)',
            border: '2px solid #FBD9A5',
            borderRadius: 16,
            padding: '12px 15px',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 19 }}>💡</span>
          <span style={{ color: '#B45309', fontSize: 13, fontWeight: 800 }}>
            عندك {inactive} عضوة غير نشطة (٠ متابعات) — تقدرين تحذفينها لتوفير مقاعد
          </span>
        </div>
      )}

      {/* ── Search ───────────────────────────────────── */}
      <input
        className="input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ابحثي باسم العضوة…"
        style={{ marginBottom: 12 }}
      />

      {/* ── Member list ──────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="empty-state" style={{ padding: '32px 0' }}>
          لا توجد نتائج
        </div>
      ) : (
        filtered.map((m, i) => {
          const isInactive = !m.isAdmin && (m.checkIns ?? 0) === 0
          const borderColor = isInactive
            ? '#FBD9A5'
            : m.isAdmin
              ? 'var(--brand)'
              : 'var(--border)'

          return (
            <div
              key={m.id}
              style={{
                background: '#fff',
                borderRadius: 18,
                border: `2px solid ${borderColor}`,
                padding: 14,
                marginBottom: 9,
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                boxShadow: '0 2px 10px rgba(20,31,22,.05)',
              }}
            >
              <div
                style={{
                  width: 26,
                  textAlign: 'center',
                  color: 'var(--ink-mute)',
                  fontSize: 15,
                  fontWeight: 900,
                  flexShrink: 0,
                }}
              >
                {rankBadge(m, i)}
              </div>

              <Avatar skinIndex={m.skinIndex} colorIndex={m.colorIndex} size={42} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14, fontWeight: 900 }}>{m.name}</span>
                  {m.isAdmin && <span className="pill pill--solid">أدمن</span>}
                  {isInactive && <span className="pill pill--amber">😴 غير نشطة</span>}
                </div>
                {m.bio && (
                  <p
                    style={{
                      color: 'var(--ink-mute)',
                      fontSize: 11.5,
                      fontWeight: 600,
                      marginTop: 4,
                      lineHeight: 1.6,
                    }}
                  >
                    {m.bio}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 5, marginTop: 6, flexWrap: 'wrap' }}>
                  <span className="pill pill--gray">⚡ {m.points}</span>
                  <span className="pill pill--gray">🔥 {m.streak}</span>
                  <span className="pill pill--gray">📅 {m.checkIns ?? 0}</span>
                  <span className="pill pill--gray">🔓 {unlockedIds(m.points ?? 0).length}</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 6,
                  flexShrink: 0,
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ color: 'var(--ink-mute)', fontSize: 10, fontWeight: 700 }}>
                    انضمّت
                  </div>
                  <div style={{ color: 'var(--ink-sub)', fontSize: 11, fontWeight: 800 }}>
                    {m.joinDate ?? '—'}
                  </div>
                </div>
                {!m.isAdmin && (
                  <button
                    onClick={() => setPendingDelete(m.id)}
                    style={{
                      background: 'var(--danger-tint)',
                      border: '1.5px solid #FCC4C4',
                      borderRadius: 9,
                      padding: '5px 11px',
                      fontSize: 11,
                      fontWeight: 800,
                      color: 'var(--danger)',
                      cursor: 'pointer',
                    }}
                  >
                    🗑️ حذف
                  </button>
                )}
              </div>
            </div>
          )
        })
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="حذف الحساب؟"
        message="هذا الإجراء لا يمكن التراجع عنه"
        confirmLabel="نعم، احذفي"
        onConfirm={() => {
          onDeleteMember(pendingDelete)
          setPendingDelete(null)
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}

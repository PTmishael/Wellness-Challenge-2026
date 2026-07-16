import Logo from './Logo'
import Avatar from './Avatar'

export default function TopBar({ member, isAdmin, onSignOut }) {
  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Logo size={38} />
        <div>
          <b className="topbar__title">Wellness Challenge</b>
          <span className="topbar__sub">
            كوتش مشاعل{isAdmin && ' · 👑 أدمن'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ color: 'var(--brand)', fontSize: 13, fontWeight: 900 }}>
            ⚡ {member.points}
          </div>
          <div style={{ color: 'var(--ink-mute)', fontSize: 11, fontWeight: 700 }}>
            🔥 {member.streak} يوم
          </div>
        </div>
        <Avatar skinIndex={member.skinIndex} colorIndex={member.colorIndex} size={36} />
        <button className="topbar__signout" onClick={onSignOut}>
          خروج
        </button>
      </div>
    </header>
  )
}

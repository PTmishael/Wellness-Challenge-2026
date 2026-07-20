import Logo from './Logo'
import Avatar from './Avatar'

export default function TopBar({ member, isAdmin, onSignOut }) {
  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Logo size={30} variant="white" />
        <div>
          <b className="topbar__title">Wellness Challenge</b>
          <span className="topbar__sub">
            كوتش مشاعل{isAdmin && ' · 👑 أدمن'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <Avatar skinIndex={member.skinIndex} colorIndex={member.colorIndex} size={32} />
        <button className="topbar__signout" onClick={onSignOut}>
          خروج
        </button>
      </div>
    </header>
  )
}

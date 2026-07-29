const TABS = [
  { id: 'achievements', icon: '🏆', label: 'إنجازات' },
  { id: 'home', icon: '🏠', label: 'الرئيسية', center: true },
  { id: 'chat', icon: '💬', label: 'سواليف' },
]

export default function BottomNav({ active, onChange, dark = false }) {
  return (
    <nav className={`bottomnav bottomnav--scene${dark ? ' bottomnav--onlight' : ''}`}>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`${active === tab.id ? 'is-active' : ''}${tab.center ? ' is-center' : ''}`}
          onClick={() => onChange(tab.id)}
          aria-current={active === tab.id ? 'page' : undefined}
        >
          <span className="bottomnav__icon">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

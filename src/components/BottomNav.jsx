const BASE_TABS = [
  { id: 'challenge', icon: '🏋️', label: 'التحدي' },
  { id: 'coach',     icon: '✨', label: 'كوتشك' },
  { id: 'chat',      icon: '💬', label: 'الشات' },
  { id: 'medals',    icon: '🏅', label: 'ميداليات' },
]

const ADMIN_TAB = { id: 'members', icon: '👥', label: 'الأعضاء' }

export default function BottomNav({ active, onChange, isAdmin }) {
  const tabs = isAdmin ? [...BASE_TABS, ADMIN_TAB] : BASE_TABS

  return (
    <nav className="bottomnav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={active === tab.id ? 'is-active' : ''}
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

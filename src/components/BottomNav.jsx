/**
 * Order in the DOM is right-to-left visually (RTL):
 * we render achievements, home, chat — which places
 * achievements on the LEFT, home CENTER, chat on the RIGHT.
 */
const TABS = [
  { id: 'achievements', icon: '🏆', label: 'إنجازات' },
  { id: 'home', icon: '🏠', label: 'الرئيسية', center: true },
  { id: 'chat', icon: '💬', label: 'سواليف' },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottomnav bottomnav--dark">
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

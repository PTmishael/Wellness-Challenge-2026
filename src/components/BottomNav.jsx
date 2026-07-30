/**
 * Four sections. With an even number of items a raised centre button
 * no longer sits in the middle, so the active item gets the filled
 * circle instead — that works at any count.
 */
const TABS = [
  { id: 'games', icon: '🧩', label: 'ألعاب' },
  { id: 'achievements', icon: '🏆', label: 'إنجازات' },
  { id: 'home', icon: '🏠', label: 'الرئيسية' },
  { id: 'chat', icon: '💬', label: 'سواليف' },
]

export default function BottomNav({ active, onChange, dark = false }) {
  return (
    <nav className={`bottomnav bottomnav--scene${dark ? ' bottomnav--onlight' : ''}`}>
      {TABS.map((tab) => (
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

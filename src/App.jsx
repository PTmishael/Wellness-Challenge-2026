import { useEffect, useState } from 'react'
import Splash from './screens/Splash'
import Welcome from './screens/Welcome'
import Register from './screens/Register'
import Login from './screens/Login'
import AdminLogin from './screens/AdminLogin'
import Home from './screens/Home'
import { fetchMemberById, getSession, clearSession, isConfigured } from './lib/storage'
import { today } from './lib/utils'

const MIN_SPLASH_MS = 800
/** Never let a slow network trap the user on the splash screen. */
const BOOT_TIMEOUT_MS = 8000

/** Resolve to null if a promise takes too long, instead of hanging forever. */
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve(null), ms)),
  ])
}

export default function App() {
  const [screen, setScreen] = useState('splash')
  const [member, setMember] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [session, setSession] = useState(null)

  // Restore the session saved on this device.
  useEffect(() => {
    let cancelled = false
    const startedAt = Date.now()

    function goToWelcome() {
      const wait = Math.max(0, MIN_SPLASH_MS - (Date.now() - startedAt))
      setTimeout(() => {
        if (!cancelled) setScreen('welcome')
      }, wait)
    }

    async function boot() {
      try {
        const saved = getSession()

        if (saved?.userId && isConfigured) {
          // If the database is slow or unreachable, fall through to the
          // welcome screen rather than leaving a blank page.
          const found = await withTimeout(fetchMemberById(saved.userId), BOOT_TIMEOUT_MS)

          if (!cancelled && found) {
            const sameDay = saved.date === today()
            setMember(found)
            setIsAdmin(Boolean(found.isAdmin))
            setSession({
              todayLog: sameDay ? saved.todayLog ?? {} : {},
              checkedIn: sameDay ? Boolean(saved.checkedIn) : false,
            })
            setScreen('home')
            return
          }
        }
      } catch (error) {
        console.error('Boot failed, showing welcome screen:', error)
      }

      goToWelcome()
    }

    boot()
    return () => {
      cancelled = true
    }
  }, [])

  function handleSignedIn(nextMember, adminFlag, restored = null) {
    setMember(nextMember)
    setIsAdmin(adminFlag)
    setSession(restored ?? { todayLog: {}, checkedIn: false })
    setScreen('home')
  }

  function handleSignOut() {
    clearSession()
    setMember(null)
    setIsAdmin(false)
    setSession(null)
    setScreen('welcome')
  }

  // Missing database config — tell the truth instead of failing silently.
  if (!isConfigured) {
    return (
      <div className="app-shell">
        <div className="screen-center">
          <div style={{ fontSize: 40, marginBottom: 14 }}>🔌</div>
          <h1 style={{ fontSize: 19, fontWeight: 800, marginBottom: 10 }}>
            التطبيق غير متصل بقاعدة البيانات
          </h1>
          <p style={{ color: 'var(--ink-sub)', fontSize: 14, lineHeight: 1.9, maxWidth: 320 }}>
            تأكدي من إضافة <code>VITE_SUPABASE_URL</code> و
            <code> VITE_SUPABASE_ANON_KEY</code> في إعدادات الاستضافة، ثم أعيدي النشر.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      {screen === 'splash' && <Splash />}
      {screen === 'welcome' && <Welcome onNavigate={setScreen} />}
      {screen === 'register' && (
        <Register onSignedIn={handleSignedIn} onBack={() => setScreen('welcome')} />
      )}
      {screen === 'login' && <Login onSignedIn={handleSignedIn} onBack={() => setScreen('welcome')} />}
      {screen === 'admin' && (
        <AdminLogin onSignedIn={handleSignedIn} onBack={() => setScreen('welcome')} />
      )}
      {screen === 'home' && member && (
        <Home
          key={member.id}
          member={member}
          isAdmin={isAdmin}
          initialSession={session}
          onSignOut={handleSignOut}
        />
      )}
    </div>
  )
}

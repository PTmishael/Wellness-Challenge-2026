import { useEffect, useState } from 'react'
import Splash from './screens/Splash'
import Welcome from './screens/Welcome'
import Register from './screens/Register'
import Login from './screens/Login'
import AdminLogin from './screens/AdminLogin'
import Home from './screens/Home'
import { getMembers, getSession, clearSession } from './lib/storage'
import { today } from './lib/utils'

const SPLASH_MS = 900

export default function App() {
  const [screen, setScreen] = useState('splash')
  const [member, setMember] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [session, setSession] = useState(null)

  // Restore a previous session on first load.
  useEffect(() => {
    const saved = getSession()

    if (saved?.userId) {
      const members = getMembers()
      const found = members[saved.userId]

      if (found) {
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

    const timer = setTimeout(() => setScreen('welcome'), SPLASH_MS)
    return () => clearTimeout(timer)
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

  return (
    <>

      <div className="app-shell">
        {screen === 'splash' && <Splash />}

        {screen === 'welcome' && <Welcome onNavigate={setScreen} />}

        {screen === 'register' && (
          <Register onSignedIn={handleSignedIn} onBack={() => setScreen('welcome')} />
        )}

        {screen === 'login' && (
          <Login onSignedIn={handleSignedIn} onBack={() => setScreen('welcome')} />
        )}

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
    </>
  )
}

import { useEffect, useState } from 'react'
import { read, write } from '../lib/storage'

/**
 * A daily nudge to check in.
 *
 * Honest limits: this is a browser notification, not a real push. It only
 * fires while the app is open in a tab (or running in the background on
 * some devices). If she closes the app entirely, nothing arrives — a true
 * push notification needs a service worker plus a push service.
 *
 * It still helps the common case: the app left open on a phone all day.
 */
const HOUR_KEY = 'wellness_challenge:reminderHour'
const FIRED_KEY = 'wellness_challenge:reminderFiredOn'
const DEFAULT_HOUR = 21 // 9pm — late enough that the day is nearly done

export default function DailyReminder({ memberId, checkedIn }) {
  const [hour, setHour] = useState(() => read(`${HOUR_KEY}:${memberId}`, null))
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  )

  // Check once a minute whether it's time to nudge.
  useEffect(() => {
    if (hour === null || permission !== 'granted') return

    function maybeFire() {
      if (checkedIn) return
      const now = new Date()
      const today = now.toLocaleDateString('en-CA')
      if (read(`${FIRED_KEY}:${memberId}`, '') === today) return
      if (now.getHours() !== hour) return

      new Notification('تحدي العافية 🌿', {
        body: 'ما سجّلتِ إنجازات اليوم — دقيقة وتخلصين 💚',
      })
      write(`${FIRED_KEY}:${memberId}`, today)
    }

    maybeFire()
    const timer = setInterval(maybeFire, 60_000)
    return () => clearInterval(timer)
  }, [hour, permission, checkedIn, memberId])

  async function enable(selectedHour) {
    if (typeof Notification === 'undefined') return
    const result = await Notification.requestPermission()
    setPermission(result)
    if (result === 'granted') {
      setHour(selectedHour)
      write(`${HOUR_KEY}:${memberId}`, selectedHour)
    }
  }

  function disable() {
    setHour(null)
    write(`${HOUR_KEY}:${memberId}`, null)
  }

  if (permission === 'unsupported') return null

  return (
    <div className="scene-card" style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ fontSize: 15 }}>🔔</span>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--ink-scene)', fontSize: 12.5, fontWeight: 800 }}>
            تذكير يومي
          </div>
          <div style={{ color: 'var(--ink-scene-sub)', fontSize: 10.5, fontWeight: 600, marginTop: 1 }}>
            {hour !== null
              ? `مفعّل الساعة ${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'مساءً' : 'صباحًا'}`
              : 'يذكّرك تسجّلين إنجازك'}
          </div>
        </div>
        {hour !== null && (
          <button onClick={disable} style={smallBtn}>إيقاف</button>
        )}
      </div>

      {hour === null && (
        <div style={{ display: 'flex', gap: 7, marginTop: 10 }}>
          {[20, 21, 22].map((h) => (
            <button key={h} onClick={() => enable(h)} style={{ ...smallBtn, flex: 1 }}>
              {h - 12} م
            </button>
          ))}
        </div>
      )}

      {hour !== null && (
        <div style={{ color: 'var(--ink-scene-sub)', fontSize: 9.5, marginTop: 8, lineHeight: 1.6 }}>
          يشتغل والتطبيق مفتوح في المتصفح. للتذكير الأكيد، حطّي منبّه في جوالك 🌿
        </div>
      )}
    </div>
  )
}

const smallBtn = {
  background: 'rgba(30,61,33,0.1)',
  border: '1px solid rgba(30,61,33,0.2)',
  color: 'var(--brand-deep)',
  borderRadius: 11,
  padding: '7px 12px',
  fontSize: 11.5,
  fontWeight: 800,
  cursor: 'pointer',
  fontFamily: 'inherit',
}

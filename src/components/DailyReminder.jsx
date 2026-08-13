import { useEffect, useState } from 'react'
import { read, write } from '../lib/storage'
import { notifyPermission, requestNotifyPermission, showNotification } from '../lib/notify'

/**
 * A daily nudge to check in.
 *
 * Honest limits: this is a browser notification, not a real push. It only
 * works while the app is open, and Chrome on Android blocks it entirely
 * (it requires a service worker). When the device can't show one, the card
 * says so instead of pretending a reminder is set.
 */
const HOUR_KEY = 'wellness_challenge:reminderHour'
const FIRED_KEY = 'wellness_challenge:reminderFiredOn'

export default function DailyReminder({ memberId, checkedIn }) {
  const [hour, setHour] = useState(() => read(`${HOUR_KEY}:${memberId}`, null))
  const [permission, setPermission] = useState(() => notifyPermission())

  // Check once a minute whether it's time to nudge.
  useEffect(() => {
    if (hour === null || permission !== 'granted') return

    function maybeFire() {
      if (checkedIn) return

      const now = new Date()
      const today = now.toLocaleDateString('en-CA')
      if (read(`${FIRED_KEY}:${memberId}`, '') === today) return
      if (now.getHours() !== hour) return

      const shown = showNotification('تحدي العافية 🌿', {
        body: 'ما سجّلتِ إنجازات اليوم — دقيقة وتخلصين 💚',
      })

      // This device can't show them after all — stop and say so.
      if (!shown) {
        setPermission('unsupported')
        setHour(null)
        write(`${HOUR_KEY}:${memberId}`, null)
        return
      }

      write(`${FIRED_KEY}:${memberId}`, today)
    }

    maybeFire()
    const timer = setInterval(maybeFire, 60_000)
    return () => clearInterval(timer)
  }, [hour, permission, checkedIn, memberId])

  async function enable(selectedHour) {
    const result = await requestNotifyPermission()
    setPermission(result)
    if (result !== 'granted') return

    // Prove the device can actually show one before promising a reminder.
    const shown = showNotification('تحدي العافية 🌿', { body: 'تم تفعيل التذكير اليومي ✅' })
    if (!shown) {
      setPermission('unsupported')
      return
    }

    setHour(selectedHour)
    write(`${HOUR_KEY}:${memberId}`, selectedHour)
  }

  function disable() {
    setHour(null)
    write(`${HOUR_KEY}:${memberId}`, null)
  }

  // Phones that can't do this get an honest note instead of a dead button.
  if (permission === 'unsupported' || permission === 'denied') {
    return (
      <div className="scene-card" style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ fontSize: 15 }}>⏰</span>
          <div style={{ color: 'var(--ink-scene-sub)', fontSize: 11, fontWeight: 600, lineHeight: 1.7 }}>
            جوالك ما يدعم التذكير من المتصفح — حطّي منبّه في جوالك الساعة ٩ مساءً 🌿
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="scene-card" style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ fontSize: 15 }}>🔔</span>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--ink-scene)', fontSize: 12.5, fontWeight: 800 }}>تذكير يومي</div>
          <div style={{ color: 'var(--ink-scene-sub)', fontSize: 10.5, fontWeight: 600, marginTop: 1 }}>
            {hour !== null ? `مفعّل الساعة ${hour - 12} مساءً` : 'يذكّرك تسجّلين إنجازك'}
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

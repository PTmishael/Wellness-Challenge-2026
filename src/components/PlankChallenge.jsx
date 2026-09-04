import { useEffect, useRef, useState } from 'react'
import { fetchPlankBoard, savePlankScore } from '../lib/storage'
import { arabicDigits } from '../lib/utils'

/** Reachable tiers — the goal is a clear level, not an open race. */
const LEVELS = [
  { seconds: 30, icon: '🥉', name: 'بداية' },
  { seconds: 60, icon: '🥈', name: 'قوية' },
  { seconds: 120, icon: '🥇', name: 'بطلة' },
]

function levelFor(seconds) {
  return [...LEVELS].reverse().find((l) => seconds >= l.seconds) ?? null
}

function formatTime(total) {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${arabicDigits(m)}:${arabicDigits(String(s).padStart(2, '0'))}`
}

export default function PlankChallenge({ member }) {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [board, setBoard] = useState([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    fetchPlankBoard().then(setBoard)
  }, [])

  useEffect(() => {
    if (running) {
      timer.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    }
    return () => clearInterval(timer.current)
  }, [running])

  async function stopAndSave() {
    setRunning(false)
    if (elapsed < 5) return // ignore accidental taps
    setSaving(true)
    const row = await savePlankScore({ memberId: member.id, name: member.name, seconds: elapsed })
    if (row) {
      setSaved(true)
      setBoard(await fetchPlankBoard())
    }
    setSaving(false)
  }

  function reset() {
    setRunning(false)
    setElapsed(0)
    setSaved(false)
  }

  const level = levelFor(elapsed)
  const nextLevel = LEVELS.find((l) => elapsed < l.seconds)

  return (
    <div>
      {/* which exercise this challenge actually is */}
      <div className="scene-card" style={{ textAlign: 'center', padding: '14px 16px', marginBottom: 12 }}>
        <div style={{ color: 'var(--ink-scene-sub)', fontSize: 10.5, fontWeight: 800 }}>
          تمرين التحدي
        </div>
        <div style={{ color: 'var(--brand-deep)', fontSize: 24, fontWeight: 800, marginTop: 4 }}>
          بلانك · <span style={{ direction: 'ltr', display: 'inline-block' }}>Plank</span>
        </div>
        <div style={{ color: 'var(--ink-scene-sub)', fontSize: 11.5, fontWeight: 400, marginTop: 5, lineHeight: 1.7 }}>
          ثبّتي جسمك على المرفقين وأصابع القدم، وشوفي كم تقدرين تصمدين
        </div>
      </div>

      {/* timer */}
      <div className="scene-card" style={{ textAlign: 'center', padding: '20px 16px' }}>
        <div style={{ color: 'var(--ink-scene)', fontSize: 44, fontWeight: 800, lineHeight: 1 }}>
          {formatTime(elapsed)}
        </div>
        <div style={{ color: 'var(--ink-scene-sub)', fontSize: 11.5, fontWeight: 700, marginTop: 6 }}>
          {level ? `${level.icon} ${level.name}` : 'ابدئي وخلّي الوقت يمشي'}
          {nextLevel && ` · باقي ${arabicDigits(nextLevel.seconds - elapsed)} ثانية لـ${nextLevel.name}`}
        </div>

        <div style={{ display: 'flex', gap: 9, marginTop: 16 }}>
          {!running ? (
            <button onClick={() => setRunning(true)} style={primaryBtn}>
              {elapsed === 0 ? 'ابدئي' : 'كمّلي'}
            </button>
          ) : (
            <button onClick={stopAndSave} style={primaryBtn} disabled={saving}>
              {saving ? 'جاري الحفظ…' : 'وقّفي واحفظي'}
            </button>
          )}
          <button onClick={reset} style={ghostBtn}>صفّري</button>
        </div>

        {saved && (
          <div style={{ color: 'var(--brand-deep)', fontSize: 12, fontWeight: 800, marginTop: 12 }}>
            انحفظ وقتك! 🌿
          </div>
        )}
      </div>

      {/* levels */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {LEVELS.map((l) => (
          <div
            key={l.seconds}
            className="scene-card"
            style={{ flex: 1, textAlign: 'center', padding: '11px 6px' }}
          >
            <div style={{ fontSize: 18 }}>{l.icon}</div>
            <div style={{ color: 'var(--ink-scene)', fontSize: 11.5, fontWeight: 800, marginTop: 2 }}>{l.name}</div>
            <div style={{ color: 'var(--ink-scene-sub)', fontSize: 10, fontWeight: 700 }}>
              {l.seconds === 120 ? 'دقيقتين' : `${arabicDigits(l.seconds)} ثانية`}
            </div>
          </div>
        ))}
      </div>

      {/* form note */}
      <div className="scene-card" style={{ marginTop: 12 }}>
        <div style={{ color: 'var(--brand-deep)', fontSize: 10.5, fontWeight: 800, marginBottom: 5 }}>
          الشكل الصحيح أهم من الوقت
        </div>
        <div style={{ color: 'var(--ink-scene-sub)', fontSize: 11.5, lineHeight: 1.85, fontWeight: 400 }}>
          ظهرك مستقيم، بطنك مشدود، ورقبتك امتداد لظهرك. أول ما ينزل ظهرك أو يرتفع مؤخرتك — وقّفي.
          دقيقة بشكل صحيح أفضل من دقيقتين بظهر منحني.
          {'\n'}استشيري الطبيبة إذا عندك إصابة في الظهر أو الكتف، أو إذا كنتِ حامل.
        </div>
      </div>

      {/* leaderboard */}
      <div style={{ marginTop: 16 }}>
        <div style={{ color: 'var(--brand-deep)', fontSize: 11, fontWeight: 800, marginBottom: 8 }}>
          لوحة البطلات 🏆
        </div>
        {board.length === 0 ? (
          <div className="scene-card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--ink-scene-sub)', fontSize: 11.5, fontWeight: 700 }}>
              ما في أوقات مسجّلة بعد — كوني أول وحدة!
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {board.map((row, i) => {
              const lvl = levelFor(row.seconds)
              const isMe = row.memberId === member.id
              return (
                <div
                  key={row.id}
                  className="scene-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 13px',
                    border: isMe ? '1.5px solid var(--brand-deep)' : 'none',
                  }}
                >
                  <span style={{ color: 'var(--ink-scene-sub)', fontSize: 11, fontWeight: 800, width: 16 }}>
                    {arabicDigits(i + 1)}
                  </span>
                  <span style={{ flex: 1, color: 'var(--ink-scene)', fontSize: 12.5, fontWeight: isMe ? 800 : 700 }}>
                    {row.name}
                  </span>
                  {lvl && <span style={{ fontSize: 14 }}>{lvl.icon}</span>}
                  <span style={{ color: 'var(--brand-deep)', fontSize: 12.5, fontWeight: 800 }}>
                    {formatTime(row.seconds)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

const primaryBtn = {
  flex: 1,
  background: 'var(--brand-deep)',
  color: 'var(--cream)',
  border: 'none',
  borderRadius: 13,
  padding: 13,
  fontSize: 14,
  fontWeight: 800,
  cursor: 'pointer',
  fontFamily: 'inherit',
}
const ghostBtn = {
  background: 'rgba(255,255,255,0.7)',
  border: '1px solid rgba(30,61,33,0.2)',
  color: 'var(--ink-scene)',
  borderRadius: 13,
  padding: '13px 16px',
  fontSize: 13,
  fontWeight: 800,
  cursor: 'pointer',
  fontFamily: 'inherit',
}

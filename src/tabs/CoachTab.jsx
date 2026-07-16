import { useEffect, useRef, useState } from 'react'
import Avatar from '../components/Avatar'
import { PILLARS, TIER_EMOJI } from '../constants'
import { read, write } from '../lib/storage'

const SUGGESTIONS = [
  'أفكار فطور صحي وسريع 🍳',
  'كيف أوصل ١٠ آلاف خطوة؟ 🚶',
  'تمارين بيتية بدون أدوات 🏋️',
  'نصائح لنوم أفضل 😴',
]

const historyKey = (memberId) => `wellness_challenge:coach:${memberId}`

/** AI coach chat — talks to our own /api/coach endpoint (never to Anthropic directly). */
export default function CoachTab({ member, todayLog, checkedIn }) {
  const [messages, setMessages] = useState(() => read(historyKey(member.id), []))
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length, busy])

  // Persist the conversation per member (capped at 40 turns).
  useEffect(() => {
    write(historyKey(member.id), messages.slice(-40))
  }, [member.id, messages])

  function todaySummary() {
    const parts = Object.entries(todayLog ?? {})
      .map(([pillarId, tier]) => {
        const pillar = PILLARS.find((p) => p.id === pillarId)
        return pillar ? `${pillar.name} ${TIER_EMOJI[tier]}` : null
      })
      .filter(Boolean)

    if (parts.length === 0) return checkedIn ? 'سجّلت متابعتها اليوم' : 'لم تسجّل متابعة اليوم بعد'
    return parts.join('، ')
  }

  async function send(text) {
    const content = (text ?? draft).trim()
    if (!content || busy) return

    setError('')
    setDraft('')
    const nextMessages = [...messages, { role: 'user', content }]
    setMessages(nextMessages)
    setBusy(true)

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
          memberContext: {
            name: member.name,
            points: member.points,
            streak: member.streak,
            todaySummary: todaySummary(),
          },
        }),
      })

      if (!response.ok) {
        const { error: code } = await response.json().catch(() => ({}))
        throw new Error(code ?? `http_${response.status}`)
      }

      const { reply } = await response.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: reply || '…' }])
    } catch (err) {
      const code = err?.message
      setError(
        code === 'not_configured'
          ? 'المساعدة الذكية غير مفعّلة بعد — أخبري كوتش مشاعل 💛'
          : code === 'rate_limited'
            ? 'وصلتِ حد الأسئلة مؤقتاً — جربي بعد دقائق 🌸'
            : 'تعذّر الاتصال بالمساعدة، جربي مرة ثانية'
      )
      // Roll the failed user turn back out of the transcript.
      setMessages((prev) => prev.slice(0, -1))
      setDraft(content)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="chat">
      <div className="chat__header">
        <div
          className="avatar"
          style={{
            width: 38,
            height: 38,
            background: 'linear-gradient(135deg, var(--brand-glow), var(--brand))',
            fontSize: 19,
          }}
        >
          ✨
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 900 }}>كوتشك الذكية</div>
          <div style={{ color: 'var(--ink-mute)', fontSize: 11, fontWeight: 700 }}>
            نصائح فورية على أعمدة التحدي
          </div>
        </div>
      </div>

      <div className="chat__messages" ref={listRef}>
        {messages.length === 0 && (
          <div style={{ margin: 'auto', textAlign: 'center', maxWidth: 300 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>✨</div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-sub)', marginBottom: 16 }}>
              اسأليني عن التغذية، التمارين، النوم، أو أي عمود من أعمدة التحدي
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  style={{
                    background: '#fff',
                    border: '2px solid var(--border)',
                    borderRadius: 14,
                    padding: '10px 14px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--ink-sub)',
                    cursor: 'pointer',
                    textAlign: 'right',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          const mine = msg.role === 'user'
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: mine ? 'flex-end' : 'flex-start',
              }}
            >
              {!mine && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 14 }}>✨</span>
                  <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--brand-dark)' }}>
                    كوتشك الذكية
                  </span>
                </div>
              )}
              <div className={`bubble ${mine ? 'bubble--me' : 'bubble--them'}`}>
                <div className="bubble__text" style={{ whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </div>
              </div>
            </div>
          )
        })}

        {busy && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start' }}>
            <span style={{ fontSize: 14 }}>✨</span>
            <div className="bubble bubble--them" style={{ padding: '10px 16px' }}>
              <span className="typing-dots">
                <i /><i /><i />
              </span>
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              alignSelf: 'center',
              background: 'var(--danger-tint)',
              border: '1.5px solid #FCC4C4',
              color: 'var(--danger)',
              borderRadius: 12,
              padding: '8px 14px',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {error}
          </div>
        )}
      </div>

      <div className="chat__composer">
        <Avatar skinIndex={member.skinIndex} colorIndex={member.colorIndex} size={34} />
        <textarea
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          placeholder="اسألي كوتشك الذكية…"
          disabled={busy}
        />
        <button
          className="chat__send"
          onClick={() => send()}
          disabled={!draft.trim() || busy}
          aria-label="إرسال"
        >
          ➤
        </button>
      </div>
    </div>
  )
}

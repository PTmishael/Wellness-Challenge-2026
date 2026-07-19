import { useEffect, useRef, useState } from 'react'
import Logo from '../components/Logo'
import Avatar from '../components/Avatar'
import { timeAgo } from '../lib/utils'
import { read, write } from '../lib/storage'

const notifyKey = (memberId) => `wellness_challenge:notify:${memberId}`

export default function ChatTab({
  member,
  isAdmin,
  messages,
  onSend,
  onEdit,
  onTogglePin,
  onDelete,
}) {
  const [draft, setDraft] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState('')
  const [replyTarget, setReplyTarget] = useState(null) // { id, name, snippet }
  const [notifyOn, setNotifyOn] = useState(() => read(notifyKey(member.id), 'off') === 'on')
  const [notifyHint, setNotifyHint] = useState('')
  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length])

  // ── Notifications toggle 🔔 ─────────────────────────────
  async function toggleNotifications() {
    setNotifyHint('')

    if (notifyOn) {
      write(notifyKey(member.id), 'off')
      setNotifyOn(false)
      return
    }

    if (typeof Notification === 'undefined') {
      setNotifyHint('التنبيهات غير مدعومة في هذا المتصفح')
      return
    }

    let permission = Notification.permission
    if (permission === 'default') {
      permission = await Notification.requestPermission()
    }

    if (permission === 'granted') {
      write(notifyKey(member.id), 'on')
      setNotifyOn(true)
    } else {
      setNotifyHint('اسمحي بالتنبيهات من إعدادات المتصفح أولاً')
    }
  }

  // ── Reply helpers ───────────────────────────────────────
  function startReply(message) {
    setReplyTarget({
      id: message.id,
      name: message.authorName,
      snippet: String(message.text ?? '').split('\n')[0].slice(0, 60),
    })
    inputRef.current?.focus()
  }

  function handleSend() {
    const text = draft.trim()
    if (!text) return
    onSend(text, replyTarget)
    setDraft('')
    setReplyTarget(null)
  }

  function startEdit(message) {
    setEditingId(message.id)
    setEditDraft(message.text)
  }

  function commitEdit(id) {
    onEdit(id, editDraft)
    setEditingId(null)
  }

  const ordered = [...messages].reverse()

  return (
    <div className="chat">
      <div className="chat__header">
        <Logo size={38} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 900 }}>شات التحدي</div>
          <div style={{ color: 'var(--ink-mute)', fontSize: 11, fontWeight: 700 }}>
            {messages.length} رسالة
          </div>
        </div>

        <div style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {isAdmin && <span className="pill pill--solid">👑 أدمن</span>}
          <button
            onClick={toggleNotifications}
            title={notifyOn ? 'إيقاف التنبيهات' : 'تفعيل التنبيهات'}
            style={{
              background: notifyOn ? 'var(--brand-tint)' : '#F1F5F2',
              border: `1.5px solid ${notifyOn ? 'var(--brand)' : 'var(--border)'}`,
              borderRadius: 12,
              width: 38,
              height: 38,
              fontSize: 17,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {notifyOn ? '🔔' : '🔕'}
          </button>
        </div>
      </div>

      {notifyHint && (
        <div
          style={{
            background: 'var(--amber-tint)',
            borderBottom: '1.5px solid #FBD9A5',
            color: '#B45309',
            fontSize: 12,
            fontWeight: 700,
            padding: '7px 15px',
            textAlign: 'center',
          }}
        >
          {notifyHint}
        </div>
      )}

      <div className="chat__messages" ref={listRef}>
        {ordered.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: 40, marginBottom: 8 }}>💬</div>
            <p>لا توجد رسائل بعد — كوني أول وحدة!</p>
          </div>
        )}

        {ordered.map((msg) => {
          const mine = msg.authorId === member.id
          const isEditing = editingId === msg.id

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: mine ? 'flex-end' : 'flex-start',
              }}
            >
              {!mine && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <Avatar skinIndex={msg.skinIndex} colorIndex={msg.colorIndex} size={26} />
                  <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--ink-sub)' }}>
                    {msg.authorName}
                    {msg.isAdmin && ' 👑'}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--ink-mute)', fontWeight: 700 }}>
                    ⚡ {msg.authorPoints}
                  </span>
                </div>
              )}

              {isEditing ? (
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    padding: 12,
                    maxWidth: '82%',
                    border: '2px solid var(--brand)',
                  }}
                >
                  <textarea
                    className="input"
                    rows={2}
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    style={{ fontSize: 13, padding: '9px 11px', borderRadius: 10 }}
                  />
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <button
                      onClick={() => commitEdit(msg.id)}
                      style={{
                        background: 'var(--brand)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 9,
                        padding: '7px 15px',
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      حفظ
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{
                        background: '#F1F5F2',
                        border: '1.5px solid var(--border)',
                        borderRadius: 9,
                        padding: '7px 15px',
                        fontSize: 11,
                        fontWeight: 800,
                        color: 'var(--ink-sub)',
                        cursor: 'pointer',
                      }}
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`bubble ${mine ? 'bubble--me' : 'bubble--them'}`}>
                  {msg.pinned && (
                    <div
                      style={{
                        fontSize: 10,
                        color: 'var(--ink-mute)',
                        marginBottom: 4,
                        fontWeight: 700,
                      }}
                    >
                      📌 مثبّت
                    </div>
                  )}

                  {/* WhatsApp-style quoted reply */}
                  {msg.replyTo && (
                    <div className="bubble__quote">
                      <span className="bubble__quote-name">{msg.replyTo.name}</span>
                      <span className="bubble__quote-text">{msg.replyTo.snippet}</span>
                    </div>
                  )}

                  <div className="bubble__text" style={{ whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </div>

                  <div className="bubble__meta">
                    <span>{timeAgo(msg.createdAt)}</span>
                    <button className="icon-btn" onClick={() => startReply(msg)} title="رد">
                      ↩️
                    </button>
                    {isAdmin && (
                      <span style={{ display: 'flex', gap: 4 }}>
                        <button className="icon-btn" onClick={() => startEdit(msg)} title="تعديل">
                          ✏️
                        </button>
                        <button
                          className="icon-btn"
                          onClick={() => onTogglePin(msg.id)}
                          title={msg.pinned ? 'فك التثبيت' : 'تثبيت'}
                        >
                          {msg.pinned ? '🔓' : '📌'}
                        </button>
                        <button
                          className="icon-btn icon-btn--danger"
                          onClick={() => onDelete(msg.id)}
                          title="حذف"
                        >
                          🗑️
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Reply preview bar above the composer */}
      {replyTarget && (
        <div className="reply-bar">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--brand-dark)' }}>
              ردّ على {replyTarget.name}
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--ink-mute)',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {replyTarget.snippet}
            </div>
          </div>
          <button
            onClick={() => setReplyTarget(null)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 16,
              cursor: 'pointer',
              color: 'var(--ink-mute)',
              padding: '0 4px',
            }}
            aria-label="إلغاء الرد"
          >
            ✕
          </button>
        </div>
      )}

      <div className="chat__composer">
        <Avatar skinIndex={member.skinIndex} colorIndex={member.colorIndex} size={34} />
        <textarea
          ref={inputRef}
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="اكتبي رسالة…"
        />
        <button className="chat__send" onClick={handleSend} disabled={!draft.trim()} aria-label="إرسال">
          ➤
        </button>
      </div>
    </div>
  )
}

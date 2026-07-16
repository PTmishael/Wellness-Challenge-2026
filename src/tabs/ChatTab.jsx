import { useEffect, useRef, useState } from 'react'
import Logo from '../components/Logo'
import Avatar from '../components/Avatar'
import { timeAgo } from '../lib/utils'

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
  const listRef = useRef(null)

  // Keep the view pinned to the newest message.
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length])

  function handleSend() {
    const text = draft.trim()
    if (!text) return
    onSend(text)
    setDraft('')
  }

  function startEdit(message) {
    setEditingId(message.id)
    setEditDraft(message.text)
  }

  function commitEdit(id) {
    onEdit(id, editDraft)
    setEditingId(null)
  }

  // Newest-last, like a real chat.
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
        {isAdmin && (
          <span style={{ marginInlineStart: 'auto' }}>
            <span className="pill pill--solid">👑 أدمن</span>
          </span>
        )}
      </div>

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
              {/* Sender line — only for other people's messages */}
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
                  <div className="bubble__text">{msg.text}</div>
                  <div className="bubble__meta">
                    <span>{timeAgo(msg.createdAt)}</span>
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

      <div className="chat__composer">
        <Avatar skinIndex={member.skinIndex} colorIndex={member.colorIndex} size={34} />
        <textarea
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

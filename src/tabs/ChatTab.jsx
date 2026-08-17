import { useEffect, useRef, useState } from 'react'
import Logo from '../components/Logo'
import Avatar from '../components/Avatar'
import { timeAgo } from '../lib/utils'
import { uploadChatPhoto, getLastError, reactionEntries } from '../lib/storage'
import { notifyPermission, requestNotifyPermission, showNotification } from '../lib/notify'
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
  onReact,
  onSignOut,
}) {
  const [draft, setDraft] = useState('')
  const [photo, setPhoto] = useState(null)      // { file, preview }
  const [uploading, setUploading] = useState(false)
  const [photoError, setPhotoError] = useState('')
  const [lightbox, setLightbox] = useState(null) // enlarged image url
  const fileRef = useRef(null)
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

    let permission = notifyPermission()
    if (permission === 'default') {
      permission = await requestNotifyPermission()
    }

    if (permission !== 'granted') {
      setNotifyHint(
        permission === 'unsupported'
          ? 'التنبيهات غير مدعومة في هذا المتصفح'
          : 'اسمحي بالتنبيهات من إعدادات المتصفح أولاً'
      )
      return
    }

    // Confirm the device can really show one before turning the bell on.
    if (!showNotification('تحدي العافية 🌿', { body: 'تم تفعيل تنبيهات سواليف ✅' })) {
      setNotifyHint('التنبيهات غير مدعومة في هذا الجهاز')
      return
    }

    write(notifyKey(member.id), 'on')
    setNotifyOn(true)
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

  function pickPhoto(file) {
    setPhotoError('')
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setPhotoError('اختاري صورة')
      return
    }
    setPhoto({ file, preview: URL.createObjectURL(file) })
  }

  function clearPhoto() {
    if (photo?.preview) URL.revokeObjectURL(photo.preview)
    setPhoto(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSend() {
    const text = draft.trim()
    if (!text && !photo) return

    let imageUrl = null
    if (photo) {
      setUploading(true)
      imageUrl = await uploadChatPhoto(photo.file, member.id)
      setUploading(false)
      if (!imageUrl) {
        // Show the real reason — usually a missing storage policy or bucket.
        const reason = getLastError()
        setPhotoError(reason ? `تعذّر رفع الصورة — ${reason}` : 'تعذّر رفع الصورة، حاولي مرة ثانية')
        return
      }
    }

    onSend(text, replyTarget, imageUrl)
    setDraft('')
    if (inputRef.current) inputRef.current.style.height = 'auto'
    setReplyTarget(null)
    clearPhoto()
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
          <button className="topbar__signout" onClick={onSignOut}>خروج</button>
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
                  <Avatar name={msg.authorName} colorIndex={msg.colorIndex} size={26} />
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

                  {msg.imageUrl && (
                    <button
                      className="bubble__photo"
                      onClick={() => setLightbox(msg.imageUrl)}
                      aria-label="تكبير الصورة"
                    >
                      <img src={msg.imageUrl} alt="" loading="lazy" />
                    </button>
                  )}

                  {msg.text && (
                    <div className="bubble__text" style={{ whiteSpace: 'pre-wrap' }}>
                      {msg.text}
                    </div>
                  )}

                  <Reactions
                    reactions={msg.reactions}
                    memberId={member.id}
                    onReact={(emoji) => onReact(msg.id, emoji, msg.reactions ?? {})}
                  />

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

      {photo && (
        <div className="chat__photo-preview">
          <img src={photo.preview} alt="" />
          <button onClick={clearPhoto} aria-label="إزالة الصورة">✕</button>
          <span>{uploading ? 'جاري الرفع…' : 'جاهزة للإرسال'}</span>
        </div>
      )}
      {photoError && <div className="chat__photo-error">{photoError}</div>}

      <div className="chat__composer">
        <Avatar name={member.name} colorIndex={member.colorIndex} size={34} />

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => pickPhoto(e.target.files?.[0])}
        />
        <button
          className="chat__photo-btn"
          onClick={() => fileRef.current?.click()}
          aria-label="إرفاق صورة"
          disabled={uploading}
        >
          📷
        </button>
        <textarea
          ref={inputRef}
          rows={1}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            // Grow with the text, up to the CSS max-height.
            const el = e.target
            el.style.height = 'auto'
            el.style.height = `${el.scrollHeight}px`
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="اكتبي رسالة…"
        />
        <button className="chat__send" onClick={handleSend} disabled={(!draft.trim() && !photo) || uploading} aria-label="إرسال">
          {uploading ? '…' : '➤'}
        </button>
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)} role="dialog" aria-label="عرض الصورة">
          <img src={lightbox} alt="" />
          <button className="lightbox__close" aria-label="إغلاق">✕</button>
        </div>
      )}
    </div>
  )
}

/** Available reactions — kept short so the row stays tidy. */
const REACTIONS = ['❤️', '😂', '👏', '🔥']

function Reactions({ reactions = {}, memberId, onReact }) {
  const [picking, setPicking] = useState(false)
  const [showing, setShowing] = useState(null) // which emoji's names are open

  const active = Object.entries(reactions)
    .map(([emoji, list]) => [emoji, reactionEntries(list)])
    .filter(([, who]) => who.length > 0)

  function react(emoji) {
    onReact(emoji)
    setPicking(false)
  }

  return (
    <div className="reactions">
      <div className="reactions__row">
        {active.map(([emoji, who]) => {
          const mine = who.some((entry) => entry.id === memberId)
          return (
            <span key={emoji} className="reaction-wrap">
              <button
                className={`reaction${mine ? ' is-mine' : ''}`}
                onClick={() => react(emoji)}
                title={mine ? 'شيلي تفاعلك' : 'تفاعلي'}
              >
                {emoji} {who.length}
              </button>
              {/* tap the count to see who reacted */}
              <button
                className="reaction__who-btn"
                onClick={() => setShowing(showing === emoji ? null : emoji)}
                aria-label="مين تفاعل"
              >
                ⌄
              </button>
            </span>
          )
        })}

        {/* one button hides the whole picker */}
        <button
          className={`reaction reaction--toggle${picking ? ' is-open' : ''}`}
          onClick={() => setPicking(!picking)}
          aria-label="أضيفي تفاعل"
        >
          {picking ? '✕' : '🙂＋'}
        </button>
      </div>

      {picking && (
        <div className="reactions__picker">
          {REACTIONS.map((emoji) => (
            <button key={emoji} className="reaction reaction--add" onClick={() => react(emoji)}>
              {emoji}
            </button>
          ))}
        </div>
      )}

      {showing && (
        <div className="reactions__who">
          {showing}{' '}
          {reactionEntries(reactions[showing])
            .map((entry) => entry.name)
            .join('، ')}
        </div>
      )}
    </div>
  )
}

/** Generic yes/no modal. */
export default function ConfirmDialog({
  open,
  icon = '🗑️',
  title,
  message,
  confirmLabel = 'نعم',
  cancelLabel = 'إلغاء',
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="card"
        style={{ maxWidth: 320, width: '100%', textAlign: 'center', margin: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
        <h3 style={{ fontSize: 17, fontWeight: 900, marginBottom: 8 }}>{title}</h3>
        <p style={{ color: 'var(--ink-sub)', fontSize: 13, marginBottom: 20, fontWeight: 600 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn--danger" style={{ margin: 0 }} onClick={onConfirm}>
            {confirmLabel}
          </button>
          <button className="btn btn--ghost" style={{ margin: 0 }} onClick={onCancel}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

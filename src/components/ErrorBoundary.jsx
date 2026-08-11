import { Component } from 'react'

/**
 * Catches render crashes so a bug shows a readable message instead of a
 * blank white page — and shows the actual error, which is what you need
 * when someone reports "it's not working" from their phone.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="app-shell">
        <div className="screen-center" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 38, marginBottom: 12 }}>🌿</div>
          <h1 style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>
            صار خلل بسيط
          </h1>
          <p style={{ color: 'var(--ink-sub)', fontSize: 13.5, lineHeight: 1.9, maxWidth: 320 }}>
            جرّبي تحدّثين الصفحة. إذا تكرر، أرسلي هذي الرسالة لكوتش مشاعل:
          </p>

          <code
            style={{
              display: 'block',
              marginTop: 12,
              padding: '10px 12px',
              background: '#F1F5F2',
              borderRadius: 10,
              fontSize: 11,
              color: '#B3261E',
              wordBreak: 'break-word',
              maxWidth: 320,
              textAlign: 'left',
              direction: 'ltr',
            }}
          >
            {String(this.state.error?.message ?? this.state.error)}
          </code>

          <button
            className="btn"
            style={{ marginTop: 18, background: '#1E3D21', color: '#FFFDF7', maxWidth: 320 }}
            onClick={() => window.location.reload()}
          >
            تحديث الصفحة
          </button>
        </div>
      </div>
    )
  }
}

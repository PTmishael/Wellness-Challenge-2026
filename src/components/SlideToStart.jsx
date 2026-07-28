import { useRef, useState } from 'react'

/**
 * A drag-to-confirm slider — used on the home page so starting the
 * daily check-in feels deliberate rather than an accidental tap.
 */
export default function SlideToStart({ label = 'اسحبي للبدء', doneLabel = 'يلا نبدأ 🌿', onComplete }) {
  const trackRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [offset, setOffset] = useState(0)
  const [done, setDone] = useState(false)
  const startX = useRef(0)
  const maxOffset = useRef(0)

  function begin(clientX) {
    if (!trackRef.current) return
    setDragging(true)
    startX.current = clientX
    maxOffset.current = trackRef.current.offsetWidth - 56
  }

  function move(clientX) {
    if (!dragging) return
    // RTL: dragging leftward increases progress.
    const delta = Math.max(0, Math.min(startX.current - clientX, maxOffset.current))
    setOffset(delta)
    if (delta >= maxOffset.current - 2) {
      setDragging(false)
      setDone(true)
      onComplete?.()
    }
  }

  function end() {
    if (dragging) {
      setDragging(false)
      setOffset(0)
    }
  }

  const progress = maxOffset.current > 0 ? offset / maxOffset.current : 0

  return (
    <div
      ref={trackRef}
      className="slide-track"
      onMouseDown={(e) => begin(e.clientX)}
      onMouseMove={(e) => move(e.clientX)}
      onMouseUp={end}
      onMouseLeave={end}
      onTouchStart={(e) => begin(e.touches[0].clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
      onTouchEnd={end}
    >
      <div className="slide-track__fill" style={{ width: done ? '100%' : offset + 51 }} />
      <div
        className="slide-track__label"
        style={{ opacity: done ? 1 : 1 - progress * 0.7, color: done ? 'var(--ink-on-ombre)' : undefined }}
      >
        {done ? doneLabel : label}
      </div>
      <div
        className="slide-track__knob"
        style={{ right: 5 + (done ? maxOffset.current : offset), cursor: dragging ? 'grabbing' : 'grab' }}
      >
        ←
      </div>
    </div>
  )
}

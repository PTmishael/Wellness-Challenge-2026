/**
 * Small diagrams that carry part of the explanation.
 * Drawn inline so they stay crisp and add no download weight.
 */
export default function ArticleFigure({ id }) {
  if (id === 'fridge') return <Fridge />
  if (id === 'cycles') return <SleepCycles />
  if (id === 'routine') return <NightRoutine />
  if (id === 'caffeine') return <Caffeine />
  return null
}

const wrap = {
  background: 'rgba(255,255,255,0.7)',
  borderRadius: 14,
  padding: 14,
  marginBottom: 14,
}
const cap = { color: 'var(--ink-scene-sub)', fontSize: 10.5, textAlign: 'center', marginTop: 8, fontWeight: 700 }

/** Fridge shelves, top to bottom, with what belongs where. */
function Fridge() {
  const shelves = [
    { label: 'فوق / ورا — اللي ينأكل بدون وعي', tone: 0.06 },
    { label: 'رف العين — جاهز للأكل 👁️', tone: 0.2, star: true },
    { label: 'بروتين مجهّز مرة بالأسبوع', tone: 0.12 },
    { label: 'علب شفافة — اللي تشوفينه تاكلينه', tone: 0.09 },
    { label: 'درج الخضار — اغسلي وقطّعي فورًا', tone: 0.09 },
  ]
  return (
    <div style={wrap}>
      <div
        style={{
          border: '2px solid rgba(30,61,33,0.35)',
          borderRadius: 12,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {shelves.map((s, i) => (
          <div
            key={i}
            style={{
              background: `rgba(30,61,33,${s.tone})`,
              borderBottom: i < shelves.length - 1 ? '1.5px solid rgba(30,61,33,0.25)' : 'none',
              padding: '11px 12px',
              color: 'var(--ink-scene)',
              fontSize: 11.5,
              fontWeight: s.star ? 800 : 600,
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            {s.star && <span>⭐</span>}
            {s.label}
          </div>
        ))}
      </div>
      <div style={cap}>الصحي في الأسهل، والباقي يحتاج خطوة زيادة</div>
    </div>
  )
}

/** One night: repeating ~90-minute cycles, deep early, dreams later. */
function SleepCycles() {
  return (
    <div style={wrap}>
      <svg viewBox="0 0 300 120" style={{ width: '100%', display: 'block' }} role="img" aria-label="دورات النوم">
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <path
              d={`M${12 + i * 70},22 C${30 + i * 70},22 ${28 + i * 70},86 ${46 + i * 70},86 C${64 + i * 70},86 ${62 + i * 70},22 ${80 + i * 70},22`}
              fill="none"
              stroke="#1E3D21"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity={0.85 - i * 0.12}
            />
            <text x={46 + i * 70} y={106} textAnchor="middle" fontSize="9" fill="#5C6D5F" fontWeight="700">
              {['٩٠ د', '٩٠ د', '٩٠ د', '٩٠ د'][i]}
            </text>
          </g>
        ))}
        <text x="296" y="20" textAnchor="end" fontSize="9.5" fill="#2E4433" fontWeight="800">نوم خفيف / أحلام</text>
        <text x="296" y="96" textAnchor="end" fontSize="9.5" fill="#2E4433" fontWeight="800">نوم عميق</text>
      </svg>
      <div style={cap}>كل صحيان يرجّعك لبداية الدورة</div>
    </div>
  )
}

/** The last hour before bed, as a countdown. */
function NightRoutine() {
  const steps = [
    { t: 'قبل ساعة', d: 'خفّفي الإضاءة' },
    { t: 'قبل ٤٥ د', d: 'اكتبي اللي في راسك' },
    { t: 'قبل ٣٠ د', d: 'نزّلي الجوال' },
    { t: 'قبل ١٥ د', d: 'برّدي الغرفة' },
    { t: 'النوم', d: 'نفس الوقت كل ليلة' },
  ]
  return (
    <div style={wrap}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: i === steps.length - 1 ? 'var(--brand-deep)' : 'rgba(30,61,33,0.4)',
                  flexShrink: 0,
                }}
              />
              {i < steps.length - 1 && <span style={{ width: 2, height: 22, background: 'rgba(30,61,33,0.22)' }} />}
            </div>
            <div style={{ paddingBottom: i < steps.length - 1 ? 8 : 0 }}>
              <div style={{ color: 'var(--brand-deep)', fontSize: 10, fontWeight: 800 }}>{s.t}</div>
              <div style={{ color: 'var(--ink-scene)', fontSize: 12, fontWeight: 700 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={cap}>إشارات تقول لجسمك إن الوقت قرب</div>
    </div>
  )
}

/** How much caffeine is still in you, hours later. */
function Caffeine() {
  const bars = [
    { h: '٠', pct: 100 },
    { h: '٦', pct: 50 },
    { h: '١٢', pct: 25 },
    { h: '١٨', pct: 12 },
  ]
  return (
    <div style={wrap}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 90, justifyContent: 'center' }}>
        {bars.map((b, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 34,
                height: `${b.pct * 0.7}px`,
                background: `rgba(30,61,33,${0.25 + b.pct / 200})`,
                borderRadius: '7px 7px 0 0',
              }}
            />
            <div style={{ color: 'var(--ink-scene)', fontSize: 10, fontWeight: 800, marginTop: 4 }}>{b.pct}٪</div>
            <div style={{ color: 'var(--ink-scene-sub)', fontSize: 9.5, fontWeight: 700 }}>{b.h} ساعات</div>
          </div>
        ))}
      </div>
      <div style={cap}>قهوة العصر… ربعها لسه شغال بالليل</div>
    </div>
  )
}

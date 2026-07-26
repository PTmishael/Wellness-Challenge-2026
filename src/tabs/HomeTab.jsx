import { CHALLENGE_DAYS, DAILY_QUOTE, PILLARS } from '../constants'
import { arabicDigits, challengeDay } from '../lib/utils'

export default function HomeTab({ member, checkedIn, onStartCheckIn }) {
  const day = challengeDay()
  const doneCount = checkedIn ? PILLARS.length : 0

  return (
    <div className="fullscreen" style={{ background: 'linear-gradient(168deg,#2C4640,#16241F 55%,#0F1B17)' }}>
      <svg className="fullscreen__ripple" viewBox="0 0 400 220" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-20 150 q90 -28 180 -6 q100 24 200 -14" stroke="var(--deep-line)" strokeWidth="1.4" fill="none" opacity="0.28" strokeLinecap="round" />
      </svg>

      <div className="fullscreen__inner">
        {/* greeting */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ color: 'var(--deep-sub)', fontSize: 13 }}>أهلاً</div>
            <div style={{ color: 'var(--deep-text)', fontSize: 23, fontWeight: 800, marginTop: 2 }}>
              {member.name}
            </div>
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.16)',
              borderRadius: 16,
              padding: '8px 14px',
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#F5D76E', fontSize: 18, fontWeight: 800 }}>
              {arabicDigits(member.points)}
            </div>
            <div style={{ color: 'var(--deep-sub)', fontSize: 9.5 }}>نقطة</div>
          </div>
        </div>

        {/* day + streak */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.08)', borderRadius: 15, padding: 14, textAlign: 'center' }}>
            <div style={{ color: 'var(--deep-text)', fontSize: 20, fontWeight: 800 }}>{arabicDigits(day)}</div>
            <div style={{ color: 'var(--deep-sub)', fontSize: 10.5, marginTop: 2 }}>
              اليوم من {arabicDigits(CHALLENGE_DAYS)}
            </div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.08)', borderRadius: 15, padding: 14, textAlign: 'center' }}>
            <div style={{ color: 'var(--deep-text)', fontSize: 20, fontWeight: 800 }}>{arabicDigits(member.streak)}</div>
            <div style={{ color: 'var(--deep-sub)', fontSize: 10.5, marginTop: 2 }}>أيام متتالية</div>
          </div>
        </div>

        {/* main CTA */}
        <div
          style={{
            marginTop: 22,
            background: checkedIn ? 'rgba(255,255,255,0.06)' : 'rgba(155,211,172,0.14)',
            border: `1.5px solid ${checkedIn ? 'rgba(255,255,255,0.12)' : 'rgba(155,211,172,0.35)'}`,
            borderRadius: 24,
            padding: '22px 20px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 68,
              height: 68,
              margin: '0 auto 14px',
              borderRadius: '50%',
              border: `2px solid ${checkedIn ? 'rgba(255,255,255,0.2)' : '#9BD3AC'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: checkedIn ? 'var(--deep-sub)' : '#9BD3AC',
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            {arabicDigits(doneCount)}/{arabicDigits(PILLARS.length)}
          </div>

          {checkedIn ? (
            <>
              <div style={{ color: 'var(--deep-text)', fontSize: 17, fontWeight: 800 }}>خلّصتِ اليوم 🌟</div>
              <div style={{ color: 'var(--deep-sub)', fontSize: 12.5, marginTop: 5, lineHeight: 1.7 }}>
                تعالي بكرة للمتابعة الجديدة
              </div>
            </>
          ) : (
            <>
              <div style={{ color: 'var(--deep-text)', fontSize: 17, fontWeight: 800 }}>متابعتك اليومية</div>
              <div style={{ color: 'var(--deep-sub)', fontSize: 12.5, marginTop: 5, lineHeight: 1.7 }}>
                سجّلي إنجازاتك الخمسة لليوم
              </div>
              <button
                onClick={onStartCheckIn}
                style={{
                  width: '100%',
                  marginTop: 16,
                  background: '#F2F7F4',
                  color: '#16241F',
                  border: 'none',
                  borderRadius: 15,
                  padding: 14,
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                ابدئي المتابعة ←
              </button>
            </>
          )}
        </div>

        {/* quote */}
        <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.06)', borderRadius: 15, padding: '13px 16px' }}>
          <div style={{ color: 'var(--deep-text)', fontSize: 12.5, lineHeight: 1.85, textAlign: 'center', fontStyle: 'italic' }}>
            {DAILY_QUOTE}
          </div>
        </div>
      </div>
    </div>
  )
}

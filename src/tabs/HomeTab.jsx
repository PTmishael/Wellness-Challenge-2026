import { CHALLENGE_DAYS, DAILY_QUOTE, PILLARS } from '../constants'
import { arabicDigits, challengeDay } from '../lib/utils'

export default function HomeTab({ member, checkedIn, onStartCheckIn }) {
  const day = challengeDay()
  const doneCount = checkedIn ? PILLARS.length : 0

  return (
    <div className="fullscreen" style={{ background: 'linear-gradient(172deg,#B9A88C 0%,#7C8A7E 44%,#465862 100%)' }}>
      <svg className="fullscreen__ripple" viewBox="0 0 400 220" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-20 150 q90 -28 180 -6 q100 24 200 -14" stroke="#F3ECE0" strokeWidth="1.4" fill="none" opacity="0.4" strokeLinecap="round" />
      </svg>

      <div className="fullscreen__inner">
        {/* greeting */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ color: '#EDE6D8', fontSize: 13 }}>أهلاً</div>
            <div style={{ color: '#FCF8F0', fontSize: 23, fontWeight: 800, marginTop: 2 }}>
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
            <div style={{ color: '#EDE6D8', fontSize: 9.5 }}>نقطة</div>
          </div>
        </div>

        {/* day + streak */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.08)', borderRadius: 15, padding: 14, textAlign: 'center' }}>
            <div style={{ color: '#FCF8F0', fontSize: 20, fontWeight: 800 }}>{arabicDigits(day)}</div>
            <div style={{ color: '#EDE6D8', fontSize: 10.5, marginTop: 2 }}>
              اليوم من {arabicDigits(CHALLENGE_DAYS)}
            </div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.08)', borderRadius: 15, padding: 14, textAlign: 'center' }}>
            <div style={{ color: '#FCF8F0', fontSize: 20, fontWeight: 800 }}>{arabicDigits(member.streak)}</div>
            <div style={{ color: '#EDE6D8', fontSize: 10.5, marginTop: 2 }}>أيام متتالية</div>
          </div>
        </div>

        {/* main CTA */}
        <div
          style={{
            marginTop: 22,
            background: checkedIn ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.18)',
            border: `1.5px solid ${checkedIn ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.45)'}`,
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
              border: `2px solid ${checkedIn ? 'rgba(255,255,255,0.25)' : '#F3ECE0'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: checkedIn ? '#EDE6D8' : '#FCF8F0',
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            {arabicDigits(doneCount)}/{arabicDigits(PILLARS.length)}
          </div>

          {checkedIn ? (
            <>
              <div style={{ color: '#FCF8F0', fontSize: 17, fontWeight: 800 }}>خلّصتِ اليوم 🌟</div>
              <div style={{ color: '#EDE6D8', fontSize: 12.5, marginTop: 5, lineHeight: 1.7 }}>
                تعالي بكرة للمتابعة الجديدة
              </div>
            </>
          ) : (
            <>
              <div style={{ color: '#FCF8F0', fontSize: 17, fontWeight: 800 }}>متابعتك اليومية</div>
              <div style={{ color: '#EDE6D8', fontSize: 12.5, marginTop: 5, lineHeight: 1.7 }}>
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
          <div style={{ color: '#FCF8F0', fontSize: 12.5, lineHeight: 1.85, textAlign: 'center', fontStyle: 'italic' }}>
            {DAILY_QUOTE}
          </div>
        </div>
      </div>
    </div>
  )
}

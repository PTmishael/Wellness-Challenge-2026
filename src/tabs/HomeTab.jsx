import OmbrePage from '../components/OmbrePage'
import SlideToStart from '../components/SlideToStart'
import { CHALLENGE_DAYS, DAILY_QUOTE, APP_OMBRE, APP_WAVE } from '../constants'
import { arabicDigits, challengeDay } from '../lib/utils'

export default function HomeTab({ member, checkedIn, onStartCheckIn, onSignOut }) {
  const day = challengeDay()

  return (
    <OmbrePage ombre={APP_OMBRE} wave={APP_WAVE}>
      {/* top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div className="day-chip" style={{ flexDirection: 'column', textAlign: 'center', lineHeight: 1.1 }}>
            <span style={{ fontSize: 14 }}>{arabicDigits(member.points)}</span>
            <span style={{ fontSize: 8.5, fontWeight: 700, opacity: 0.8 }}>نقطة</span>
          </div>
          <div className="day-chip" style={{ flexDirection: 'column', textAlign: 'center', lineHeight: 1.1 }}>
            <span style={{ fontSize: 14 }}>{arabicDigits(day)}</span>
            <span style={{ fontSize: 8.5, fontWeight: 700, opacity: 0.8 }}>من {arabicDigits(CHALLENGE_DAYS)}</span>
          </div>
          <button
            onClick={onSignOut}
            style={{
              background: 'rgba(255,255,255,0.32)',
              border: 'none',
              borderRadius: 12,
              padding: '0 12px',
              color: 'var(--ink-on-ombre)',
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            خروج
          </button>
        </div>
        <div style={{ textAlign: 'left' }}>
          <div className="ombre-sub" style={{ fontSize: 11 }}>أهلاً</div>
          <div className="ombre-title" style={{ fontSize: 19 }}>{member.name}</div>
        </div>
      </div>

      {/* title + intro */}
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <h1 className="ombre-title" style={{ fontSize: 24 }}>تحدي العافية</h1>
        <p className="ombre-sub" style={{ fontSize: 12, marginTop: 5 }}>
          ٢٨ يوم · ٥ عادات · مجتمع يشجّعك
        </p>
        <p className="ombre-sub" style={{ fontSize: 12, lineHeight: 2.1, marginTop: 8 }}>
          اجمعي نقاط وافتحي أسرار من كوتش مشاعل
        </p>
      </div>

      {/* action zone */}
      <div style={{ marginTop: 'auto', paddingTop: 34, textAlign: 'center' }}>
        {checkedIn ? (
          <>
            <div className="ombre-title--light" style={{ fontSize: 18 }}>خلّصتِ اليوم 🌟</div>
            <div className="ombre-sub--light" style={{ fontSize: 12, marginTop: 5 }}>
              تعالي بكرة للمتابعة الجديدة
            </div>
          </>
        ) : (
          <>
            <div className="ombre-title--light" style={{ fontSize: 18 }}>جاهزة لليوم؟</div>
            <div className="ombre-sub--light" style={{ fontSize: 12, marginTop: 4 }}>
              خمس خطوات بس، وتخلصين
            </div>
            <SlideToStart onComplete={onStartCheckIn} />
          </>
        )}

        <div style={{ marginTop: 14, background: 'rgba(255,255,255,0.12)', borderRadius: 13, padding: '11px 13px' }}>
          <div className="ombre-sub--light" style={{ fontSize: 11, lineHeight: 1.85, fontStyle: 'italic' }}>
            "{DAILY_QUOTE}"
          </div>
        </div>
      </div>
    </OmbrePage>
  )
}

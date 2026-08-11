import ScenePage from '../components/ScenePage'
import SlideToStart from '../components/SlideToStart'
import DailyReminder from '../components/DailyReminder'
import { CHALLENGE_DAYS, DAILY_QUOTE, SCENES } from '../constants'
import { arabicDigits, challengeDay } from '../lib/utils'

export default function HomeTab({ member, checkedIn, onStartCheckIn, onSignOut }) {
  const day = challengeDay()

  return (
    <ScenePage scene={SCENES.app}>
      {/* top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div className="scene-chip">
            <div style={{ fontSize: 14 }}>{arabicDigits(member.points)}</div>
            <div style={{ fontSize: 8.5, fontWeight: 700, opacity: 0.75 }}>نقطة</div>
          </div>
          <div className="scene-chip">
            <div style={{ fontSize: 14 }}>{arabicDigits(day)}</div>
            <div style={{ fontSize: 8.5, fontWeight: 700, opacity: 0.75 }}>من {arabicDigits(CHALLENGE_DAYS)}</div>
          </div>
          <button
            onClick={onSignOut}
            className="scene-chip"
            style={{
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 11,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            خروج
          </button>
        </div>
        <div style={{ textAlign: 'left' }}>
          <div className="scene-sub" style={{ fontSize: 11 }}>أهلاً</div>
          <div className="scene-title" style={{ fontSize: 19 }}>{member.name}</div>
        </div>
      </div>

      {/* the action, centred in the page */}
      <div style={{ margin: 'auto 0', textAlign: 'center', width: '100%' }}>
        {checkedIn ? (
          <>
            <div className="scene-title" style={{ fontSize: 20 }}>خلّصتِ اليوم 🌟</div>
            <div className="scene-sub" style={{ fontSize: 13, marginTop: 6 }}>
              تعالي بكرة للمتابعة الجديدة
            </div>
          </>
        ) : (
          <>
            <div className="scene-title" style={{ fontSize: 21 }}>جاهزة لليوم؟</div>
            <div className="scene-sub" style={{ fontSize: 13, marginTop: 6 }}>
              خمس خطوات بس، وتخلصين
            </div>
            <SlideToStart onComplete={onStartCheckIn} />
          </>
        )}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <DailyReminder memberId={member.id} checkedIn={checkedIn} />
      </div>

      {/* quote sits at the foot */}
      <div className="scene-card" style={{ marginTop: 12 }}>
        <div
          className="scene-sub"
          style={{ fontSize: 11.5, lineHeight: 1.85, fontStyle: 'italic', textAlign: 'center', textShadow: 'none' }}
        >
          "{DAILY_QUOTE}"
        </div>
      </div>
    </ScenePage>
  )
}

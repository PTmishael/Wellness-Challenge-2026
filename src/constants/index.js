// ═══════════════════════════════════════════════════════════
//  Wellness Challenge — App Constants
//  Change the admin credentials and member cap here.
// ═══════════════════════════════════════════════════════════

/** Admin login. Change these before deploying publicly. */
export const ADMIN_USERNAME = 'Mishael'
export const ADMIN_PASSWORD = 'wellness2025'

/** Maximum number of non-admin members allowed to register. */
export const MAX_MEMBERS = 50

/** Emoji symbols members can pick as their avatar. */
export const SKINS = ['🌸', '🌿', '🍋', '🌊', '🔥', '⭐', '🌙', '🦋', '🌺', '🍀']

/** Avatar colour palettes (index matches the skin index by default). */
export const AVATAR_COLORS = [
  { bg: '#E8F0E9', accent: '#37693D' },
  { bg: '#FFE9E9', accent: '#FF6B6B' },
  { bg: '#FFF2DF', accent: '#FFA62B' },
  { bg: '#E3F5FE', accent: '#38BDF8' },
  { bg: '#F1EBFE', accent: '#8B5CF6' },
  { bg: '#FEF9DF', accent: '#FACC15' },
  { bg: '#FCE7F3', accent: '#EC4899' },
  { bg: '#DBFAF0', accent: '#14B8A6' },
  { bg: '#FFEDD5', accent: '#F97316' },
  { bg: '#EDE9FE', accent: '#7C3AED' },
]

/** The 5 pillars with Bronze / Silver / Gold tiers. */
export const PILLARS = [
  {
    id: 'steps',
    icon: '🚶',
    name: 'الحركة',
    tiers: { bronze: '٣٠٠٠ خطوة', silver: '٧٠٠٠ خطوة', gold: '١٠٠٠٠ خطوة' },
  },
  {
    id: 'water',
    icon: '💧',
    name: 'الماء',
    tiers: { bronze: '٣ أكواب', silver: '٥ أكواب', gold: '٨ أكواب' },
  },
  {
    id: 'fitness',
    icon: '🏋️',
    name: 'اللياقة',
    tiers: { bronze: 'ما تمرنت', silver: 'سويت بلانك ١ دقيقة', gold: 'تمرنت مقاومة' },
  },
  {
    id: 'sleep',
    icon: '😴',
    name: 'النوم',
    tiers: { bronze: '٣-٤ ساعات', silver: '٥-٦ ساعات', gold: '٧ ساعات وأكثر' },
  },
  {
    id: 'nutrition',
    icon: '🌿',
    name: 'التغذية',
    tiers: { bronze: 'ما أكلت مقلي ولا مشروب غازي', silver: 'وقفت الأكل بعد الساعة ٨', gold: 'أكلت خضرة مع بروتين' },
  },
]

/** Points awarded per tier. Max possible per day = 5 pillars × 3 = 15. */
export const TIER_POINTS = { bronze: 1, silver: 2, gold: 3 }

export const TIER_LABELS = { bronze: 'برونز', silver: 'فضة', gold: 'ذهب' }
export const TIER_EMOJI = { bronze: '🥉', silver: '🥈', gold: '🥇' }
export const TIER_ORDER = ['bronze', 'silver', 'gold']

/** Medals and their unlock conditions. */
export const MEDALS = [
  { id: 'first_checkin', icon: '🌱', name: 'أول خطوة',   desc: 'سجّلتِ أول متابعة',            requirement: 'متابعة مرة وحدة' },
  { id: 'streak_3',      icon: '🔥', name: '٣ أيام',      desc: '٣ أيام ما وقفتِ',              requirement: '٣ أيام على التوالي' },
  { id: 'streak_7',      icon: '⚡', name: 'أسبوع كامل',  desc: 'أسبوع كامل، ما شاء الله',      requirement: '٧ أيام على التوالي' },
  { id: 'all_gold',      icon: '🥇', name: 'ذهب خالص',    desc: 'كل الأعمدة ذهب في يوم واحد',  requirement: 'كل الأعمدة ذهب في يوم' },
  { id: 'points_25',     icon: '🏅', name: 'ملتزمة',      desc: 'وصلتِ لـ ٢٥ نقطة',             requirement: '٢٥ نقطة' },
  { id: 'points_50',     icon: '🏆', name: 'بطلة',        desc: '٥٠ نقطة، أنتِ نجمة الجروب',  requirement: '٥٠ نقطة' },
  { id: 'social_5',      icon: '💬', name: 'روح الجروب',  desc: 'شاركتِ ٥ مرات وشجّعتِ الكل',  requirement: '٥ رسائل في الشات' },
]

/** Motivational line shown under the daily check-in header. */
export const DAILY_QUOTE =
  'سجّلي بكل أمانة وش حققتي اليوم، وبالنهاية تجمعين ميداليات — الميدالية الحقيقية هي صحتك 💚'

/** Max chat messages retained in storage. */
export const MAX_CHAT_MESSAGES = 200

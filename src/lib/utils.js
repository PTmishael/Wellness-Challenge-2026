// ═══════════════════════════════════════════════════════════
//  Shared helpers
// ═══════════════════════════════════════════════════════════
import {
  AVATAR_COLORS,
  SKINS,
  CHALLENGE_START,
  CHALLENGE_DAYS,
  FUN_FACTS,
  UNLOCKS,
} from '../constants'

/** Local date as YYYY-MM-DD. */
export function today() {
  return new Date().toLocaleDateString('en-CA')
}

/** Relative time in Arabic. */
export function timeAgo(timestamp) {
  if (!timestamp) return ''
  const diff = Date.now() - timestamp
  const min = 60_000
  const hour = 3_600_000
  const day = 86_400_000
  if (diff < min) return 'الآن'
  if (diff < hour) return `منذ ${Math.floor(diff / min)}د`
  if (diff < day) return `منذ ${Math.floor(diff / hour)}س`
  return `منذ ${Math.floor(diff / day)} يوم`
}

/** Arabic-Indic digits (١٢ instead of 12). */
export function arabicDigits(value) {
  const map = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  return String(value).replace(/\d/g, (d) => map[Number(d)])
}

/** Which day of the challenge (1..CHALLENGE_DAYS). */
export function challengeDay() {
  const start = new Date(`${CHALLENGE_START}T00:00:00`)
  const now = new Date(`${today()}T00:00:00`)
  const elapsed = Math.floor((now - start) / 86_400_000) + 1
  return Math.min(Math.max(elapsed, 1), CHALLENGE_DAYS)
}

/** Today's rotating fun fact for a pillar. */
export function funFactFor(pillarId) {
  const facts = FUN_FACTS[pillarId] ?? []
  if (facts.length === 0) return ''
  const index = (challengeDay() - 1) % facts.length
  return facts[index]
}

/** Which unlocks a member has reached, by total points. */
export function unlockedIds(points) {
  return UNLOCKS.filter((u) => points >= u.threshold).map((u) => u.id)
}

export function avatarColor(index = 0) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length] ?? AVATAR_COLORS[0]
}

export function avatarSkin(index = 0) {
  return SKINS[index % SKINS.length] ?? SKINS[0]
}

/** Create a fresh member record. */
export function createMember({ name, skinIndex, isAdmin = false, id, bio = '' }) {
  return {
    id: id ?? `user_${Date.now()}`,
    name,
    bio,
    skinIndex,
    colorIndex: skinIndex % AVATAR_COLORS.length,
    points: 0,
    streak: 0,
    medals: [], // kept for backward-compat with old rows; unused by the UI
    checkIns: 0,
    messageCount: 0,
    isAdmin,
    joinDate: today(),
    lastActive: today(),
    history: [],
  }
}

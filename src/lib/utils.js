// ═══════════════════════════════════════════════════════════
//  Shared helpers
// ═══════════════════════════════════════════════════════════
import { AVATAR_COLORS, SKINS } from '../constants'

/** Local date as YYYY-MM-DD (used to gate one check-in per day). */
export function today() {
  return new Date().toLocaleDateString('en-CA')
}

/** Human-friendly relative time in Arabic. */
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

/** Look up an avatar's colour pair safely. */
export function avatarColor(index = 0) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length] ?? AVATAR_COLORS[0]
}

/** Look up an avatar's emoji safely. */
export function avatarSkin(index = 0) {
  return SKINS[index % SKINS.length] ?? SKINS[0]
}

/** Create a fresh member record. */
export function createMember({ name, skinIndex, isAdmin = false, id }) {
  return {
    id: id ?? `user_${Date.now()}`,
    name,
    skinIndex,
    colorIndex: skinIndex % AVATAR_COLORS.length,
    points: 0,
    streak: 0,
    medals: [],
    checkIns: 0,
    messageCount: 0,
    isAdmin,
    joinDate: today(),
    lastActive: today(),
    history: [], // [{ date, points, log: { pillarId: tier } }]
  }
}

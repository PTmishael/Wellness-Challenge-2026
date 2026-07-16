// ═══════════════════════════════════════════════════════════
//  Medal-award logic, kept separate so it's easy to extend.
// ═══════════════════════════════════════════════════════════

/**
 * Given the member's state after a check-in, return the list of
 * medal IDs they should now hold, plus which ones are brand new.
 */
export function evaluateMedals({ current = [], checkIns, streak, totalPoints, dayPoints, messageCount = 0 }) {
  const medals = [...current]
  const newlyEarned = []

  const award = (id) => {
    if (!medals.includes(id)) {
      medals.push(id)
      newlyEarned.push(id)
    }
  }

  if (checkIns >= 1) award('first_checkin')
  if (streak >= 3) award('streak_3')
  if (streak >= 7) award('streak_7')
  if (dayPoints === 15) award('all_gold') // all 5 pillars at gold
  if (totalPoints >= 25) award('points_25')
  if (totalPoints >= 50) award('points_50')
  if (messageCount >= 5) award('social_5')

  return { medals, newlyEarned }
}

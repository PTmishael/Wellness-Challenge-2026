// ═══════════════════════════════════════════════════════════
//  (Deprecated) The app moved from medals to a pure points +
//  unlocks system. This stub remains only so any lingering
//  import resolves; it awards nothing.
// ═══════════════════════════════════════════════════════════
export function evaluateMedals({ current = [] }) {
  return { medals: current, newlyEarned: [] }
}

// ═══════════════════════════════════════════════════════════
//  Coach tracking — read a member's history into a simple
//  "yesterday vs today" view, and draft a note of encouragement.
// ═══════════════════════════════════════════════════════════
import { PILLARS } from '../constants'
import { today, arabicDigits } from './utils'

/** Local date string for N days before today. */
export function dayOffset(days) {
  const d = new Date(`${today()}T00:00:00`)
  d.setDate(d.getDate() - days)
  return d.toLocaleDateString('en-CA')
}

/** The check-in a member logged on a given date, if any. */
function entryFor(member, date) {
  return (member.history ?? []).find((e) => e.date === date) ?? null
}

/**
 * Per-pillar scores for yesterday and today.
 * A null score means she didn't log that pillar that day.
 */
export function pillarComparison(member) {
  const todayEntry = entryFor(member, today())
  const yesterdayEntry = entryFor(member, dayOffset(1))

  return PILLARS.map((pillar) => {
    const now = todayEntry?.log?.[pillar.id] ?? null
    const before = yesterdayEntry?.log?.[pillar.id] ?? null

    let trend = 'same'
    if (now !== null && before !== null) {
      if (now > before) trend = 'up'
      else if (now < before) trend = 'down'
    }

    return { id: pillar.id, name: pillar.name, before, now, trend }
  })
}

export function checkedInToday(member) {
  return Boolean(entryFor(member, today()))
}

/** How many days since her last check-in; null if she never has. */
export function daysSinceLastCheckIn(member) {
  const dates = (member.history ?? []).map((e) => e.date).sort()
  const last = dates[dates.length - 1]
  if (!last) return null

  const diff = Math.round(
    (new Date(`${today()}T00:00:00`) - new Date(`${last}T00:00:00`)) / 86_400_000
  )
  return diff
}

/**
 * A short note built from her real numbers — praise what improved,
 * flag what slipped, and pick one thing to watch.
 */
export function encouragementFor(member) {
  const rows = pillarComparison(member)
  const logged = checkedInToday(member)

  if (!logged) {
    const gap = daysSinceLastCheckIn(member)
    if (gap === null) return `${member.name}، ننتظرك تسجّلين أول إنجاز لك 🌿`
    if (gap <= 1) return `${member.name}، ما سجّلتِ اليوم — دقيقة وتخلصين 💚`
    return `${member.name}، صار لك ${arabicDigits(gap)} أيام ما سجّلتِ. وحشتينا! رجعي معنا 🤍`
  }

  const improved = rows.filter((r) => r.trend === 'up')
  const dropped = rows.filter((r) => r.trend === 'down')
  const perfect = rows.filter((r) => r.now === 2)
  const weakest = rows.filter((r) => r.now === 1)

  const parts = [`${member.name}،`]

  if (improved.length > 0) {
    const first = improved[0]
    parts.push(
      `أمس ${first.name} +${arabicDigits(first.before)} واليوم +${arabicDigits(first.now)} 👏`
    )
    if (improved.length > 1) parts.push(`و${improved[1].name} بعد تحسّنت!`)
  } else if (perfect.length >= 3) {
    parts.push(`ما شاء الله، ${arabicDigits(perfect.length)} أعمدة كاملة اليوم 🌟`)
  } else {
    parts.push('سجّلتِ اليوم 👏')
  }

  if (dropped.length > 0) {
    parts.push(`بس خلينا ننتبه لـ${dropped[0].name} 🌙`)
  } else if (weakest.length > 0) {
    parts.push(`بس خلينا ننتبه لـ${weakest[0].name} 🌙`)
  }

  return parts.join(' ')
}

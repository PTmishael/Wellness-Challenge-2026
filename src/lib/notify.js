// ═══════════════════════════════════════════════════════════
//  Browser notifications — safely.
//
//  Chrome on Android refuses `new Notification()` outright and demands a
//  service worker, so calling it directly throws and can crash the app.
//  Everything here is guarded: if notifications aren't possible on this
//  device, we simply report that and carry on.
// ═══════════════════════════════════════════════════════════

/** Remembered once we discover this device won't allow direct notifications. */
let blocked = false

/** Can this device show notifications at all? */
export function canNotify() {
  return !blocked && typeof window !== 'undefined' && typeof Notification !== 'undefined'
}

/** Current permission, or 'unsupported'. */
export function notifyPermission() {
  if (!canNotify()) return 'unsupported'
  try {
    return Notification.permission
  } catch {
    blocked = true
    return 'unsupported'
  }
}

/** Ask for permission. Never throws. */
export async function requestNotifyPermission() {
  if (!canNotify()) return 'unsupported'
  try {
    return await Notification.requestPermission()
  } catch {
    blocked = true
    return 'unsupported'
  }
}

/**
 * Show a notification. Returns true only if one was actually shown.
 *
 * On Android Chrome the constructor throws — we catch it, remember that
 * this device can't do it, and return false so callers can hide the UI.
 */
export function showNotification(title, options = {}) {
  if (!canNotify()) return false
  try {
    if (Notification.permission !== 'granted') return false
    new Notification(title, options)
    return true
  } catch (error) {
    // Android Chrome: "Illegal constructor. Use ServiceWorkerRegistration…"
    blocked = true
    console.info('Direct notifications unavailable on this device:', error.message)
    return false
  }
}

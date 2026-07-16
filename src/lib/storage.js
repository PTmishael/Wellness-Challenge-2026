// ═══════════════════════════════════════════════════════════
//  Persistence layer — pure localStorage, no backend needed.
//
//  Everything is stored on the user's own device. If you later
//  want a shared, cross-device database, swap the four functions
//  below for API calls (Firebase, Supabase, your own server) —
//  the rest of the app does not need to change.
// ═══════════════════════════════════════════════════════════

const PREFIX = 'wellness_challenge:'

export const KEYS = {
  MEMBERS: PREFIX + 'members',   // { [id]: Member }
  CHAT: PREFIX + 'chat',         // ChatMessage[]
  SESSION: PREFIX + 'session',   // { userId, date, todayLog, checkedIn }
}

export function read(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (err) {
    console.warn('storage.read failed for', key, err)
    return fallback
  }
}

export function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (err) {
    console.warn('storage.write failed for', key, err)
    return false
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch (err) {
    console.warn('storage.remove failed for', key, err)
    return false
  }
}

/** Wipe all app data. Used by the admin "reset" action. */
export function clearAll() {
  Object.values(KEYS).forEach(remove)
}

// ── Domain helpers ────────────────────────────────────────

export const getMembers = () => read(KEYS.MEMBERS, {})
export const saveMembers = (members) => write(KEYS.MEMBERS, members)

export function upsertMember(member) {
  const members = getMembers()
  members[member.id] = member
  saveMembers(members)
  return member
}

export function deleteMember(id) {
  const members = getMembers()
  delete members[id]
  saveMembers(members)
  return members
}

export const getChat = () => read(KEYS.CHAT, [])
export const saveChat = (messages) => write(KEYS.CHAT, messages)

export const getSession = () => read(KEYS.SESSION, null)
export const saveSession = (session) => write(KEYS.SESSION, session)
export const clearSession = () => remove(KEYS.SESSION)

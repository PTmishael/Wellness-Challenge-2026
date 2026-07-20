// ═══════════════════════════════════════════════════════════
//  Data layer
//
//  Members and chat messages live in Supabase, so every member
//  sees the same data from any device.
//
//  The only thing kept on the device is the session: who is
//  logged in on THIS phone, and today's in-progress check-in.
// ═══════════════════════════════════════════════════════════
import { supabase, isConfigured } from './supabase'

export { isConfigured }

const SESSION_KEY = 'wellness_challenge:session'

/* ── Device-local helpers (session + small prefs) ────────── */

export function read(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export const getSession = () => read(SESSION_KEY, null)
export const saveSession = (session) => write(SESSION_KEY, session)
export const clearSession = () => remove(SESSION_KEY)

/* ── Row ⇄ object mapping ────────────────────────────────── */

function memberFromRow(row) {
  return {
    id: row.id,
    name: row.name,
    bio: row.bio ?? '',
    password: row.password ?? '',
    skinIndex: row.skin_index ?? 0,
    colorIndex: row.color_index ?? 0,
    points: row.points ?? 0,
    streak: row.streak ?? 0,
    medals: row.medals ?? [],
    checkIns: row.check_ins ?? 0,
    messageCount: row.message_count ?? 0,
    isAdmin: Boolean(row.is_admin),
    joinDate: row.join_date ?? '',
    lastActive: row.last_active ?? '',
    history: row.history ?? [],
  }
}

function memberToRow(member) {
  return {
    id: member.id,
    name: member.name,
    bio: member.bio ?? '',
    password: member.password ?? '',
    skin_index: member.skinIndex ?? 0,
    color_index: member.colorIndex ?? 0,
    points: member.points ?? 0,
    streak: member.streak ?? 0,
    medals: member.medals ?? [],
    check_ins: member.checkIns ?? 0,
    message_count: member.messageCount ?? 0,
    is_admin: Boolean(member.isAdmin),
    join_date: member.joinDate ?? '',
    last_active: member.lastActive ?? '',
    history: member.history ?? [],
  }
}

function messageFromRow(row) {
  return {
    id: row.id,
    authorId: row.author_id,
    authorName: row.author_name,
    authorPoints: row.author_points ?? 0,
    skinIndex: row.skin_index ?? 0,
    colorIndex: row.color_index ?? 0,
    isAdmin: Boolean(row.is_admin),
    text: row.text ?? '',
    replyTo: row.reply_to ?? null,
    pinned: Boolean(row.pinned),
    createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
  }
}

function messageToRow(message) {
  return {
    id: message.id,
    author_id: message.authorId,
    author_name: message.authorName,
    author_points: message.authorPoints ?? 0,
    skin_index: message.skinIndex ?? 0,
    color_index: message.colorIndex ?? 0,
    is_admin: Boolean(message.isAdmin),
    text: message.text ?? '',
    reply_to: message.replyTo ?? null,
    pinned: Boolean(message.pinned),
  }
}

/* ── Members ─────────────────────────────────────────────── */

/** All members, keyed by id. Returns {} on failure. */
export async function fetchMembers() {
  if (!isConfigured) return {}
  const { data, error } = await supabase.from('members').select('*')
  if (error) {
    console.error('fetchMembers failed:', error.message)
    return {}
  }
  return Object.fromEntries(data.map((row) => [row.id, memberFromRow(row)]))
}

export async function fetchMemberById(id) {
  if (!isConfigured || !id) return null
  const { data, error } = await supabase.from('members').select('*').eq('id', id).maybeSingle()
  if (error) {
    console.error('fetchMemberById failed:', error.message)
    return null
  }
  return data ? memberFromRow(data) : null
}

export async function fetchMemberByName(name) {
  if (!isConfigured || !name) return null
  const { data, error } = await supabase.from('members').select('*').eq('name', name).maybeSingle()
  if (error) {
    console.error('fetchMemberByName failed:', error.message)
    return null
  }
  return data ? memberFromRow(data) : null
}

/** Insert or update a member. Returns the saved member, or null on failure. */
export async function saveMember(member) {
  if (!isConfigured) return null
  const { data, error } = await supabase
    .from('members')
    .upsert(memberToRow(member))
    .select()
    .single()
  if (error) {
    console.error('saveMember failed:', error.message)
    return null
  }
  return memberFromRow(data)
}

export async function deleteMember(id) {
  if (!isConfigured) return false
  const { error } = await supabase.from('members').delete().eq('id', id)
  if (error) {
    console.error('deleteMember failed:', error.message)
    return false
  }
  return true
}

/* ── Chat ────────────────────────────────────────────────── */

/** Newest first, pinned messages hoisted to the top. */
export async function fetchMessages(limit = 200) {
  if (!isConfigured) return []
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.error('fetchMessages failed:', error.message)
    return []
  }
  const messages = data.map(messageFromRow)
  return [...messages.filter((m) => m.pinned), ...messages.filter((m) => !m.pinned)]
}

export async function addMessage(message) {
  if (!isConfigured) return null
  const { data, error } = await supabase.from('messages').insert(messageToRow(message)).select().single()
  if (error) {
    console.error('addMessage failed:', error.message)
    return null
  }
  return messageFromRow(data)
}

export async function patchMessage(id, patch) {
  if (!isConfigured) return false
  const row = {}
  if ('text' in patch) row.text = patch.text
  if ('pinned' in patch) row.pinned = patch.pinned
  const { error } = await supabase.from('messages').update(row).eq('id', id)
  if (error) {
    console.error('patchMessage failed:', error.message)
    return false
  }
  return true
}

export async function deleteMessage(id) {
  if (!isConfigured) return false
  const { error } = await supabase.from('messages').delete().eq('id', id)
  if (error) {
    console.error('deleteMessage failed:', error.message)
    return false
  }
  return true
}

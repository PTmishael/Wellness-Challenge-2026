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

/**
 * The most recent database error message, if any.
 * Screens read this so they can show a real reason instead of a
 * generic "couldn't connect" when something fails.
 */
let lastError = null
export const getLastError = () => lastError
const noteError = (where, error) => {
  lastError = `${where}: ${error.message}`
  console.error(lastError)
}

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
    reactions: row.reactions ?? {},
    imageUrl: row.image_url ?? null,
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
    reactions: message.reactions ?? {},
    image_url: message.imageUrl ?? null,
  }
}

/* ── Members ─────────────────────────────────────────────── */

/** All members, keyed by id. Returns {} on failure. */
export async function fetchMembers() {
  if (!isConfigured) return {}
  const { data, error } = await supabase.from('members').select('*')
  if (error) {
    noteError('fetchMembers', error)
    return {}
  }
  return Object.fromEntries(data.map((row) => [row.id, memberFromRow(row)]))
}

export async function fetchMemberById(id) {
  if (!isConfigured || !id) return null
  const { data, error } = await supabase.from('members').select('*').eq('id', id).maybeSingle()
  if (error) {
    noteError('fetchMemberById', error)
    return null
  }
  return data ? memberFromRow(data) : null
}

export async function fetchMemberByName(name) {
  if (!isConfigured || !name) return null
  const { data, error } = await supabase.from('members').select('*').eq('name', name).maybeSingle()
  if (error) {
    noteError('fetchMemberByName', error)
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
    noteError('saveMember', error)
    return null
  }
  return memberFromRow(data)
}

export async function deleteMember(id) {
  if (!isConfigured) return false
  const { error } = await supabase.from('members').delete().eq('id', id)
  if (error) {
    noteError('deleteMember', error)
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
    noteError('fetchMessages', error)
    return []
  }
  const messages = data.map(messageFromRow)
  return [...messages.filter((m) => m.pinned), ...messages.filter((m) => !m.pinned)]
}

export async function addMessage(message) {
  if (!isConfigured) return null
  const { data, error } = await supabase.from('messages').insert(messageToRow(message)).select().single()
  if (error) {
    noteError('addMessage', error)
    return null
  }
  return messageFromRow(data)
}

export async function patchMessage(id, patch) {
  if (!isConfigured) return false
  const row = {}
  if ('text' in patch) row.text = patch.text
  if ('pinned' in patch) row.pinned = patch.pinned
  if ('reactions' in patch) row.reactions = patch.reactions
  const { error } = await supabase.from('messages').update(row).eq('id', id)
  if (error) {
    noteError('patchMessage', error)
    return false
  }
  return true
}

export async function deleteMessage(id) {
  if (!isConfigured) return false
  const { error } = await supabase.from('messages').delete().eq('id', id)
  if (error) {
    noteError('deleteMessage', error)
    return false
  }
  return true
}

/* ── Plank challenge leaderboard ─────────────────────────── */

function plankFromRow(row) {
  return {
    id: row.id,
    memberId: row.member_id,
    name: row.name,
    seconds: row.seconds ?? 0,
    createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
  }
}

/** Best time per member, longest first. */
export async function fetchPlankBoard(limit = 50) {
  if (!isConfigured) return []
  const { data, error } = await supabase
    .from('plank_scores')
    .select('*')
    .order('seconds', { ascending: false })
    .limit(limit)
  if (error) {
    noteError('fetchPlankBoard', error)
    return []
  }

  // Keep only each member's personal best.
  const best = new Map()
  for (const row of data.map(plankFromRow)) {
    const current = best.get(row.memberId)
    if (!current || row.seconds > current.seconds) best.set(row.memberId, row)
  }
  return [...best.values()].sort((a, b) => b.seconds - a.seconds)
}

/** Remove every attempt by one member — she disappears from the board. */
export async function deletePlankScores(memberId) {
  if (!isConfigured) return false
  const { error } = await supabase.from('plank_scores').delete().eq('member_id', memberId)
  if (error) {
    noteError('deletePlankScores', error)
    return false
  }
  return true
}

/** Record an attempt. Returns the saved row, or null on failure. */
export async function savePlankScore({ memberId, name, seconds }) {
  if (!isConfigured) return null
  const { data, error } = await supabase
    .from('plank_scores')
    .insert({ id: `plank_${Date.now()}`, member_id: memberId, name, seconds })
    .select()
    .single()
  if (error) {
    noteError('savePlankScore', error)
    return null
  }
  return plankFromRow(data)
}

/**
 * Add or remove one member's reaction to a message.
 * Reactions are stored as { "❤️": [memberId, …], … }.
 */
export function reactionEntries(list = []) {
  // Older messages stored plain member ids; newer ones store { id, name }.
  return list.map((entry) =>
    typeof entry === 'string' ? { id: entry, name: 'عضوة' } : entry
  )
}

/** Add or remove one member's reaction, keeping her name for display. */
export function applyReaction(current = {}, emoji, member) {
  const next = { ...current }
  const who = reactionEntries(next[emoji])
  const mine = who.some((entry) => entry.id === member.id)

  const updated = mine
    ? who.filter((entry) => entry.id !== member.id)
    : [...who, { id: member.id, name: member.name }]

  if (updated.length === 0) delete next[emoji]
  else next[emoji] = updated

  return next
}

export async function toggleReaction(messageId, emoji, member, current = {}) {
  const next = applyReaction(current, emoji, member)
  const ok = await patchMessage(messageId, { reactions: next })
  return ok ? next : current
}

/* ── Photo uploads ───────────────────────────────────────── */

/** Bucket must exist in Supabase Storage and be marked public. */
const PHOTO_BUCKET = 'chat-photos'

/**
 * Shrink a photo in the browser before uploading.
 *
 * Phone photos are 3-5MB each, which would fill the free storage tier in
 * weeks and crawl on mobile data. Resizing to ~1200px puts them near
 * 300KB with no visible loss in a chat bubble.
 */
export function compressImage(file, maxSize = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('تعذّرت قراءة الصورة'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('تعذّر فتح الصورة'))
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('تعذّر ضغط الصورة'))),
          'image/jpeg',
          quality
        )
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Upload a chat photo and return its public URL.
 *
 * ⚠️ The bucket is public: anyone holding the URL can open the image, and
 * that stays true after the message is deleted from the chat. Deleting a
 * message hides it from the group; it does not unpublish the file.
 */
export async function uploadChatPhoto(file, memberId) {
  if (!isConfigured) return null

  try {
    const blob = await compressImage(file)
    const path = `${memberId}/${Date.now()}.jpg`

    const { error } = await supabase.storage
      .from(PHOTO_BUCKET)
      .upload(path, blob, { contentType: 'image/jpeg', upsert: false })

    if (error) {
      noteError('uploadChatPhoto', error)
      return null
    }

    const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path)
    return data?.publicUrl ?? null
  } catch (error) {
    noteError('uploadChatPhoto', error)
    return null
  }
}

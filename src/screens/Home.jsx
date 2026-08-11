import { useCallback, useEffect, useRef, useState } from 'react'
import BottomNav from '../components/BottomNav'
import HomeTab from '../tabs/HomeTab'
import CheckInFlow from '../tabs/CheckInFlow'
import ChatTab from '../tabs/ChatTab'
import AchievementsTab from '../tabs/AchievementsTab'
import BrainGamesTab from '../tabs/BrainGamesTab'
import MembersTab from '../tabs/MembersTab'
import { PILLARS } from '../constants'
import {
  fetchMembers,
  saveMember,
  deleteMember,
  fetchMessages,
  addMessage,
  patchMessage,
  deleteMessage,
  toggleReaction,
  saveSession,
  read,
  write,
} from '../lib/storage'
import { today, unlockedIds } from '../lib/utils'

const CHAT_POLL_MS = 8000

export default function Home({ member: initialMember, isAdmin, initialSession, onSignOut }) {
  const [member, setMember] = useState(initialMember)
  const [members, setMembers] = useState({})
  const [chat, setChat] = useState([])
  const [tab, setTab] = useState('home')
  const [checkingIn, setCheckingIn] = useState(false)

  const [checkedIn, setCheckedIn] = useState(initialSession?.checkedIn ?? false)
  const lastSeenId = useRef(null)

  // Messages newer than this (and not her own) count as unread.
  const seenKey = `wellness_challenge:lastRead:${member.id}`
  const [lastReadAt, setLastReadAt] = useState(() => read(seenKey, 0))
  const [unread, setUnread] = useState(0)
  const [toast, setToast] = useState(null)

  const persistMember = useCallback(async (next) => {
    const stamped = { ...next, lastActive: today() }
    setMember(stamped)
    const saved = await saveMember(stamped)
    if (saved) setMember(saved)
    return saved ?? stamped
  }, [])

  const refreshChat = useCallback(
    async ({ notify = false } = {}) => {
      const messages = await fetchMessages()
      setChat(messages)

      // Count what arrived from other members since she last opened سواليف.
      const unseen = messages.filter(
        (m) => m.authorId !== member.id && (m.createdAt ?? 0) > lastReadAt
      ).length
      setUnread(unseen)

      const newest = messages[0]
      if (!newest) return
      if (notify && lastSeenId.current && newest.id !== lastSeenId.current) {
        const mine = newest.authorId === member.id
        const enabled = read(`wellness_challenge:notify:${member.id}`, 'off') === 'on'
        if (!mine && enabled && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          new Notification(newest.authorName ?? 'رسالة جديدة', { body: String(newest.text ?? '').slice(0, 90) })
        }
      }
      lastSeenId.current = newest.id
    },
    [member.id, lastReadAt]
  )

  useEffect(() => {
    refreshChat()
    const timer = setInterval(() => refreshChat({ notify: true }), CHAT_POLL_MS)
    return () => clearInterval(timer)
  }, [refreshChat])

  const refreshMembers = useCallback(async () => {
    setMembers(await fetchMembers())
  }, [])

  useEffect(() => {
    if (isAdmin && tab === 'members') refreshMembers()
  }, [isAdmin, tab, refreshMembers])

  // Opening سواليف clears the badge.
  useEffect(() => {
    if (tab !== 'chat') return
    const now = Date.now()
    setLastReadAt(now)
    setUnread(0)
    write(seenKey, now)
  }, [tab, chat.length, seenKey])

  useEffect(() => {
    saveSession({ userId: member.id, date: today(), todayLog: {}, checkedIn })
  }, [member.id, checkedIn])

  /* ── Check-in complete ────────────────────────────────── */
  async function handleCheckInComplete(log, dayPoints) {
    const streak = member.streak + 1
    const before = member.points
    const totalPoints = before + dayPoints
    const checkIns = (member.checkIns ?? 0) + 1

    const history = [...(member.history ?? []), { date: today(), points: dayPoints, log }]
    const updated = await persistMember({ ...member, points: totalPoints, streak, checkIns, history })

    // Auto-post the summary — one line per pillar.
    const summaryLines = Object.entries(log)
      .map(([pillarId, pts]) => {
        const pillar = PILLARS.find((p) => p.id === pillarId)
        return pillar ? `${pillar.name}: +${pts}` : ''
      })
      .filter(Boolean)

    await addMessage({
      id: `checkin_${Date.now()}`,
      authorId: updated.id,
      authorName: updated.name,
      authorPoints: updated.points,
      skinIndex: updated.skinIndex,
      colorIndex: updated.colorIndex,
      isAdmin,
      text: `متابعة اليوم 🌟\n${summaryLines.join('\n')}\nالمجموع: ${dayPoints} نقاط`,
      replyTo: null,
      pinned: false,
    })
    await refreshChat()

    setCheckedIn(true)
    setCheckingIn(false)

    // Celebrate a fresh unlock, if one was crossed.
    const newlyUnlocked = unlockedIds(totalPoints).filter((id) => !unlockedIds(before).includes(id))
    if (newlyUnlocked.length > 0) {
      setToast('🔓 فتحتِ محتوى جديد في صفحة الإنجازات!')
      setTimeout(() => setToast(null), 4000)
    }
    setTab('home')
  }

  /* ── Chat ─────────────────────────────────────────────── */
  async function handleSendMessage(text, replyTo = null, imageUrl = null) {
    const messageCount = (member.messageCount ?? 0) + 1
    const updated = await persistMember({ ...member, messageCount })
    await addMessage({
      id: `msg_${Date.now()}`,
      authorId: updated.id,
      authorName: updated.name,
      authorPoints: updated.points,
      skinIndex: updated.skinIndex,
      colorIndex: updated.colorIndex,
      isAdmin,
      text,
      replyTo: replyTo ? { name: replyTo.name, snippet: replyTo.snippet } : null,
      pinned: false,
      imageUrl,
    })
    await refreshChat()
  }

  async function handleEditMessage(id, text) {
    setChat((prev) => prev.map((m) => (m.id === id ? { ...m, text } : m)))
    await patchMessage(id, { text })
    await refreshChat()
  }
  async function handleTogglePin(id) {
    const target = chat.find((m) => m.id === id)
    if (!target) return
    await patchMessage(id, { pinned: !target.pinned })
    await refreshChat()
  }
  async function handleReact(id, emoji, current) {
    // Update on screen straight away, then persist.
    const optimistic = { ...current }
    const who = new Set(optimistic[emoji] ?? [])
    if (who.has(member.id)) who.delete(member.id)
    else who.add(member.id)
    if (who.size === 0) delete optimistic[emoji]
    else optimistic[emoji] = [...who]

    setChat((prev) => prev.map((m) => (m.id === id ? { ...m, reactions: optimistic } : m)))
    await toggleReaction(id, emoji, member.id, current)
    await refreshChat()
  }

  async function handleDeleteMessage(id) {
    setChat((prev) => prev.filter((m) => m.id !== id))
    await deleteMessage(id)
    await refreshChat()
  }

  async function handleDeleteMember(id) {
    setMembers((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    await deleteMember(id)
    await refreshMembers()
  }

  // The check-in flow takes over the whole screen (no bottom nav).
  if (checkingIn) {
    return <CheckInFlow onComplete={handleCheckInComplete} onCancel={() => setCheckingIn(false)} />
  }

  return (
    <>
      {tab === 'home' && (
        <HomeTab member={member} checkedIn={checkedIn} onStartCheckIn={() => setCheckingIn(true)} onSignOut={onSignOut} />
      )}

      {tab === 'chat' && (
        <ChatTab
          member={member}
          isAdmin={isAdmin}
          messages={chat}
          onSend={handleSendMessage}
          onEdit={handleEditMessage}
          onTogglePin={handleTogglePin}
          onDelete={handleDeleteMessage}
          onReact={handleReact}
          onSignOut={onSignOut}
        />
      )}

      {tab === 'achievements' && <AchievementsTab member={member} isAdmin={isAdmin} />}

      {tab === 'games' && <BrainGamesTab />}

      {tab === 'members' && isAdmin && (
        <MembersTab members={members} onDeleteMember={handleDeleteMember} />
      )}

      <BottomNav active={tab} onChange={setTab} dark={tab === 'chat'} badges={{ chat: unread }} />

      {isAdmin && (
        <button className="admin-fab" onClick={() => setTab('members')} title="لوحة الإدارة">
          👑
        </button>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}

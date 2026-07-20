import { useCallback, useEffect, useRef, useState } from 'react'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import MedalPopup from '../components/MedalPopup'
import ChallengeTab from '../tabs/ChallengeTab'
import ChatTab from '../tabs/ChatTab'
import MedalsTab from '../tabs/MedalsTab'
import MembersTab from '../tabs/MembersTab'
import { PILLARS, TIER_POINTS, TIER_EMOJI } from '../constants'
import {
  fetchMembers,
  saveMember,
  deleteMember,
  fetchMessages,
  addMessage,
  patchMessage,
  deleteMessage,
  saveSession,
  read,
} from '../lib/storage'
import { evaluateMedals } from '../lib/medals'
import { today } from '../lib/utils'

/** How often to pull new chat messages from the database. */
const CHAT_POLL_MS = 8000

export default function Home({ member: initialMember, isAdmin, initialSession, onSignOut }) {
  const [member, setMember] = useState(initialMember)
  const [members, setMembers] = useState({})
  const [chat, setChat] = useState([])
  const [tab, setTab] = useState('challenge')

  const [todayLog, setTodayLog] = useState(initialSession?.todayLog ?? {})
  const [checkedIn, setCheckedIn] = useState(initialSession?.checkedIn ?? false)
  const [newMedal, setNewMedal] = useState(null)

  // Remember the newest message we've seen, so polling can spot arrivals.
  const lastSeenId = useRef(null)

  const persistMember = useCallback(async (next) => {
    const stamped = { ...next, lastActive: today() }
    setMember(stamped) // optimistic — the UI shouldn't wait on the network
    const saved = await saveMember(stamped)
    if (saved) setMember(saved)
    return saved ?? stamped
  }, [])

  /* ── Load chat, and keep it fresh ─────────────────────── */
  const refreshChat = useCallback(
    async ({ notify = false } = {}) => {
      const messages = await fetchMessages()
      setChat(messages)

      const newest = messages[0]
      if (!newest) return

      if (notify && lastSeenId.current && newest.id !== lastSeenId.current) {
        const mine = newest.authorId === member.id
        const enabled = read(`wellness_challenge:notify:${member.id}`, 'off') === 'on'
        if (
          !mine &&
          enabled &&
          typeof Notification !== 'undefined' &&
          Notification.permission === 'granted'
        ) {
          new Notification(newest.authorName ?? 'رسالة جديدة', {
            body: String(newest.text ?? '').slice(0, 90),
          })
        }
      }
      lastSeenId.current = newest.id
    },
    [member.id]
  )

  useEffect(() => {
    refreshChat()
    const timer = setInterval(() => refreshChat({ notify: true }), CHAT_POLL_MS)
    return () => clearInterval(timer)
  }, [refreshChat])

  /* ── Admin: load the roster when that tab opens ───────── */
  const refreshMembers = useCallback(async () => {
    setMembers(await fetchMembers())
  }, [])

  useEffect(() => {
    if (isAdmin && tab === 'members') refreshMembers()
  }, [isAdmin, tab, refreshMembers])

  /* ── Keep today's selections on this device ───────────── */
  useEffect(() => {
    saveSession({ userId: member.id, date: today(), todayLog, checkedIn })
  }, [member.id, todayLog, checkedIn])

  /* ── Challenge ────────────────────────────────────────── */
  function handleToggleTier(pillarId, tier) {
    if (checkedIn && !isAdmin) return
    setTodayLog((prev) => {
      const next = { ...prev }
      if (next[pillarId] === tier) delete next[pillarId]
      else next[pillarId] = tier
      return next
    })
  }

  async function handleSubmitCheckIn() {
    if (Object.keys(todayLog).length === 0) return

    const dayPoints = Object.values(todayLog).reduce(
      (sum, tier) => sum + (TIER_POINTS[tier] ?? 0),
      0
    )

    // An admin re-submitting shouldn't inflate her own stats.
    const streak = checkedIn ? member.streak : member.streak + 1
    const totalPoints = checkedIn ? member.points : member.points + dayPoints
    const checkIns = checkedIn ? member.checkIns : (member.checkIns ?? 0) + 1

    const { medals, newlyEarned } = evaluateMedals({
      current: member.medals,
      checkIns,
      streak,
      totalPoints,
      dayPoints,
      messageCount: member.messageCount ?? 0,
    })

    const history = [
      ...(member.history ?? []),
      { date: today(), points: dayPoints, log: { ...todayLog } },
    ]

    const updated = await persistMember({
      ...member,
      points: totalPoints,
      streak,
      checkIns,
      medals,
      history,
    })

    // Post the summary to the chat — one line per pillar.
    const summaryLines = Object.entries(todayLog)
      .map(([pillarId, tier]) => {
        const pillar = PILLARS.find((p) => p.id === pillarId)
        return pillar ? `${pillar.name} ${TIER_EMOJI[tier]}` : ''
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
      text: `متابعة اليوم\n${summaryLines.join('\n')}\nالمجموع: ${dayPoints} نقاط`,
      replyTo: null,
      pinned: false,
    })
    await refreshChat()

    setCheckedIn(true)
    if (newlyEarned.length > 0) setNewMedal(newlyEarned[0])
  }

  /* ── Chat ─────────────────────────────────────────────── */
  async function handleSendMessage(text, replyTo = null) {
    const messageCount = (member.messageCount ?? 0) + 1

    const { medals, newlyEarned } = evaluateMedals({
      current: member.medals,
      checkIns: member.checkIns ?? 0,
      streak: member.streak,
      totalPoints: member.points,
      dayPoints: 0,
      messageCount,
    })

    const updated = await persistMember({ ...member, messageCount, medals })

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
    })
    await refreshChat()

    if (newlyEarned.length > 0) setNewMedal(newlyEarned[0])
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

  async function handleDeleteMessage(id) {
    setChat((prev) => prev.filter((m) => m.id !== id))
    await deleteMessage(id)
    await refreshChat()
  }

  /* ── Admin ────────────────────────────────────────────── */
  async function handleDeleteMember(id) {
    setMembers((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    await deleteMember(id)
    await refreshMembers()
  }

  return (
    <>
      {tab !== 'challenge' && <TopBar member={member} isAdmin={isAdmin} onSignOut={onSignOut} />}

      {tab === 'challenge' && (
        <ChallengeTab
          member={member}
          isAdmin={isAdmin}
          todayLog={todayLog}
          checkedIn={checkedIn}
          onToggleTier={handleToggleTier}
          onSubmit={handleSubmitCheckIn}
          onSignOut={onSignOut}
        />
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
        />
      )}

      {tab === 'medals' && <MedalsTab member={member} />}

      {tab === 'members' && isAdmin && (
        <MembersTab members={members} onDeleteMember={handleDeleteMember} />
      )}

      <BottomNav active={tab} onChange={setTab} isAdmin={isAdmin} />

      <MedalPopup medalId={newMedal} onDismiss={() => setNewMedal(null)} />
    </>
  )
}

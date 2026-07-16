import { useCallback, useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import MedalPopup from '../components/MedalPopup'
import ChallengeTab from '../tabs/ChallengeTab'
import ChatTab from '../tabs/ChatTab'
import CoachTab from '../tabs/CoachTab'
import MedalsTab from '../tabs/MedalsTab'
import MembersTab from '../tabs/MembersTab'
import {
  PILLARS,
  TIER_POINTS,
  TIER_EMOJI,
  MAX_CHAT_MESSAGES,
} from '../constants'
import {
  getMembers,
  upsertMember,
  deleteMember as removeMember,
  getChat,
  saveChat,
  saveSession,
} from '../lib/storage'
import { evaluateMedals } from '../lib/medals'
import { today } from '../lib/utils'

export default function Home({ member: initialMember, isAdmin, initialSession, onSignOut }) {
  const [member, setMember] = useState(initialMember)
  const [members, setMembers] = useState(() => getMembers())
  const [chat, setChat] = useState(() => getChat())
  const [tab, setTab] = useState('challenge')

  const [todayLog, setTodayLog] = useState(initialSession?.todayLog ?? {})
  const [checkedIn, setCheckedIn] = useState(initialSession?.checkedIn ?? false)
  const [newMedal, setNewMedal] = useState(null)

  // Persist any member change to storage + refresh the members map.
  const persistMember = useCallback((next) => {
    const stamped = { ...next, lastActive: today() }
    upsertMember(stamped)
    setMember(stamped)
    setMembers(getMembers())
    return stamped
  }, [])

  const persistChat = useCallback((next) => {
    const trimmed = next.slice(0, MAX_CHAT_MESSAGES)
    saveChat(trimmed)
    setChat(trimmed)
  }, [])

  // Keep the day's in-progress selections in the session.
  useEffect(() => {
    saveSession({
      userId: member.id,
      date: today(),
      todayLog,
      checkedIn,
    })
  }, [member.id, todayLog, checkedIn])

  // ── Challenge actions ───────────────────────────────
  function handleToggleTier(pillarId, tier) {
    if (checkedIn && !isAdmin) return

    setTodayLog((prev) => {
      const next = { ...prev }
      if (next[pillarId] === tier) delete next[pillarId]
      else next[pillarId] = tier
      return next
    })
  }

  function handleSubmitCheckIn() {
    const selected = Object.keys(todayLog)
    if (selected.length === 0) return

    const dayPoints = Object.values(todayLog).reduce(
      (sum, tier) => sum + (TIER_POINTS[tier] ?? 0),
      0
    )

    // Admin can re-submit without inflating their own stats.
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

    const updated = persistMember({
      ...member,
      points: totalPoints,
      streak,
      checkIns,
      medals,
      history,
    })

    // Auto-post the check-in summary to the chat.
    const summary = Object.entries(todayLog)
      .map(([pillarId, tier]) => {
        const pillar = PILLARS.find((p) => p.id === pillarId)
        return pillar ? `${pillar.icon}${TIER_EMOJI[tier]}` : ''
      })
      .filter(Boolean)
      .join(' ')

    persistChat([
      {
        id: `checkin_${Date.now()}`,
        authorId: updated.id,
        authorName: updated.name,
        authorPoints: updated.points,
        skinIndex: updated.skinIndex,
        colorIndex: updated.colorIndex,
        isAdmin,
        text: `متابعة اليوم! ${summary} — ${dayPoints} نقاط 🌟`,
        pinned: false,
        createdAt: Date.now(),
      },
      ...chat,
    ])

    setCheckedIn(true)
    if (newlyEarned.length > 0) setNewMedal(newlyEarned[0])
  }

  // ── Chat actions ────────────────────────────────────
  function handleSendMessage(text) {
    const messageCount = (member.messageCount ?? 0) + 1

    const { medals, newlyEarned } = evaluateMedals({
      current: member.medals,
      checkIns: member.checkIns ?? 0,
      streak: member.streak,
      totalPoints: member.points,
      dayPoints: 0,
      messageCount,
    })

    const updated = persistMember({ ...member, messageCount, medals })

    persistChat([
      {
        id: `msg_${Date.now()}`,
        authorId: updated.id,
        authorName: updated.name,
        authorPoints: updated.points,
        skinIndex: updated.skinIndex,
        colorIndex: updated.colorIndex,
        isAdmin,
        text,
        pinned: false,
        createdAt: Date.now(),
      },
      ...chat,
    ])

    if (newlyEarned.length > 0) setNewMedal(newlyEarned[0])
  }

  function handleEditMessage(id, text) {
    persistChat(chat.map((m) => (m.id === id ? { ...m, text } : m)))
  }

  function handleTogglePin(id) {
    const toggled = chat.map((m) => (m.id === id ? { ...m, pinned: !m.pinned } : m))
    // Pinned messages float to the top of the stored array (= bottom of the rendered list).
    persistChat([...toggled.filter((m) => m.pinned), ...toggled.filter((m) => !m.pinned)])
  }

  function handleDeleteMessage(id) {
    persistChat(chat.filter((m) => m.id !== id))
  }

  // ── Admin actions ───────────────────────────────────
  function handleDeleteMember(id) {
    setMembers(removeMember(id))
  }

  return (
    <>
      <TopBar member={member} isAdmin={isAdmin} onSignOut={onSignOut} />

      {tab === 'challenge' && (
        <ChallengeTab
          member={member}
          isAdmin={isAdmin}
          todayLog={todayLog}
          checkedIn={checkedIn}
          onToggleTier={handleToggleTier}
          onSubmit={handleSubmitCheckIn}
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

      {tab === 'coach' && (
        <CoachTab member={member} todayLog={todayLog} checkedIn={checkedIn} />
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

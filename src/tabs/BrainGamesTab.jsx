import { useMemo, useRef, useState } from 'react'
import ScenePage from '../components/ScenePage'
import { CROSSWORDS, SCENES } from '../constants'
import { arabicDigits, challengeDay } from '../lib/utils'

/**
 * Arabic crossword. Each puzzle is a "comb": one vertical answer running
 * down `seedCol`, with an across answer on every row crossing it.
 *
 * Cells are right-to-left — index 0 of an answer is the rightmost cell.
 */
export default function BrainGamesTab() {
  // A different puzzle each day, cycling through the set.
  const startIndex = (challengeDay() - 1) % CROSSWORDS.length
  const [puzzleIndex, setPuzzleIndex] = useState(startIndex)
  const puzzle = CROSSWORDS[puzzleIndex]

  const [entries, setEntries] = useState({}) // { "r-c": letter }
  const [checked, setChecked] = useState(false)
  const inputs = useRef({})

  const width = useMemo(
    () => Math.max(...puzzle.rows.map((r) => [...r.answer].length)),
    [puzzle]
  )

  function reset(nextIndex) {
    setPuzzleIndex(nextIndex)
    setEntries({})
    setChecked(false)
  }

  function setCell(r, c, value) {
    // Keep the last character typed, ignore anything else.
    const letter = [...value].slice(-1)[0] ?? ''
    setEntries((prev) => ({ ...prev, [`${r}-${c}`]: letter }))
    setChecked(false)

    // Jump to the next cell in the row once a letter lands.
    if (letter) {
      const next = inputs.current[`${r}-${c + 1}`]
      if (next) next.focus()
    }
  }

  const solvedCount = puzzle.rows.reduce((total, row, r) => {
    const letters = [...row.answer]
    const done = letters.every((ch, c) => entries[`${r}-${c}`] === ch)
    return total + (done ? 1 : 0)
  }, 0)
  const allSolved = solvedCount === puzzle.rows.length

  return (
    <ScenePage scene={SCENES.app}>
      <div style={{ textAlign: 'center' }}>
        <h2 className="scene-title" style={{ fontSize: 21 }}>ألعاب ذهنية</h2>
        <p className="scene-sub" style={{ fontSize: 11.5, marginTop: 4 }}>
          كلمات متقاطعة · لغز {arabicDigits(puzzleIndex + 1)} من {arabicDigits(CROSSWORDS.length)}
        </p>
      </div>

      {/* grid */}
      <div className="xw" style={{ marginTop: 16 }}>
        {puzzle.rows.map((row, r) => {
          const letters = [...row.answer]
          return (
            <div className="xw__row" key={r}>
              <span className="xw__num">{arabicDigits(r + 1)}</span>
              {Array.from({ length: width }).map((_, c) => {
                if (c >= letters.length) return <span className="xw__gap" key={c} />

                const key = `${r}-${c}`
                const value = entries[key] ?? ''
                const isSeed = c === puzzle.seedCol
                const state = !checked || !value ? '' : value === letters[c] ? ' is-right' : ' is-wrong'

                return (
                  <input
                    key={c}
                    ref={(el) => {
                      inputs.current[key] = el
                    }}
                    className={`xw__cell${isSeed ? ' is-seed' : ''}${state}`}
                    value={value}
                    onChange={(e) => setCell(r, c, e.target.value)}
                    inputMode="text"
                    autoComplete="off"
                    aria-label={`صف ${r + 1} خانة ${c + 1}`}
                  />
                )
              })}
            </div>
          )
        })}
      </div>

      {/* status */}
      <div style={{ textAlign: 'center', marginTop: 10, minHeight: 20 }}>
        {allSolved ? (
          <span className="scene-title" style={{ fontSize: 13.5 }}>ما شاء الله! كملّتيها 🌿</span>
        ) : checked ? (
          <span className="scene-sub" style={{ fontSize: 12.5 }}>
            حلّيتِ {arabicDigits(solvedCount)} من {arabicDigits(puzzle.rows.length)} كلمات
          </span>
        ) : null}
      </div>

      {/* clues */}
      <div className="scene-card" style={{ marginTop: 10 }}>
        <div style={{ color: 'var(--brand-deep)', fontSize: 10.5, fontWeight: 800, marginBottom: 6 }}>
          أفقي ←
        </div>
        <ol style={{ margin: 0, paddingInlineStart: 18 }}>
          {puzzle.rows.map((row, r) => (
            <li
              key={r}
              style={{
                color: 'var(--ink-scene-sub)',
                fontSize: 11.5,
                lineHeight: 1.95,
                fontWeight: 400,
              }}
            >
              {row.clue}
            </li>
          ))}
        </ol>

        <div style={{ color: 'var(--brand-deep)', fontSize: 10.5, fontWeight: 800, margin: '10px 0 4px' }}>
          رأسي ↓
        </div>
        <div style={{ color: 'var(--ink-scene-sub)', fontSize: 11.5, lineHeight: 1.9, fontWeight: 400 }}>
          العمود الملوّن — {puzzle.verticalClue}
        </div>
      </div>

      {/* actions */}
      <div style={{ display: 'flex', gap: 9, marginTop: 12 }}>
        <button
          onClick={() => setChecked(true)}
          style={{
            flex: 1,
            background: 'var(--brand-deep)',
            color: 'var(--cream)',
            border: 'none',
            borderRadius: 14,
            padding: 13,
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          تحقّقي
        </button>
        <button className="btn--scene-ghost" style={ghostBtn} onClick={() => reset(puzzleIndex)}>
          مسح
        </button>
        <button
          className="btn--scene-ghost"
          style={ghostBtn}
          onClick={() => reset((puzzleIndex + 1) % CROSSWORDS.length)}
        >
          لغز جديد
        </button>
      </div>
    </ScenePage>
  )
}

const ghostBtn = {
  borderRadius: 14,
  padding: '13px 15px',
  fontSize: 13,
  fontWeight: 800,
  cursor: 'pointer',
  fontFamily: 'inherit',
  margin: 0,
}

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAdmin } from '../context/AdminContext'
import { ADAPTIVE_BANK, AI_PROVIDERS_CATALOG } from '../data/admin'
import {
  BrainIcon,
  CheckIcon,
  CloseIcon,
  SparkleIcon,
  TrophyIcon,
  ZapIcon,
} from '../components/icons'

// Seeded PRNG so each user gets a reproducible-but-different order.
function seedFromString(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i += 1) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  }
  return h >>> 0
}
function makeRng(seed) {
  let state = seed || 1
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

function shuffled(arr, rng) {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function pickNext(bank, answered, difficulty, rng) {
  const remaining = bank.filter((q) => !answered.has(q.id))
  if (remaining.length === 0) return null
  // Prefer questions in +/- 1 of current difficulty; fall back to any.
  const band = remaining.filter((q) => Math.abs(q.difficulty - difficulty) <= 1)
  const pool = band.length ? band : remaining
  return shuffled(pool, rng)[0]
}

const DIFFICULTY_LABEL = { 1: 'Foundational', 2: 'Intermediate', 3: 'Advanced' }
const DIFFICULTY_COLOR = {
  1: 'from-emerald-500 to-teal-500',
  2: 'from-amber-500 to-orange-500',
  3: 'from-rose-500 to-pink-500',
}

const TOTAL_QUESTIONS = 8

export default function AdaptiveQuiz() {
  const { user } = useAuth()
  const { taskRouting, providers } = useAdmin()

  const taskConfig = taskRouting?.adaptive_quiz
  const providerCfg = AI_PROVIDERS_CATALOG.find((p) => p.id === taskConfig?.provider)
  const providerState = providers?.[taskConfig?.provider]
  const providerOk = taskConfig?.enabled && providerState?.enabled && providerState?.status === 'connected'

  const seed = useMemo(() => seedFromString((user?.id || 'anon') + ':' + (user?.email || '')), [user])
  const [rng] = useState(() => makeRng(seed))

  const [difficulty, setDifficulty] = useState(2)
  const [answered, setAnswered] = useState(() => new Set())
  const [current, setCurrent] = useState(() => pickNext(ADAPTIVE_BANK, new Set(), 2, makeRng(seed)))
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [history, setHistory] = useState([])
  const [streak, setStreak] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!current && !done && answered.size < TOTAL_QUESTIONS && providerOk) {
      const next = pickNext(ADAPTIVE_BANK, answered, difficulty, rng)
      if (next) setCurrent(next)
      else setDone(true)
    }
  }, [current, answered, difficulty, done, providerOk, rng])

  const submit = () => {
    if (selected == null || !current) return
    const correct = selected === current.correctIndex
    setRevealed(true)
    setHistory((h) => [...h, { q: current, correct, chosen: selected }])
    setAnswered((a) => new Set(a).add(current.id))
    if (correct) {
      setStreak((s) => s + 1)
      setDifficulty((d) => (streak + 1 >= 2 && d < 3 ? d + 1 : d))
    } else {
      setStreak(0)
      setDifficulty((d) => (d > 1 ? d - 1 : d))
    }
  }

  const nextQuestion = () => {
    if (answered.size >= TOTAL_QUESTIONS) {
      setDone(true)
      setCurrent(null)
      return
    }
    const next = pickNext(ADAPTIVE_BANK, answered, difficulty, rng)
    setCurrent(next)
    setSelected(null)
    setRevealed(false)
    if (!next) setDone(true)
  }

  const reset = () => {
    setAnswered(new Set())
    setHistory([])
    setStreak(0)
    setDifficulty(2)
    setSelected(null)
    setRevealed(false)
    setDone(false)
    setCurrent(pickNext(ADAPTIVE_BANK, new Set(), 2, makeRng(seed + 1)))
  }

  const correctCount = history.filter((h) => h.correct).length
  const progressPct = (answered.size / TOTAL_QUESTIONS) * 100
  const topicStats = useMemo(() => {
    const m = {}
    for (const h of history) {
      if (!m[h.q.topic]) m[h.q.topic] = { right: 0, wrong: 0 }
      if (h.correct) m[h.q.topic].right += 1
      else m[h.q.topic].wrong += 1
    }
    return Object.entries(m)
  }, [history])

  if (!providerOk) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-600/40 dark:bg-amber-500/10 dark:text-amber-200">
        <h2 className="mb-1 text-lg font-semibold">Adaptive Quiz is offline</h2>
        <p>
          The quiz generator is disabled or its provider isn't connected. Ask an admin to enable it under{' '}
          <span className="font-mono">/admin/ai-tasks</span> and connect the provider at{' '}
          <span className="font-mono">/admin/ai-providers</span>.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <BrainIcon className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Adaptive Skill Check</h1>
          </div>
          <p className="mt-1 max-w-xl text-sm text-gray-500 dark:text-gray-400">
            Each question is picked for you — difficulty goes up when you're right, eases when you're not. The bank
            is reshuffled per student so no two sessions are identical.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <span
            className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white ${DIFFICULTY_COLOR[difficulty]}`}
          >
            <ZapIcon className="h-3 w-3" /> {DIFFICULTY_LABEL[difficulty]} band
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 font-mono text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <SparkleIcon className="h-3 w-3 text-indigo-500" /> {providerCfg?.name} · {taskConfig?.model}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            Question {Math.min(answered.size + (done ? 0 : 1), TOTAL_QUESTIONS)} of {TOTAL_QUESTIONS}
          </span>
          <span>
            {correctCount} correct · streak {streak}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        {current && !done && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-gray-400">
              <span>{current.topic}</span>
              <span>·</span>
              <span>{DIFFICULTY_LABEL[current.difficulty]}</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{current.question}</h2>

            <div className="mt-4 grid gap-2">
              {current.options.map((opt, i) => {
                const chosen = selected === i
                const isCorrect = i === current.correctIndex
                let cls =
                  'cursor-pointer border-gray-200 bg-white text-gray-800 hover:border-indigo-400 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100'
                if (revealed) {
                  if (isCorrect)
                    cls = 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-200'
                  else if (chosen)
                    cls = 'border-rose-500 bg-rose-50 text-rose-800 dark:border-rose-500/50 dark:bg-rose-500/10 dark:text-rose-200'
                  else cls = 'border-gray-200 bg-white text-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400'
                } else if (chosen) {
                  cls = 'border-indigo-500 bg-indigo-50 text-indigo-900 dark:border-indigo-500/60 dark:bg-indigo-500/10 dark:text-indigo-100'
                }
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={revealed}
                    onClick={() => setSelected(i)}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${cls}`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-current text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {revealed && isCorrect && <CheckIcon className="h-4 w-4 text-emerald-600" />}
                    {revealed && !isCorrect && chosen && <CloseIcon className="h-4 w-4 text-rose-600" />}
                  </button>
                )
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {revealed
                  ? history[history.length - 1]?.correct
                    ? 'Correct! Difficulty tuned up.'
                    : 'Not quite — easing the next one.'
                  : 'Pick an answer and submit.'}
              </p>
              {!revealed ? (
                <button
                  type="button"
                  disabled={selected == null}
                  onClick={submit}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-40"
                >
                  Submit answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextQuestion}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-sm"
                >
                  {answered.size >= TOTAL_QUESTIONS ? 'See results' : 'Next question →'}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {done && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-sm dark:border-gray-800 dark:from-indigo-900/20 dark:to-purple-900/20"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
              <TrophyIcon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Skill check complete</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {correctCount} / {history.length} correct · final band: {DIFFICULTY_LABEL[difficulty]}
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                By topic
              </p>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
                {topicStats.map(([topic, s]) => (
                  <li key={topic} className="flex items-center justify-between">
                    <span>{topic}</span>
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                      {s.right}/{s.right + s.wrong}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                What's next
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-200">
                Your weakness analysis and study plan have been refreshed with these results.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Try another set
                </button>
                <Link
                  to="/app/tutor"
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Ask AI Tutor
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

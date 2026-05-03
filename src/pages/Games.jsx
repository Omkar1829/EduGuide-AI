import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGames } from '../context/GamesContext'
import { usePresence } from '../context/PresenceContext'
import {
  QUESTION_BANK,
  SUBJECTS,
  streamGroupFor,
  subjectsForStream,
} from '../data/games'
import { CheckIcon, CloseIcon, SparkleIcon, TargetIcon, TrophyIcon } from '../components/icons'

const ROUND_SIZE = 5

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Games() {
  const { user } = useAuth()
  const { recordResult } = useGames()
  const { online, byStream } = usePresence()

  const myStream = streamGroupFor(user?.education?.stream)
  const eligible = useMemo(() => subjectsForStream(user?.education?.stream), [user])

  const [subject, setSubject] = useState(null)
  const [questions, setQuestions] = useState([])
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const [done, setDone] = useState(false)
  const [pickedOption, setPickedOption] = useState(null)
  const [textAnswer, setTextAnswer] = useState('')
  const [reveal, setReveal] = useState(false)

  const startSubject = (s) => {
    const bank = QUESTION_BANK[s.id] || []
    const round = shuffle(bank).slice(0, Math.min(ROUND_SIZE, bank.length))
    setSubject(s)
    setQuestions(round)
    setIdx(0)
    setAnswers([])
    setDone(false)
    setPickedOption(null)
    setTextAnswer('')
    setReveal(false)
  }

  const exit = () => {
    setSubject(null)
    setQuestions([])
    setAnswers([])
    setIdx(0)
    setDone(false)
  }

  const current = questions[idx]

  const submit = () => {
    if (!current) return
    let correct = false
    let given = ''
    if (current.type === 'mcq') {
      if (pickedOption == null) return
      given = current.options[pickedOption]
      correct = pickedOption === current.answer
    } else {
      const v = textAnswer.trim()
      if (!v) return
      given = v
      const norm = (s) => s.toString().trim().toLowerCase()
      correct = norm(v) === norm(current.answer) ||
        (current.alts || []).some((a) => norm(a) === norm(v))
    }
    setAnswers((prev) => [...prev, { qId: current.id, correct, given }])
    setReveal(true)
  }

  const goNext = () => {
    setReveal(false)
    setPickedOption(null)
    setTextAnswer('')
    if (idx + 1 >= questions.length) {
      setDone(true)
    } else {
      setIdx((i) => i + 1)
    }
  }

  // When the round completes, post the result to the leaderboard once.
  useEffect(() => {
    if (!done || !subject || answers.length === 0) return
    const correctCount = answers.filter((a) => a.correct).length
    const accuracy = Math.round((correctCount / answers.length) * 100)
    const score = correctCount * 20 // 5 questions × 20 = 100 max
    recordResult({
      userId: user?.id || 'anon',
      name: user?.name || 'You',
      email: user?.email,
      stream: myStream,
      subjectId: subject.id,
      score,
      accuracy,
    })
    // intentionally omitting recordResult / user from deps — fire once per round
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  // ───── Round-in-progress UI ────────────────────────────────────────────────
  if (subject && !done) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {subject.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Question {idx + 1} of {questions.length} · {current?.type === 'mcq' ? 'Multiple choice' : 'Fill in the blank'}
            </p>
          </div>
          <button
            type="button"
            onClick={exit}
            className="eg-btn-ghost"
            aria-label="Exit round"
          >
            <CloseIcon className="h-4 w-4" /> Exit
          </button>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((idx + (reveal ? 1 : 0)) / questions.length) * 100}%` }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            className={`h-full rounded-full bg-gradient-to-r ${subject.gradient}`}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current?.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="eg-card"
          >
            <p className="text-base font-medium text-gray-900 dark:text-white sm:text-lg">
              {current?.q}
            </p>

            {current?.type === 'mcq' && (
              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {current.options.map((opt, i) => {
                  const isPicked = pickedOption === i
                  const isCorrect = current.answer === i
                  let cls =
                    'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/60 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-500/60 dark:hover:bg-indigo-500/5'
                  if (reveal) {
                    if (isCorrect) cls = 'border-mint-400 bg-mint-50 dark:border-mint-500/60 dark:bg-mint-500/10'
                    else if (isPicked) cls = 'border-peach-400 bg-peach-50 dark:border-peach-500/60 dark:bg-peach-500/10'
                  } else if (isPicked) {
                    cls = 'border-indigo-400 bg-indigo-50 ring-2 ring-indigo-200 dark:border-indigo-400 dark:bg-indigo-500/10 dark:ring-indigo-500/30'
                  }
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={reveal}
                      onClick={() => setPickedOption(i)}
                      className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition disabled:cursor-not-allowed ${cls}`}
                    >
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-sm text-gray-800 dark:text-gray-100">
                        {opt}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}

            {current?.type === 'blank' && (
              <div className="mt-5">
                <input
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  disabled={reveal}
                  className="eg-input"
                  placeholder="Type your answer…"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !reveal) submit()
                  }}
                />
                {reveal && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Expected: <span className="font-medium text-gray-800 dark:text-gray-200">{current.answer}</span>
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {answers.filter((a) => a.correct).length} correct so far
              </p>
              {!reveal ? (
                <button type="button" onClick={submit} className="eg-btn-primary px-5 py-2 text-sm">
                  Submit
                </button>
              ) : (
                <button type="button" onClick={goNext} className="eg-btn-primary px-5 py-2 text-sm">
                  {idx + 1 >= questions.length ? 'Finish round' : 'Next question →'}
                </button>
              )}
            </div>

            {reveal && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  answers[answers.length - 1]?.correct
                    ? 'bg-mint-100 text-mint-700 dark:bg-mint-500/15 dark:text-mint-300'
                    : 'bg-peach-100 text-peach-700 dark:bg-peach-500/15 dark:text-peach-300'
                }`}
              >
                {answers[answers.length - 1]?.correct ? (
                  <><CheckIcon className="h-3.5 w-3.5" /> Correct</>
                ) : (
                  <><CloseIcon className="h-3.5 w-3.5" /> Not quite</>
                )}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  // ───── Results UI ──────────────────────────────────────────────────────────
  if (subject && done) {
    const correct = answers.filter((a) => a.correct).length
    const accuracy = Math.round((correct / answers.length) * 100)
    const score = correct * 20
    return (
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="eg-card text-center"
        >
          <span className={`mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${subject.gradient} text-white shadow-soft`}>
            <TrophyIcon className="h-7 w-7" />
          </span>
          <h1 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
            Round complete
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {subject.name} · {correct}/{answers.length} correct
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: 'Score', value: score, hint: 'out of 100' },
              { label: 'Accuracy', value: `${accuracy}%`, hint: 'this round' },
              { label: 'Rank pool', value: byStream[myStream] ?? online, hint: `${myStream} live` },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-gray-200 px-3 py-3 dark:border-gray-700">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {s.label}
                </p>
                <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">{s.hint}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button type="button" onClick={() => startSubject(subject)} className="eg-btn-primary px-5 py-2 text-sm">
              Play again
            </button>
            <button type="button" onClick={exit} className="eg-btn-ghost border border-gray-200 dark:border-gray-700">
              Pick another subject
            </button>
            <Link to="/app/leaderboard" className="eg-btn-ghost border border-gray-200 dark:border-gray-700">
              <TrophyIcon className="h-4 w-4" /> View leaderboard
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  // ───── Subject picker ──────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white">
            Knowledge games
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Short MCQ + fill-in-the-blank rounds tailored to your stream. Finish a round to post your score to the leaderboard.
          </p>
        </div>
        <Link to="/app/leaderboard" className="eg-btn-ghost border border-gray-200 dark:border-gray-700">
          <TrophyIcon className="h-4 w-4" /> Leaderboard
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatPill label="Online now" value={online} accent="mint" hint="updating live" pulse />
        <StatPill
          label={`${myStream} stream`}
          value={byStream[myStream] ?? '—'}
          accent="indigo"
          hint="students playing"
        />
        <StatPill
          label="Round size"
          value={`${ROUND_SIZE} Qs`}
          accent="peach"
          hint="≈2 min per round"
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Subjects for {myStream === 'Mixed' ? 'you' : `${myStream} stream`}
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {eligible.map((s, i) => (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
              whileHover={{ scale: 1.02 }}
              type="button"
              onClick={() => startSubject(s)}
              className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-soft transition hover:border-indigo-300 hover:shadow-card dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-500/60"
            >
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-white`}>
                <TargetIcon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-base font-semibold text-gray-900 dark:text-white">
                {s.name}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {s.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 group-hover:underline dark:text-indigo-300">
                <SparkleIcon className="h-3 w-3" /> Start round
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {SUBJECTS.length > eligible.length && (
        <details className="rounded-2xl border border-dashed border-gray-200 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
          <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-200">
            Show all subjects
          </summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SUBJECTS.filter((s) => !eligible.find((e) => e.id === s.id)).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => startSubject(s)}
                className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 text-left transition hover:border-indigo-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-500/60"
              >
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-white`}>
                  <TargetIcon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {s.name}
                </span>
              </button>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}

function StatPill({ label, value, hint, accent, pulse }) {
  const tone = {
    mint: 'from-mint-50 to-mint-100 text-mint-700 dark:from-mint-500/10 dark:to-mint-500/5 dark:text-mint-300',
    indigo: 'from-indigo-50 to-purple-50 text-indigo-700 dark:from-indigo-500/10 dark:to-purple-500/10 dark:text-indigo-200',
    peach: 'from-peach-50 to-peach-100 text-peach-700 dark:from-peach-500/10 dark:to-peach-500/5 dark:text-peach-300',
  }[accent]
  return (
    <div className={`flex items-center gap-3 rounded-2xl border border-gray-200 bg-gradient-to-br p-3 dark:border-gray-700 ${tone}`}>
      {pulse && (
        <span className="relative inline-flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint-500" />
        </span>
      )}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">
          {label}
        </p>
        <p className="text-lg font-semibold">{value}</p>
        {hint && <p className="text-[10px] opacity-70">{hint}</p>}
      </div>
    </div>
  )
}

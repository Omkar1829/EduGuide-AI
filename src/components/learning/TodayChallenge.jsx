import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { TargetIcon } from '../icons'

// Pick a stable subject for "today" — combines the date with the user id so
// every student sees a different daily challenge that doesn't change until
// midnight.
function todaysSubject({ proficiency, userId }) {
  const today = new Date().toISOString().slice(0, 10)
  const seed = (today + (userId || 'guest'))
    .split('')
    .reduce((a, c) => a + c.charCodeAt(0), 0)
  const candidates = proficiency.length > 0 ? proficiency : []
  // Prefer something the user is weak at; fall back to a random subject.
  const weak = candidates.filter((c) => !c.untouched && c.accuracy < 70)
  const pool = weak.length > 0 ? weak : candidates
  if (pool.length === 0) return null
  return pool[seed % pool.length]
}

export default function TodayChallenge({ proficiency, userId }) {
  const pick = useMemo(() => todaysSubject({ proficiency, userId }), [proficiency, userId])
  if (!pick) {
    return (
      <section className="eg-card flex flex-col">
        <div className="mb-2 flex items-center gap-2">
          <TargetIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Today's challenge
          </h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Pick any subject in <Link to="/app/games" className="text-brand-600 hover:underline">Knowledge Games</Link> to start your daily round.
        </p>
      </section>
    )
  }
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${pick.gradient || 'from-mint-300 to-sky-400'} p-5 text-white shadow-soft`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide opacity-90">
        <TargetIcon className="h-3.5 w-3.5" /> Today's challenge
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">
        {pick.name}
      </p>
      <p className="mt-1 max-w-md text-sm opacity-90">
        {pick.untouched
          ? `Start your baseline — 5 quick questions, no pressure.`
          : `Currently at ${pick.accuracy}%. Five questions to push it higher.`}
      </p>
      <Link
        to={`/app/games?subject=${pick.subjectId}`}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/30"
      >
        Start round →
      </Link>
    </motion.section>
  )
}

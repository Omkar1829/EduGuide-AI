import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { ClockIcon, CloseIcon } from '../icons'
import { useActivity } from '../../context/ActivityContext'

export default function SmartReminders({ proficiency, myResults }) {
  const { dismissed, dismissNudge } = useActivity()

  const reminders = useMemo(() => {
    const out = []
    proficiency.forEach((p) => {
      if (p.untouched) return
      const lastForSubject = myResults
        .filter((r) => r.subjectId === p.subjectId)
        .sort((a, b) => (b.ts || 0) - (a.ts || 0))[0]
      if (!lastForSubject) return
      const daysSince = Math.floor(
        (Date.now() - (lastForSubject.ts || Date.now())) / (24 * 60 * 60 * 1000),
      )
      if (daysSince >= 3) {
        out.push({
          id: `rem-${p.subjectId}-${daysSince}`,
          subjectId: p.subjectId,
          text: `${daysSince} days since ${p.name} — last accuracy ${p.accuracy}%. Quick round?`,
        })
      }
    })
    return out.filter((r) => !dismissed[r.id]).slice(0, 2)
  }, [proficiency, myResults, dismissed])

  if (reminders.length === 0) return null

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {reminders.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 12 }}
            className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-peach-100 to-mint-100 p-3 text-sm text-gray-800 shadow-soft dark:from-peach-500/15 dark:to-mint-500/10 dark:text-gray-100"
          >
            <ClockIcon className="h-4 w-4 shrink-0 opacity-80" />
            <span className="flex-1">{r.text}</span>
            <Link
              to={`/app/games?subject=${r.subjectId}`}
              className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-gray-800 backdrop-blur transition-colors hover:bg-white dark:bg-gray-900/40 dark:text-gray-100 dark:hover:bg-gray-900/60"
            >
              Practice
            </Link>
            <button
              type="button"
              onClick={() => dismissNudge(r.id)}
              className="rounded-full p-1 text-current opacity-60 hover:opacity-100"
              aria-label="Dismiss"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

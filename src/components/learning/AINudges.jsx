import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { CloseIcon, SparkleIcon } from '../icons'
import { useActivity } from '../../context/ActivityContext'

function buildNudges({ proficiency, peer, currentStreak }) {
  const out = []
  const weak = proficiency.find((p) => !p.untouched && p.accuracy < 60)
  if (weak) {
    out.push({
      id: `weak-${weak.subjectId}`,
      tone: 'peach',
      text: `${weak.name} is sitting at ${weak.accuracy}% — try a 5-question round to push it past 60%.`,
      cta: { to: '/app/games', label: 'Practice' },
    })
  }
  const untouched = proficiency.find((p) => p.untouched)
  if (untouched && out.length < 2) {
    out.push({
      id: `try-${untouched.subjectId}`,
      tone: 'mint',
      text: `You haven't tried ${untouched.name} yet — quick round to map your baseline?`,
      cta: { to: '/app/games', label: 'Start round' },
    })
  }
  if (peer && peer.percentile != null && peer.percentile <= 50 && out.length < 3) {
    out.push({
      id: `peer-push`,
      tone: 'sky',
      text: `You're at rank ${peer.rank}/${peer.total}. Two strong rounds could push you into the top half.`,
      cta: { to: '/app/leaderboard', label: 'See board' },
    })
  }
  if (currentStreak >= 1 && currentStreak < 7 && out.length < 3) {
    out.push({
      id: `streak-${currentStreak}`,
      tone: 'purple',
      text: `${currentStreak}-day streak — keep it alive with a quick round today.`,
      cta: { to: '/app/games', label: 'Keep streak' },
    })
  }
  return out
}

const TONES = {
  peach: 'from-peach-100 to-peach-200 text-peach-900 dark:from-peach-500/20 dark:to-peach-500/10 dark:text-peach-200',
  mint: 'from-mint-100 to-mint-200 text-mint-900 dark:from-mint-500/20 dark:to-mint-500/10 dark:text-mint-200',
  sky: 'from-sky-100 to-sky-200 text-sky-900 dark:from-sky-500/20 dark:to-sky-500/10 dark:text-sky-200',
  purple: 'from-purple-100 to-purple-200 text-purple-900 dark:from-purple-500/20 dark:to-purple-500/10 dark:text-purple-200',
}

export default function AINudges({ proficiency, peer, currentStreak }) {
  const { dismissed, dismissNudge } = useActivity()
  const nudges = useMemo(
    () => buildNudges({ proficiency, peer, currentStreak }).filter((n) => !dismissed[n.id]),
    [proficiency, peer, currentStreak, dismissed],
  )

  if (nudges.length === 0) return null

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {nudges.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 12 }}
            className={`flex items-center gap-3 rounded-2xl bg-gradient-to-r p-3 text-sm shadow-soft ${TONES[n.tone] || TONES.mint}`}
          >
            <SparkleIcon className="h-4 w-4 shrink-0 opacity-80" />
            <span className="flex-1">{n.text}</span>
            <Link
              to={n.cta.to}
              className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-gray-800 backdrop-blur transition-colors hover:bg-white dark:bg-gray-900/40 dark:text-gray-100 dark:hover:bg-gray-900/60"
            >
              {n.cta.label}
            </Link>
            <button
              type="button"
              onClick={() => dismissNudge(n.id)}
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

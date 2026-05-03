import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TargetIcon } from '../icons'

function tone(acc, untouched) {
  if (untouched) return 'from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700'
  if (acc >= 80) return 'from-mint-300 to-mint-500'
  if (acc >= 60) return 'from-sky-300 to-sky-500'
  if (acc >= 40) return 'from-peach-300 to-peach-500'
  return 'from-rose-300 to-rose-500'
}

export default function ProficiencyMap({ rows }) {
  return (
    <section className="eg-card">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TargetIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Proficiency map
          </h2>
        </div>
        <Link
          to="/app/games"
          className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          Practice a subject →
        </Link>
      </div>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        Per-subject mastery from your game rounds. Mint = strong, peach = needs practice.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((r, i) => (
          <motion.div
            key={r.subjectId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="rounded-2xl border border-gray-200 p-3 dark:border-gray-700"
          >
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {r.name}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {r.untouched ? '—' : `${r.accuracy}%`}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
              <motion.div
                key={`${r.subjectId}-${r.accuracy}`}
                initial={{ width: 0 }}
                animate={{ width: `${r.untouched ? 4 : r.accuracy}%` }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.04 }}
                className={`h-full rounded-full bg-gradient-to-r ${tone(r.accuracy, r.untouched)}`}
              />
            </div>
            <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
              {r.untouched
                ? 'No rounds yet — try a quick practice.'
                : `${r.rounds} round${r.rounds === 1 ? '' : 's'} · best ${r.bestScore} pts`}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

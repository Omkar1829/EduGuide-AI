import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FireIcon } from '../icons'

function bg(acc) {
  if (acc >= 80) return 'bg-mint-200 text-mint-900 dark:bg-mint-500/30 dark:text-mint-200'
  if (acc >= 60) return 'bg-sky-200 text-sky-900 dark:bg-sky-500/30 dark:text-sky-200'
  if (acc >= 40) return 'bg-peach-200 text-peach-900 dark:bg-peach-500/30 dark:text-peach-200'
  return 'bg-rose-200 text-rose-900 dark:bg-rose-500/30 dark:text-rose-200'
}

export default function StrengthsHeatmap({ heatmap }) {
  if (heatmap.length === 0) {
    return (
      <section className="eg-card">
        <div className="mb-3 flex items-center gap-2">
          <FireIcon className="h-4 w-4 text-rose-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Strengths & weaknesses
          </h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Play a few rounds in <Link to="/app/games" className="text-brand-600 hover:underline">Knowledge Games</Link> and your topic-level heatmap will appear here.
        </p>
      </section>
    )
  }

  const sorted = [...heatmap].sort((a, b) => a.accuracy - b.accuracy)
  return (
    <section className="eg-card">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FireIcon className="h-4 w-4 text-rose-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Strengths & weaknesses
          </h2>
        </div>
        <Link
          to="/app/games"
          className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          Fix it →
        </Link>
      </div>
      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
        Topic-level accuracy. Click "Fix it" to start a focused round on your weakest topic.
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {sorted.map((cell, i) => (
          <motion.div
            key={`${cell.subjectId}-${cell.topic}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: i * 0.02 }}
            className={`flex flex-col gap-0.5 rounded-xl px-3 py-2 text-xs font-medium ${bg(cell.accuracy)}`}
            title={`${cell.attempts} attempt${cell.attempts === 1 ? '' : 's'}`}
          >
            <span className="text-[10px] uppercase tracking-wide opacity-75">
              {cell.subjectId}
            </span>
            <span>{cell.topic}</span>
            <span className="font-bold">{cell.accuracy}%</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

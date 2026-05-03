import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { FireIcon } from '../icons'

function tone(value) {
  if (value === 0) return 'bg-gray-100 dark:bg-gray-800'
  if (value === 1) return 'bg-mint-200 dark:bg-mint-500/30'
  if (value === 2) return 'bg-mint-300 dark:bg-mint-500/50'
  if (value === 3) return 'bg-mint-400 dark:bg-mint-500/70'
  return 'bg-mint-500 dark:bg-mint-400'
}

export default function StreakHeatmap({ days, currentStreak }) {
  // Group into weeks (12 weeks × 7 days = 84 days).
  const weeks = useMemo(() => {
    const rows = []
    for (let i = 0; i < days.length; i += 7) {
      rows.push(days.slice(i, i + 7))
    }
    return rows
  }, [days])

  return (
    <section className="eg-card">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FireIcon className="h-4 w-4 text-peach-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Activity heatmap
          </h2>
        </div>
        <span className="rounded-full bg-peach-100 px-2.5 py-1 text-xs font-semibold text-peach-700 dark:bg-peach-500/20 dark:text-peach-300">
          {currentStreak}d streak
        </span>
      </div>
      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
        Last 12 weeks. Each square = a day; intensity = activity that day.
      </p>
      <div className="flex gap-1 overflow-x-auto">
        {weeks.map((w, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {w.map((d, di) => (
              <motion.div
                key={`${wi}-${di}`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: (wi * 7 + di) * 0.005 }}
                title={`${d.label} — ${d.value} activit${d.value === 1 ? 'y' : 'ies'}`}
                className={`h-3.5 w-3.5 rounded-sm ${tone(d.value)}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
        <span>Less</span>
        <span className="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
        <span className="h-3 w-3 rounded-sm bg-mint-200 dark:bg-mint-500/30" />
        <span className="h-3 w-3 rounded-sm bg-mint-300 dark:bg-mint-500/50" />
        <span className="h-3 w-3 rounded-sm bg-mint-400 dark:bg-mint-500/70" />
        <span className="h-3 w-3 rounded-sm bg-mint-500 dark:bg-mint-400" />
        <span>More</span>
      </div>
    </section>
  )
}

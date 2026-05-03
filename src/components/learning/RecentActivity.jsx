import { motion } from 'framer-motion'
import { ClockIcon } from '../icons'

function timeAgo(ts) {
  const diff = Date.now() - ts
  const m = Math.round(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.round(h / 24)
  return `${d}d ago`
}

export default function RecentActivity({ items }) {
  return (
    <section className="eg-card">
      <div className="mb-3 flex items-center gap-2">
        <ClockIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent activity
        </h2>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Nothing yet — play a round, finish a lesson, or upload a doc to fill this in.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.slice(0, 6).map((it, i) => (
            <motion.li
              key={it.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800/60"
            >
              <span className="flex items-center gap-2 truncate">
                <span className="text-base" aria-hidden>
                  {it.icon}
                </span>
                <span className="truncate text-gray-700 dark:text-gray-200">
                  {it.label}
                </span>
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {timeAgo(it.ts)}
              </span>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  )
}

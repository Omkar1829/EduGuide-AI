import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { TrophyIcon } from '../icons'

export default function MiniLeaderboard({ results, userId, stream }) {
  const top = useMemo(() => {
    const inStream = results.filter((r) => (stream ? r.stream === stream : true))
    const totals = new Map()
    inStream.forEach((r) => {
      const k = r.userId || r.id || r.name
      const current = totals.get(k) || { id: k, name: r.name, total: 0 }
      current.total += r.score ?? 0
      totals.set(k, current)
    })
    const ranked = [...totals.values()].sort((a, b) => b.total - a.total)
    const myIdx = ranked.findIndex((x) => x.id === userId)
    const head = ranked.slice(0, 5)
    if (myIdx >= 0 && myIdx > 4) {
      return [...head, { ...ranked[myIdx], rank: myIdx + 1, isMe: true }]
    }
    return head.map((r, i) => ({ ...r, rank: i + 1, isMe: r.id === userId }))
  }, [results, userId, stream])

  return (
    <section className="eg-card">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrophyIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top in {stream || 'your stream'}
          </h2>
        </div>
        <Link
          to="/app/leaderboard"
          className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          Full board →
        </Link>
      </div>
      {top.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No scores yet — be the first.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {top.map((r, i) => (
            <motion.li
              key={r.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${
                r.isMe
                  ? 'bg-gradient-to-r from-brand-100 to-mint-100 font-semibold text-brand-800 dark:from-brand-900/40 dark:to-mint-500/20 dark:text-brand-200'
                  : 'bg-gray-50 text-gray-700 dark:bg-gray-800/60 dark:text-gray-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                    r.rank === 1
                      ? 'bg-peach-200 text-peach-800 dark:bg-peach-500/40 dark:text-peach-100'
                      : r.rank === 2
                      ? 'bg-sky-200 text-sky-800 dark:bg-sky-500/40 dark:text-sky-100'
                      : r.rank === 3
                      ? 'bg-mint-200 text-mint-800 dark:bg-mint-500/40 dark:text-mint-100'
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {r.rank}
                </span>
                <span className="truncate">
                  {r.isMe ? `${r.name} (you)` : r.name}
                </span>
              </span>
              <span>{r.total} pts</span>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  )
}

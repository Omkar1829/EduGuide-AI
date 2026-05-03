import { motion } from 'framer-motion'
import { UsersIcon } from '../icons'

export default function PeerPercentile({ data, stream }) {
  if (!data || data.percentile == null) {
    return (
      <section className="eg-card">
        <div className="mb-3 flex items-center gap-2">
          <UsersIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Peer percentile
          </h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Play a round to see how you stack up against {stream || 'your stream'} peers.
        </p>
      </section>
    )
  }
  const { percentile, rank, total, myTotal } = data
  return (
    <section className="eg-card">
      <div className="mb-3 flex items-center gap-2">
        <UsersIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Peer percentile
        </h2>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-brand-50 to-mint-50 p-4 dark:border-gray-700 dark:from-brand-900/30 dark:to-mint-500/10">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          You are in the
        </p>
        <p className="mt-1 text-3xl font-bold text-brand-700 dark:text-brand-300">
          top {Math.max(1, 100 - percentile + 1)}%
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Rank {rank} of {total} in {stream || 'your stream'} · {myTotal ?? 0} pts
        </p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/60 dark:bg-gray-700/60">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentile}%` }}
            transition={{ duration: 0.7 }}
            className="h-full rounded-full bg-gradient-to-r from-mint-400 to-sky-400"
          />
        </div>
      </div>
    </section>
  )
}

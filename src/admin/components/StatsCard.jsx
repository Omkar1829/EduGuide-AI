import { motion } from 'framer-motion'

export default function StatsCard({ icon: Icon, label, value, trend, tint = 'indigo' }) {
  const tints = {
    indigo: 'from-indigo-500 to-purple-500',
    emerald: 'from-emerald-500 to-teal-500',
    rose: 'from-rose-500 to-orange-500',
    sky: 'from-sky-500 to-indigo-500',
    amber: 'from-amber-500 to-orange-500',
  }
  const gradient = tints[tint] || tints.indigo
  const trendUp = typeof trend === 'number' ? trend >= 0 : null
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="eg-card flex items-start justify-between"
    >
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        {trend !== undefined && (
          <p
            className={`mt-1 text-xs font-medium ${
              trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {trendUp ? '▲' : '▼'} {Math.abs(trend)}% vs last week
          </p>
        )}
      </div>
      {Icon && (
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md`}
        >
          <Icon className="h-5 w-5" />
        </span>
      )}
    </motion.div>
  )
}

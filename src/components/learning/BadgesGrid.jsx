import { motion } from 'framer-motion'
import { TrophyIcon } from '../icons'

export default function BadgesGrid({ badges }) {
  const unlocked = badges.filter((b) => b.unlocked)
  return (
    <section className="eg-card">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrophyIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Achievements
          </h2>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {unlocked.length} / {badges.length} unlocked
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {badges.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.03 }}
            className={`relative overflow-hidden rounded-2xl border p-3 text-center ${
              b.unlocked
                ? 'border-transparent bg-gradient-to-br ' + b.tint + ' text-white shadow-soft'
                : 'border-gray-200 bg-white/70 text-gray-400 dark:border-gray-700 dark:bg-gray-800/60'
            }`}
            title={b.desc}
          >
            <div className="text-2xl">{b.icon}</div>
            <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide">
              {b.label}
            </div>
            <div className={`mt-0.5 text-[10px] ${b.unlocked ? 'opacity-90' : 'opacity-70'}`}>
              {b.desc}
            </div>
            {!b.unlocked && (
              <span className="absolute right-1 top-1 rounded-full bg-gray-200 px-1.5 py-0.5 text-[9px] font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                locked
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}

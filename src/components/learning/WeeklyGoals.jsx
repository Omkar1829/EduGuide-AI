import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { CheckIcon, CloseIcon, PlusIcon, TargetIcon } from '../icons'
import { useActivity } from '../../context/ActivityContext'

const SUGGESTIONS = [
  { label: 'Play 5 game rounds', target: 5 },
  { label: 'Score 80%+ on a Physics round', target: 1 },
  { label: 'Complete 3 lessons', target: 3 },
  { label: 'Upload one new document', target: 1 },
]

export default function WeeklyGoals() {
  const { goals, addGoal, removeGoal, bumpGoal } = useActivity()
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [target, setTarget] = useState(5)

  const submit = (e) => {
    e?.preventDefault()
    const text = label.trim()
    if (!text) return
    addGoal(text, Math.max(1, Number(target) || 1))
    setLabel('')
    setTarget(5)
    setOpen(false)
  }

  return (
    <section className="eg-card">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TargetIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Weekly goals
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300"
        >
          <PlusIcon className="h-3 w-3" /> Add goal
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={submit}
            className="mb-3 space-y-2 overflow-hidden rounded-xl border border-gray-200 p-3 dark:border-gray-700"
          >
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => {
                    setLabel(s.label)
                    setTarget(s.target)
                  }}
                  className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Goal description…"
                className="eg-input flex-1"
              />
              <input
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                type="number"
                min="1"
                max="100"
                className="eg-input w-16 text-center"
              />
              <button type="submit" className="eg-btn-primary px-3">
                Add
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {goals.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Set a goal or two to keep yourself accountable this week.
        </p>
      ) : (
        <ul className="space-y-2">
          {goals.map((g) => {
            const pct = Math.round((g.progress / g.target) * 100)
            const done = g.progress >= g.target
            return (
              <li
                key={g.id}
                className={`rounded-xl border p-3 ${
                  done
                    ? 'border-mint-200 bg-mint-50 dark:border-mint-500/30 dark:bg-mint-500/10'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 text-sm">
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {g.label}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {g.progress} / {g.target}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-mint-400 to-sky-400"
                  />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {!done && (
                    <button
                      type="button"
                      onClick={() => bumpGoal(g.id)}
                      className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300"
                    >
                      <CheckIcon className="mr-1 inline-block h-3 w-3" />
                      +1 progress
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeGoal(g.id)}
                    className="ml-auto inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-rose-500"
                  >
                    <CloseIcon className="h-3 w-3" /> remove
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

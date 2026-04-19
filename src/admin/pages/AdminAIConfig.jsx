import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { DEFAULT_AI_WEIGHTS } from '../../data/admin'
import Slider from '../components/Slider'
import { SparkleIcon } from '../../components/icons'

const KEYS = [
  { key: 'academic', label: 'Academic Score', hint: 'Weight of marks, GPA, and transcripts' },
  { key: 'interest', label: 'Interest Match', hint: 'Alignment with stated preferences' },
  { key: 'aptitude', label: 'Aptitude Score', hint: 'Based on quiz performance and skills tests' },
  { key: 'strength', label: 'Strength/Weakness', hint: 'Derived from weak-area analysis' },
]

export default function AdminAIConfig() {
  const { aiWeights, setAIWeights, resetAIWeights } = useAdmin()
  const [local, setLocal] = useState(aiWeights)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => setLocal(aiWeights), [aiWeights])

  const total = Object.values(local).reduce((s, v) => s + v, 0)
  const balanced = total === 100

  const update = (k, v) => setLocal((prev) => ({ ...prev, [k]: v }))

  const save = () => {
    setAIWeights(local)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2200)
  }
  const reset = () => {
    resetAIWeights()
    setLocal(DEFAULT_AI_WEIGHTS)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">AI Configuration</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Tune how the recommendation engine weighs each factor. Changes apply globally.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="eg-card space-y-6 lg:col-span-2">
          {KEYS.map(({ key, label, hint }) => (
            <Slider
              key={key}
              label={label}
              hint={hint}
              value={local[key]}
              onChange={(v) => update(key, v)}
            />
          ))}

          <div
            className={`rounded-xl border px-3 py-2 text-sm ${
              balanced
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
                : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300'
            }`}
          >
            Total: {total}% {balanced ? '· balanced' : '· should sum to 100% for best results'}
          </div>

          <div className="flex gap-2">
            <button onClick={save} className="eg-btn-primary px-4 py-2 text-sm">
              <SparkleIcon className="mr-1.5 h-4 w-4" /> Apply changes
            </button>
            <button onClick={reset} className="eg-btn-ghost px-4 py-2 text-sm">
              Reset to default
            </button>
          </div>
        </div>

        <div className="eg-card relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10"
          />
          <div className="relative">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Live preview</h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              How a sample recommendation recomputes with your weights.
            </p>

            <div className="mt-4 space-y-3">
              {KEYS.map(({ key, label }) => {
                const raw = key === 'academic' ? 88 : key === 'interest' ? 74 : key === 'aptitude' ? 81 : 68
                const contribution = Math.round((raw * local[key]) / 100)
                return (
                  <div key={key}>
                    <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-300">
                      <span>{label}</span>
                      <span className="font-medium">
                        {raw} × {local[key]}% = {contribution}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        initial={false}
                        animate={{ width: `${(contribution / 100) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )
              })}

              <div className="mt-3 rounded-xl bg-white/70 p-3 text-sm text-gray-800 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900/60 dark:text-gray-100 dark:ring-gray-700">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Sample result
                </p>
                <p className="mt-1 font-semibold">
                  Recommended: Data Scientist · {Math.min(99, Math.round((88 * local.academic + 74 * local.interest + 81 * local.aptitude + 68 * local.strength) / 100))}% confidence
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 right-6 z-50 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-xl dark:bg-white dark:text-gray-900"
          >
            Recommendation logic updated
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

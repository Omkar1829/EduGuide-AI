import { motion } from 'framer-motion'
import { useAdmin } from '../../context/AdminContext'
import { AI_PROVIDERS_CATALOG, AI_TASKS } from '../../data/admin'
import { RouteIcon } from '../../components/icons'
import Slider from '../components/Slider'

function providerById(id) {
  return AI_PROVIDERS_CATALOG.find((p) => p.id === id)
}

function TaskRow({ task, routing, providers, onChange }) {
  const enabledProviders = AI_PROVIDERS_CATALOG.filter((p) => providers[p.id]?.enabled)
  const providerInfo = providerById(routing.provider)
  const providerState = providers[routing.provider]
  const isHealthy = providerState?.enabled && providerState?.status === 'connected'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">{task.label}</h3>
            {!isHealthy && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                Provider not connected
              </span>
            )}
          </div>
          <p className="mt-0.5 max-w-xl text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={!!routing.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
          />
          <span className="relative h-5 w-9 rounded-full bg-gray-300 transition-colors peer-checked:bg-indigo-600 dark:bg-gray-700">
            <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
          </span>
          {routing.enabled ? 'On' : 'Off'}
        </label>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Provider</label>
          <select
            value={routing.provider}
            onChange={(e) => {
              const nextCatalog = providerById(e.target.value)
              onChange({ provider: e.target.value, model: nextCatalog?.models[0] || '' })
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-indigo-900/40"
          >
            {enabledProviders.length === 0 && <option value={routing.provider}>No providers enabled</option>}
            {enabledProviders.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Model</label>
          <select
            value={routing.model}
            onChange={(e) => onChange({ model: e.target.value })}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-mono text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-indigo-900/40"
          >
            {(providerInfo?.models || []).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Slider
          label="Temperature"
          value={Math.round((routing.temperature || 0) * 100)}
          min={0}
          max={100}
          onChange={(v) => onChange({ temperature: v / 100 })}
          hint={`${(routing.temperature || 0).toFixed(2)} — ${
            routing.temperature < 0.3 ? 'precise' : routing.temperature < 0.7 ? 'balanced' : 'creative'
          }`}
        />
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Max tokens</label>
          <input
            type="number"
            min={64}
            max={8192}
            step={64}
            value={routing.maxTokens}
            onChange={(e) => onChange({ maxTokens: Number(e.target.value) })}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-indigo-900/40"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function AdminAITasks() {
  const { taskRouting, providers, updateTaskRouting } = useAdmin()

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <RouteIcon className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Task Routing</h1>
        </div>
        <p className="mt-1 max-w-3xl text-sm text-gray-500 dark:text-gray-400">
          Each AI-driven feature can be mapped to a different provider and model. Career recommendations, quiz
          generation and tutor replies are all produced by the models below — admins only review, not author.
        </p>
      </div>

      <div className="grid gap-4">
        {AI_TASKS.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            routing={taskRouting[task.id]}
            providers={providers}
            onChange={(patch) => updateTaskRouting(task.id, patch)}
          />
        ))}
      </div>
    </div>
  )
}

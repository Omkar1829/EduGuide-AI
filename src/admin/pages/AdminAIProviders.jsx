import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { AI_PROVIDERS_CATALOG } from '../../data/admin'
import { CheckCircleIcon, CpuIcon, EyeIcon, XCircleIcon } from '../../components/icons'

function StatusBadge({ status }) {
  if (status === 'connected') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Connected
      </span>
    )
  }
  if (status === 'testing') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" /> Testing…
      </span>
    )
  }
  if (status === 'error') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
        Connection failed
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
      Disabled
    </span>
  )
}

function ProviderCard({ catalog, state, onChange }) {
  const [showKey, setShowKey] = useState(false)
  const [localKey, setLocalKey] = useState(state.apiKey || '')
  const [localBase, setLocalBase] = useState(state.baseUrl || catalog.defaultBaseUrl || '')

  const runTest = () => {
    onChange({ status: 'testing' })
    setTimeout(() => {
      const ok = catalog.needsBaseUrl ? !!localBase : !!localKey
      onChange({
        apiKey: localKey,
        baseUrl: localBase,
        status: ok ? 'connected' : 'error',
      })
    }, 900)
  }

  const save = () => {
    onChange({
      apiKey: localKey,
      baseUrl: localBase,
      status: state.enabled ? (catalog.needsBaseUrl ? (localBase ? 'connected' : 'error') : localKey ? 'connected' : 'error') : 'disabled',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <CpuIcon className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">{catalog.name}</h3>
              <StatusBadge status={state.status} />
            </div>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{catalog.tagline}</p>
          </div>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={!!state.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked, status: e.target.checked ? state.status || 'disabled' : 'disabled' })}
          />
          <span className="relative h-5 w-9 rounded-full bg-gray-300 transition-colors peer-checked:bg-indigo-600 dark:bg-gray-700">
            <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
          </span>
          {state.enabled ? 'On' : 'Off'}
        </label>
      </div>

      <div className="grid gap-3">
        {catalog.keyLabel && (
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
              {catalog.keyLabel}
            </label>
            <div className="flex items-center gap-2">
              <input
                type={showKey ? 'text' : 'password'}
                value={localKey}
                onChange={(e) => setLocalKey(e.target.value)}
                placeholder={`Paste your ${catalog.name} API key`}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-mono text-gray-900 outline-none transition-shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-indigo-900/40"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                title={showKey ? 'Hide' : 'Show'}
              >
                <EyeIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        {catalog.needsBaseUrl && (
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
              Base URL
            </label>
            <input
              type="text"
              value={localBase}
              onChange={(e) => setLocalBase(e.target.value)}
              placeholder={catalog.defaultBaseUrl}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-mono text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-indigo-900/40"
            />
          </div>
        )}

        <div>
          <p className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-300">
            Available models ({catalog.models.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {catalog.models.map((m) => (
              <span
                key={m}
                className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-[11px] text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3 dark:border-gray-800">
        <a
          href={catalog.keyUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          {catalog.keyLabel ? 'Get API key →' : 'Install guide →'}
        </a>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={runTest}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {state.status === 'connected' ? (
              <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-500" />
            ) : state.status === 'error' ? (
              <XCircleIcon className="h-3.5 w-3.5 text-rose-500" />
            ) : null}
            Test connection
          </button>
          <button
            type="button"
            onClick={save}
            className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-indigo-700 hover:to-purple-700"
          >
            Save
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function AdminAIProviders() {
  const { providers, updateProvider } = useAdmin()
  const connectedCount = Object.values(providers).filter((p) => p.enabled && p.status === 'connected').length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">AI Providers</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Plug EduGuide into your preferred LLM providers. Keys are stored locally in this demo — never commit
            real keys to source control.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {connectedCount} of {AI_PROVIDERS_CATALOG.length} providers connected
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
        {AI_PROVIDERS_CATALOG.map((catalog) => (
          <ProviderCard
            key={catalog.id}
            catalog={catalog}
            state={providers[catalog.id] || { enabled: false, apiKey: '', baseUrl: '', status: 'disabled' }}
            onChange={(patch) => updateProvider(catalog.id, patch)}
          />
        ))}
      </div>
    </div>
  )
}

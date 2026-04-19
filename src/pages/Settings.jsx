import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

function Toggle({ checked, onChange, label, desc }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <span>
        <span className="block text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </span>
        {desc && (
          <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
            {desc}
          </span>
        )}
      </span>
      <span
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-300 dark:bg-gray-700'
        }`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  )
}

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [emailNotif, setEmailNotif] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [marketing, setMarketing] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Personalize EduGuide to match the way you learn.
        </p>
      </div>

      <section className="eg-card space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Appearance
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'light', label: 'Light', tint: 'from-amber-200 to-white' },
            { key: 'dark', label: 'Dark', tint: 'from-gray-700 to-gray-900' },
            { key: 'system', label: 'System', tint: 'from-indigo-200 to-gray-900' },
          ].map((opt) => {
            const active =
              opt.key === 'system' ? false : theme === opt.key
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  if (opt.key === 'system') {
                    localStorage.removeItem('eduguide-theme')
                    const prefersDark = window.matchMedia(
                      '(prefers-color-scheme: dark)'
                    ).matches
                    setTheme(prefersDark ? 'dark' : 'light')
                  } else {
                    setTheme(opt.key)
                  }
                }}
                className={`rounded-2xl border p-3 text-left transition-all hover:scale-[1.02] ${
                  active
                    ? 'border-brand-500 ring-2 ring-brand-500/30'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div
                  className={`h-14 rounded-xl bg-gradient-to-br ${opt.tint}`}
                />
                <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  {opt.label}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      <section className="eg-card space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Notifications
        </h2>
        <Toggle
          label="Email notifications"
          desc="Updates about your enrolled courses."
          checked={emailNotif}
          onChange={setEmailNotif}
        />
        <Toggle
          label="Weekly learning digest"
          desc="A Sunday summary of your progress and streak."
          checked={weeklyDigest}
          onChange={setWeeklyDigest}
        />
        <Toggle
          label="Product updates &amp; tips"
          desc="Occasional emails about new features."
          checked={marketing}
          onChange={setMarketing}
        />
      </section>

      <section className="eg-card space-y-3 border-red-200 dark:border-red-900/50">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Account
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Signing out will clear this session. Your progress is saved locally and
          will come back when you sign in again on this device.
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-900/60 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50"
        >
          Sign out
        </button>
      </section>
    </div>
  )
}

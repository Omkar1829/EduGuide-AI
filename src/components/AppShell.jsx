import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePresence } from '../context/PresenceContext'
import ThemeToggle from './ThemeToggle'
import Chatbot from './Chatbot'
import {
  BookIcon,
  BrainIcon,
  CloseIcon,
  FolderIcon,
  HelpIcon,
  HomeIcon,
  LogoutIcon,
  MenuIcon,
  SettingsIcon,
  ShieldIcon,
  TargetIcon,
  TrophyIcon,
  UserIcon,
} from './icons'

const NAV_ITEMS = [
  { to: '/app', label: 'Dashboard', Icon: HomeIcon, end: true },
  { to: '/app/tutor', label: 'AI Tutor', Icon: BrainIcon },
  { to: '/app/quiz', label: 'Adaptive Quiz', Icon: HelpIcon },
  { to: '/app/games', label: 'Knowledge Games', Icon: TargetIcon },
  { to: '/app/leaderboard', label: 'Leaderboard', Icon: TrophyIcon },
  { to: '/app/courses', label: 'Courses', Icon: BookIcon },
  { to: '/app/vault', label: 'Academic Vault', Icon: FolderIcon },
  { to: '/app/profile', label: 'Profile', Icon: UserIcon },
  { to: '/app/settings', label: 'Settings', Icon: SettingsIcon },
]

function PresencePill() {
  const { online } = usePresence()
  return (
    <span
      title="Students online right now"
      className="hidden items-center gap-2 rounded-full border border-mint-200 bg-mint-50 px-3 py-1 text-xs font-medium text-mint-700 sm:inline-flex dark:border-mint-500/30 dark:bg-mint-500/10 dark:text-mint-300"
    >
      <span className="relative inline-flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-mint-500" />
      </span>
      {online} students online
    </span>
  )
}

function SidebarContent({ onNavigate }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const initials = (user?.name || user?.email || '?')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex h-full flex-col">
      <NavLink
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-2 px-5 pb-4 pt-5"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M12 2 1 8l11 6 9-4.91V17h2V8L12 2z" />
          </svg>
        </span>
        <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
          EduGuide <span className="text-brand-600 dark:text-brand-400">AI</span>
        </span>
      </NavLink>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 border-t border-gray-200 p-3 dark:border-gray-800">
        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            onClick={onNavigate}
            className="mb-2 flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600/90 to-purple-600/90 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.01]"
          >
            <ShieldIcon className="h-4 w-4" /> Open admin panel
          </NavLink>
        )}
        <NavLink
          to="/app/profile"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {user?.name}
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>
          </div>
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <LogoutIcon className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  )
}

export default function AppShell() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 24, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:hidden"
            >
              <SidebarContent onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/70">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open sidebar"
              className="eg-btn-ghost lg:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <p className="hidden text-sm text-gray-500 dark:text-gray-400 sm:block">
              Welcome back — let&apos;s keep the streak going.
            </p>
            <div className="ml-auto flex items-center gap-2">
              <PresencePill />
              <NavLink to="/app/games" className="hidden eg-btn-ghost border border-gray-200 dark:border-gray-700 sm:inline-flex">
                Play games
              </NavLink>
              <ThemeToggle />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className={`eg-btn-ghost lg:hidden ${open ? 'inline-flex' : 'hidden'}`}
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <Chatbot />
    </div>
  )
}

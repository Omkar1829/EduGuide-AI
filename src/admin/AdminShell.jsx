import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import {
  BarChartIcon,
  BookIcon,
  BriefcaseIcon,
  ClipboardCheckIcon,
  CloseIcon,
  CpuIcon,
  FolderIcon,
  HelpIcon,
  HomeIcon,
  LogoutIcon,
  MenuIcon,
  RouteIcon,
  ShieldIcon,
  SlidersIcon,
  UsersIcon,
} from '../components/icons'

const NAV_ITEMS = [
  { to: '/admin', label: 'Overview', Icon: HomeIcon, end: true },
  { to: '/admin/users', label: 'Users', Icon: UsersIcon },
  { to: '/admin/documents', label: 'Academic Vault', Icon: FolderIcon },
  { to: '/admin/courses', label: 'Courses', Icon: BookIcon },
  { to: '/admin/jobs', label: 'Jobs', Icon: BriefcaseIcon },
  { to: '/admin/quiz', label: 'Quiz', Icon: HelpIcon },
  { group: 'AI' },
  { to: '/admin/ai-providers', label: 'AI Providers', Icon: CpuIcon },
  { to: '/admin/ai-tasks', label: 'Task Routing', Icon: RouteIcon },
  { to: '/admin/ai-review', label: 'Review Queue', Icon: ClipboardCheckIcon },
  { to: '/admin/ai-config', label: 'Weights', Icon: SlidersIcon },
  { group: 'Insights' },
  { to: '/admin/analytics', label: 'Analytics', Icon: BarChartIcon },
]

function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const initials = (user?.name || user?.email || '?')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="flex h-full flex-col">
      <NavLink to="/" onClick={onNavigate} className="flex items-center gap-2 px-5 pb-4 pt-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md">
          <ShieldIcon className="h-5 w-5" />
        </span>
        <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
          EduGuide <span className="text-brand-600 dark:text-brand-400">Admin</span>
        </span>
      </NavLink>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-2">
        {NAV_ITEMS.map((item, idx) => {
          if (item.group) {
            return (
              <p
                key={`grp-${idx}`}
                className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500"
              >
                {item.group}
              </p>
            )
          }
          const { to, label, Icon, end } = item
          return (
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
          )
        })}
      </nav>

      <div className="mt-4 border-t border-gray-200 p-3 dark:border-gray-800">
        <div className="flex items-center gap-3 rounded-xl p-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {user?.name}
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">Administrator</p>
          </div>
        </div>
        <NavLink
          to="/app"
          onClick={onNavigate}
          className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <HomeIcon className="h-4 w-4" /> Exit to student app
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <LogoutIcon className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  )
}

export default function AdminShell() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:block">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 24, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:hidden"
            >
              <div className="flex items-center justify-end p-3">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>
              <Sidebar onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
              <ShieldIcon className="h-3.5 w-3.5" /> Admin panel
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        <main className="container-page py-6 sm:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'
import { ANALYTICS } from '../../data/admin'
import {
  BookIcon,
  BriefcaseIcon,
  FolderIcon,
  SparkleIcon,
  UsersIcon,
} from '../../components/icons'
import StatsCard from '../components/StatsCard'
import { BarChart, DonutChart } from '../components/Chart'

function timeAgo(iso) {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  return `${days}d ago`
}

export default function AdminDashboard() {
  const { users, documents, courses, jobs, activity } = useAdmin()
  const active = users.filter((u) => u.status === 'active').length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Admin Overview</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Platform health at a glance.
          </p>
        </div>
        <Link to="/admin/ai-config" className="eg-btn-primary px-4 py-2 text-sm">
          <SparkleIcon className="mr-2 h-4 w-4" /> Tune AI weights
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard icon={UsersIcon} label="Total users" value={users.length} trend={12} tint="indigo" />
        <StatsCard icon={UsersIcon} label="Active users" value={active} trend={8} tint="emerald" />
        <StatsCard icon={FolderIcon} label="Documents" value={documents.length} trend={22} tint="sky" />
        <StatsCard icon={BookIcon} label="Courses" value={courses.length} trend={4} tint="amber" />
        <StatsCard icon={BriefcaseIcon} label="Jobs" value={jobs.length} trend={-3} tint="rose" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="eg-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active users · last 7 days</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">DAU</span>
          </div>
          <BarChart data={ANALYTICS.activeUsers7d} tint="indigo" height={200} />
        </div>
        <div className="eg-card">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Stream split</h2>
          <DonutChart data={ANALYTICS.streams} size={180} />
        </div>
      </div>

      <div className="eg-card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent activity</h2>
          <Link
            to="/admin/users"
            className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            See all
          </Link>
        </div>
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {activity.map((a, i) => (
            <motion.li
              key={a.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-semibold text-white">
                  {a.who
                    .split(' ')
                    .map((s) => s[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{a.who}</span> {a.action}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{timeAgo(a.at)}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  )
}

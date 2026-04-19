import { ANALYTICS } from '../../data/admin'
import { BarChart, DonutChart, LineChart } from '../components/Chart'

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Trends across the EduGuide AI platform.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="eg-card lg:col-span-1">
          <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
            Most-selected streams
          </h2>
          <DonutChart data={ANALYTICS.streams} size={180} />
        </div>

        <div className="eg-card lg:col-span-2">
          <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
            Popular courses
          </h2>
          <BarChart data={ANALYTICS.popularCourses} tint="indigo" height={220} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="eg-card">
          <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
            Weak-subject trend
          </h2>
          <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
            Average % of students flagged with weak Maths fundamentals, by month.
          </p>
          <LineChart data={ANALYTICS.weakTrend} tint="rose" height={200} />
        </div>

        <div className="eg-card">
          <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
            Active users · last 7 days
          </h2>
          <BarChart data={ANALYTICS.activeUsers7d} tint="sky" height={200} />
        </div>
      </div>
    </div>
  )
}

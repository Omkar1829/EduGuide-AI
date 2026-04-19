import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLearning } from '../context/LearningContext'
import { BookmarkIcon, ClockIcon, StarIcon } from './icons'

export default function CourseCard({ course, index = 0 }) {
  const { isEnrolled, isBookmarked, toggleBookmark, progressFor } = useLearning()
  const navigate = useNavigate()
  const enrolled = isEnrolled(course.id)
  const bookmarked = isBookmarked(course.id)
  const progress = progressFor(course.id)

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.04 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={() => navigate(`/app/courses/${course.id}`)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <div
        className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${course.color} text-5xl text-white`}
      >
        <span aria-hidden>{course.emoji}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            toggleBookmark(course.id)
          }}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark course'}
          className="absolute right-3 top-3 rounded-lg bg-white/20 p-1.5 text-white backdrop-blur transition-colors hover:bg-white/30"
        >
          <BookmarkIcon filled={bookmarked} className="h-4 w-4" />
        </button>
        <span className="absolute left-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">
          {course.level}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <span>{course.category}</span>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <span className="inline-flex items-center gap-1">
            <ClockIcon className="h-3.5 w-3.5" /> {course.durationHours}h
          </span>
        </div>
        <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
          {course.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
          {course.tagline}
        </p>

        <div className="mt-4 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1">
            <StarIcon className="h-3.5 w-3.5 text-yellow-400" />
            {course.rating.toFixed(1)}
          </span>
          <span>•</span>
          <span>{course.students.toLocaleString()} students</span>
        </div>

        {enrolled ? (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Progress</span>
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {progress}%
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 text-xs font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-brand-400">
            View details →
          </div>
        )}
      </div>
    </motion.article>
  )
}

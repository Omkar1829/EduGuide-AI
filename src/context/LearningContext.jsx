import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { COURSES } from '../data/courses'

const LearningContext = createContext({
  enrollments: {},
  bookmarks: {},
  enroll: () => {},
  unenroll: () => {},
  toggleBookmark: () => {},
  toggleLesson: () => {},
  isEnrolled: () => false,
  isBookmarked: () => false,
  progressFor: () => 0,
})

function storageKey(userId) {
  return `eduguide-learning:${userId || 'guest'}`
}

function loadState(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (!raw) return { enrollments: {}, bookmarks: {} }
    const parsed = JSON.parse(raw)
    return {
      enrollments: parsed.enrollments || {},
      bookmarks: parsed.bookmarks || {},
    }
  } catch {
    return { enrollments: {}, bookmarks: {} }
  }
}

export function LearningProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id || 'guest'

  const [state, setState] = useState(() => loadState(userId))

  // Reload when the user changes.
  useEffect(() => {
    setState(loadState(userId))
  }, [userId])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(userId), JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state, userId])

  const enroll = useCallback((courseId) => {
    setState((prev) => {
      if (prev.enrollments[courseId]) return prev
      return {
        ...prev,
        enrollments: {
          ...prev.enrollments,
          [courseId]: {
            enrolledAt: new Date().toISOString(),
            completedLessons: [],
          },
        },
      }
    })
  }, [])

  const unenroll = useCallback((courseId) => {
    setState((prev) => {
      if (!prev.enrollments[courseId]) return prev
      const next = { ...prev.enrollments }
      delete next[courseId]
      return { ...prev, enrollments: next }
    })
  }, [])

  const toggleBookmark = useCallback((courseId) => {
    setState((prev) => ({
      ...prev,
      bookmarks: { ...prev.bookmarks, [courseId]: !prev.bookmarks[courseId] },
    }))
  }, [])

  const toggleLesson = useCallback((courseId, lessonId) => {
    setState((prev) => {
      const existing = prev.enrollments[courseId] || {
        enrolledAt: new Date().toISOString(),
        completedLessons: [],
      }
      const set = new Set(existing.completedLessons)
      if (set.has(lessonId)) set.delete(lessonId)
      else set.add(lessonId)
      return {
        ...prev,
        enrollments: {
          ...prev.enrollments,
          [courseId]: {
            ...existing,
            completedLessons: Array.from(set),
          },
        },
      }
    })
  }, [])

  const helpers = useMemo(
    () => ({
      isEnrolled: (courseId) => Boolean(state.enrollments[courseId]),
      isBookmarked: (courseId) => Boolean(state.bookmarks[courseId]),
      isLessonComplete: (courseId, lessonId) =>
        Boolean(state.enrollments[courseId]?.completedLessons?.includes(lessonId)),
      progressFor: (courseId) => {
        const course = COURSES.find((c) => c.id === courseId)
        if (!course) return 0
        const enr = state.enrollments[courseId]
        if (!enr) return 0
        const total = course.lessons.length || 1
        const done = enr.completedLessons?.length || 0
        return Math.round((done / total) * 100)
      },
    }),
    [state]
  )

  const value = useMemo(
    () => ({
      enrollments: state.enrollments,
      bookmarks: state.bookmarks,
      enroll,
      unenroll,
      toggleBookmark,
      toggleLesson,
      ...helpers,
    }),
    [state, enroll, unenroll, toggleBookmark, toggleLesson, helpers]
  )

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>
}

export function useLearning() {
  return useContext(LearningContext)
}

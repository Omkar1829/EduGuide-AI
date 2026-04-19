import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_AI_WEIGHTS,
  SEED_ACTIVITY,
  SEED_DOCUMENTS,
  SEED_JOBS,
  SEED_QUIZ,
  SEED_USERS,
} from '../data/admin'
import { COURSES as SEED_COURSES } from '../data/courses'

const STORAGE_KEY = 'eduguide-admin'

const AdminContext = createContext(null)

function seed() {
  return {
    users: SEED_USERS,
    documents: SEED_DOCUMENTS,
    courses: SEED_COURSES.map((c) => ({
      id: c.id,
      title: c.title,
      category: c.category,
      description: c.description,
      eligibility: c.level,
    })),
    jobs: SEED_JOBS,
    quiz: SEED_QUIZ,
    activity: SEED_ACTIVITY,
    aiWeights: DEFAULT_AI_WEIGHTS,
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seed()
    const parsed = JSON.parse(raw)
    return { ...seed(), ...parsed }
  } catch {
    return seed()
  }
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export function AdminProvider({ children }) {
  const [state, setState] = useState(() => loadState())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore quota errors
    }
  }, [state])

  // Users
  const toggleUserStatus = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u,
      ),
    }))
  }, [])
  const deleteUser = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.filter((u) => u.id !== id),
      documents: prev.documents.filter((d) => d.userId !== id),
    }))
  }, [])

  // Documents
  const deleteDocument = useCallback((id) => {
    setState((prev) => ({ ...prev, documents: prev.documents.filter((d) => d.id !== id) }))
  }, [])

  // Courses
  const upsertCourse = useCallback((course) => {
    setState((prev) => {
      if (course.id && prev.courses.some((c) => c.id === course.id)) {
        return {
          ...prev,
          courses: prev.courses.map((c) => (c.id === course.id ? { ...c, ...course } : c)),
        }
      }
      return { ...prev, courses: [{ ...course, id: course.id || uid('c') }, ...prev.courses] }
    })
  }, [])
  const deleteCourse = useCallback((id) => {
    setState((prev) => ({ ...prev, courses: prev.courses.filter((c) => c.id !== id) }))
  }, [])

  // Jobs
  const upsertJob = useCallback((job) => {
    setState((prev) => {
      if (job.id && prev.jobs.some((j) => j.id === job.id)) {
        return { ...prev, jobs: prev.jobs.map((j) => (j.id === job.id ? { ...j, ...job } : j)) }
      }
      return { ...prev, jobs: [{ ...job, id: job.id || uid('j') }, ...prev.jobs] }
    })
  }, [])
  const deleteJob = useCallback((id) => {
    setState((prev) => ({ ...prev, jobs: prev.jobs.filter((j) => j.id !== id) }))
  }, [])

  // Quiz
  const upsertQuestion = useCallback((q) => {
    setState((prev) => {
      if (q.id && prev.quiz.some((x) => x.id === q.id)) {
        return { ...prev, quiz: prev.quiz.map((x) => (x.id === q.id ? { ...x, ...q } : x)) }
      }
      return { ...prev, quiz: [{ ...q, id: q.id || uid('q') }, ...prev.quiz] }
    })
  }, [])
  const deleteQuestion = useCallback((id) => {
    setState((prev) => ({ ...prev, quiz: prev.quiz.filter((x) => x.id !== id) }))
  }, [])

  // AI weights
  const setAIWeights = useCallback((weights) => {
    setState((prev) => ({ ...prev, aiWeights: { ...prev.aiWeights, ...weights } }))
  }, [])
  const resetAIWeights = useCallback(() => {
    setState((prev) => ({ ...prev, aiWeights: DEFAULT_AI_WEIGHTS }))
  }, [])

  const resetAll = useCallback(() => {
    setState(seed())
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      toggleUserStatus,
      deleteUser,
      deleteDocument,
      upsertCourse,
      deleteCourse,
      upsertJob,
      deleteJob,
      upsertQuestion,
      deleteQuestion,
      setAIWeights,
      resetAIWeights,
      resetAll,
    }),
    [
      state,
      toggleUserStatus,
      deleteUser,
      deleteDocument,
      upsertCourse,
      deleteCourse,
      upsertJob,
      deleteJob,
      upsertQuestion,
      deleteQuestion,
      setAIWeights,
      resetAIWeights,
      resetAll,
    ],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}

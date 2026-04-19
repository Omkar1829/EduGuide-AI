import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAuth } from './AuthContext'

export const VAULT_CATEGORIES = [
  'School',
  'Graduation',
  'Post Graduation',
  'Certifications',
]

const VaultContext = createContext({
  documents: [],
  addDocument: () => {},
  removeDocument: () => {},
  renameDocument: () => {},
})

function storageKey(userId) {
  return `eduguide-vault:${userId || 'guest'}`
}

// Cap how much we keep in localStorage. Data URIs are ~1.37x the raw size.
const MAX_PERSIST_PER_FILE = 750 * 1024 // 750 KB raw → ~1MB base64

function seedDocs() {
  const now = new Date()
  return [
    {
      id: 'seed-1',
      name: '10th Marksheet.pdf',
      category: 'School',
      mime: 'application/pdf',
      size: 820_000,
      uploadedAt: new Date(now.getFullYear() - 4, 3, 12).toISOString(),
      dataUrl: null,
    },
    {
      id: 'seed-2',
      name: '12th Marksheet.pdf',
      category: 'School',
      mime: 'application/pdf',
      size: 910_000,
      uploadedAt: new Date(now.getFullYear() - 2, 5, 3).toISOString(),
      dataUrl: null,
    },
    {
      id: 'seed-3',
      name: 'Semester 1 Result.pdf',
      category: 'Graduation',
      mime: 'application/pdf',
      size: 450_000,
      uploadedAt: new Date(now.getFullYear() - 1, 11, 20).toISOString(),
      dataUrl: null,
    },
    {
      id: 'seed-4',
      name: 'Python Bootcamp — Coursera.pdf',
      category: 'Certifications',
      mime: 'application/pdf',
      size: 310_000,
      uploadedAt: new Date(now.getFullYear(), now.getMonth() - 1, 4).toISOString(),
      dataUrl: null,
    },
  ]
}

function loadState(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (!raw) return { documents: seedDocs(), seeded: true }
    const parsed = JSON.parse(raw)
    return {
      documents: Array.isArray(parsed.documents) ? parsed.documents : [],
      seeded: Boolean(parsed.seeded),
    }
  } catch {
    return { documents: seedDocs(), seeded: true }
  }
}

export function VaultProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id || 'guest'

  const [state, setState] = useState(() => loadState(userId))

  useEffect(() => {
    setState(loadState(userId))
  }, [userId])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(userId), JSON.stringify(state))
    } catch {
      // Quota exceeded — persist metadata only as a fallback.
      try {
        const stripped = {
          ...state,
          documents: state.documents.map((d) => ({ ...d, dataUrl: null })),
        }
        localStorage.setItem(storageKey(userId), JSON.stringify(stripped))
      } catch {
        // ignore
      }
    }
  }, [state, userId])

  const addDocument = useCallback((doc) => {
    const persistDataUrl =
      doc.size && doc.size <= MAX_PERSIST_PER_FILE ? doc.dataUrl : null
    const entry = {
      id: doc.id || `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: doc.name,
      category: doc.category,
      mime: doc.mime,
      size: doc.size,
      uploadedAt: doc.uploadedAt || new Date().toISOString(),
      dataUrl: persistDataUrl,
    }
    setState((prev) => ({ ...prev, documents: [entry, ...prev.documents] }))
    return entry
  }, [])

  const removeDocument = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== id),
    }))
  }, [])

  const renameDocument = useCallback((id, name) => {
    setState((prev) => ({
      ...prev,
      documents: prev.documents.map((d) =>
        d.id === id ? { ...d, name } : d,
      ),
    }))
  }, [])

  const value = useMemo(
    () => ({
      documents: state.documents,
      addDocument,
      removeDocument,
      renameDocument,
    }),
    [state.documents, addDocument, removeDocument, renameDocument],
  )

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>
}

export function useVault() {
  return useContext(VaultContext)
}

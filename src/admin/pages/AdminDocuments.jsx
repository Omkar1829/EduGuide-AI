import { useMemo, useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { DOC_CATEGORIES } from '../../data/admin'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import {
  EyeIcon,
  FileTextIcon,
  ImageIcon,
  SearchIcon,
  TrashIcon,
} from '../../components/icons'

function formatSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function FileIcon({ mime }) {
  const isImg = mime?.startsWith('image/')
  return (
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-xl text-white ${
        isImg
          ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
          : 'bg-gradient-to-br from-rose-500 to-orange-500'
      }`}
    >
      {isImg ? <ImageIcon className="h-4 w-4" /> : <FileTextIcon className="h-4 w-4" />}
    </div>
  )
}

export default function AdminDocuments() {
  const { documents, users, deleteDocument } = useAdmin()
  const [q, setQ] = useState('')
  const [userId, setUserId] = useState('All')
  const [category, setCategory] = useState('All')
  const [preview, setPreview] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const userById = useMemo(() => Object.fromEntries(users.map((u) => [u.id, u])), [users])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return documents.filter((d) => {
      if (userId !== 'All' && d.userId !== userId) return false
      if (category !== 'All' && d.category !== category) return false
      if (!needle) return true
      return d.name.toLowerCase().includes(needle)
    })
  }, [documents, q, userId, category])

  const columns = [
    {
      key: 'name',
      label: 'Document',
      render: (d) => (
        <div className="flex items-center gap-3">
          <FileIcon mime={d.mime} />
          <div>
            <p className="font-medium text-gray-900 dark:text-white" title={d.name}>
              {d.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {d.mime?.includes('pdf') ? 'PDF' : 'Image'} · {formatSize(d.size)}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'user',
      label: 'Uploaded by',
      render: (d) => userById[d.userId]?.name || '—',
    },
    { key: 'category', label: 'Category' },
    {
      key: 'uploadedAt',
      label: 'Uploaded',
      render: (d) => new Date(d.uploadedAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (d) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setPreview(d)}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
          >
            <EyeIcon className="h-4 w-4" /> Preview
          </button>
          <button
            onClick={() => setConfirmDelete(d)}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
          >
            <TrashIcon className="h-4 w-4" /> Delete
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Academic Vault</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {filtered.length} of {documents.length} documents across all users.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search document name"
            className="eg-input pl-9"
          />
        </div>
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="eg-input w-auto"
        >
          <option value="All">All users</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="eg-input w-auto"
        >
          <option>All</option>
          {DOC_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <DataTable columns={columns} rows={filtered} empty="No documents match your filters" />

      <Modal open={!!preview} onClose={() => setPreview(null)} title="Document preview" size="lg">
        {preview && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FileIcon mime={preview.mime} />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{preview.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userById[preview.userId]?.name} · {preview.category} ·{' '}
                  {new Date(preview.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-400">
              Preview of user-owned documents is not exposed in admin view for privacy.
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete document?"
        size="sm"
        footer={
          <>
            <button
              onClick={() => setConfirmDelete(null)}
              className="eg-btn-ghost px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                deleteDocument(confirmDelete.id)
                setConfirmDelete(null)
              }}
              className="eg-btn bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Remove <span className="font-medium">{confirmDelete?.name}</span> from the vault?
        </p>
      </Modal>
    </div>
  )
}

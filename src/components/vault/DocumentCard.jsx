import { motion } from 'framer-motion'
import { useState } from 'react'
import { useVault } from '../../context/VaultContext'
import {
  DownloadIcon,
  EyeIcon,
  FileTextIcon,
  ImageIcon,
  PencilIcon,
  TrashIcon,
} from '../icons'

function formatSize(bytes) {
  if (!bytes) return '—'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(0)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return '—'
  }
}

export default function DocumentCard({ doc, onPreview, index = 0 }) {
  const { removeDocument, renameDocument } = useVault()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(doc.name)

  const isImage = (doc.mime || '').startsWith('image/')
  const Icon = isImage ? ImageIcon : FileTextIcon
  const tint = isImage
    ? 'from-emerald-500 to-teal-500'
    : 'from-rose-500 to-orange-500'
  const badge = isImage ? 'Image' : doc.mime?.includes('pdf') ? 'PDF' : 'File'

  const handleDownload = () => {
    if (!doc.dataUrl) return
    const a = document.createElement('a')
    a.href = doc.dataUrl
    a.download = doc.name
    a.click()
  }

  const confirmDelete = () => {
    if (window.confirm(`Delete "${doc.name}"? This can't be undone.`)) {
      removeDocument(doc.id)
    }
  }

  const commitRename = () => {
    const next = draft.trim()
    if (next && next !== doc.name) renameDocument(doc.id, next)
    else setDraft(doc.name)
    setEditing(false)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -3 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <button
        type="button"
        onClick={() => onPreview(doc)}
        className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${tint} text-white`}
      >
        <Icon className="h-10 w-10 opacity-90" />
        <span className="absolute left-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide backdrop-blur">
          {badge}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-medium backdrop-blur">
          {doc.category}
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename()
              if (e.key === 'Escape') {
                setDraft(doc.name)
                setEditing(false)
              }
            }}
            className="eg-input !py-1.5 text-sm"
          />
        ) : (
          <h3
            className="truncate text-sm font-semibold text-gray-900 dark:text-white"
            title={doc.name}
          >
            {doc.name}
          </h3>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{fmtDate(doc.uploadedAt)}</span>
          <span>{formatSize(doc.size)}</span>
        </div>

        <div className="mt-auto flex items-center gap-1 pt-2">
          <button
            type="button"
            onClick={() => onPreview(doc)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            title="Preview"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!doc.dataUrl}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            title={doc.dataUrl ? 'Download' : 'Download unavailable (not stored)'}
          >
            <DownloadIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            title="Rename"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-gray-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}

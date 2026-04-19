import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { VAULT_CATEGORIES, useVault } from '../../context/VaultContext'
import { UploadIcon } from '../icons'

const ACCEPTED = ['application/pdf', 'image/png', 'image/jpeg']

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function UploadArea() {
  const { addDocument } = useVault()
  const [dragging, setDragging] = useState(false)
  const [category, setCategory] = useState(VAULT_CATEGORIES[0])
  const [items, setItems] = useState([]) // { id, name, progress, status }
  const inputRef = useRef(null)

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList).filter((f) => ACCEPTED.includes(f.type))
    for (const file of files) {
      const tempId = `up-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      setItems((prev) => [
        ...prev,
        { id: tempId, name: file.name, progress: 0, status: 'uploading' },
      ])

      // Fake progress ticks for a realistic UX.
      let pct = 0
      const timer = setInterval(() => {
        pct = Math.min(pct + 8 + Math.random() * 14, 92)
        setItems((prev) =>
          prev.map((it) => (it.id === tempId ? { ...it, progress: pct } : it)),
        )
      }, 100)

      try {
        const dataUrl = await readFile(file)
        clearInterval(timer)
        addDocument({
          name: file.name,
          category,
          mime: file.type,
          size: file.size,
          dataUrl,
        })
        setItems((prev) =>
          prev.map((it) =>
            it.id === tempId ? { ...it, progress: 100, status: 'done' } : it,
          ),
        )
        setTimeout(() => {
          setItems((prev) => prev.filter((it) => it.id !== tempId))
        }, 900)
      } catch {
        clearInterval(timer)
        setItems((prev) =>
          prev.map((it) =>
            it.id === tempId ? { ...it, status: 'error' } : it,
          ),
        )
      }
    }
  }

  return (
    <section className="eg-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Upload documents
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PDF, PNG, or JPG · max 10 MB per file
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="eg-input !w-auto !py-1.5"
          >
            {VAULT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files)
        }}
        className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          dragging
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
            : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-brand-400 dark:hover:bg-gray-800/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,image/png,image/jpeg"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files)
            e.target.value = ''
          }}
        />
        <motion.span
          animate={dragging ? { y: [-2, 2, -2] } : { y: 0 }}
          transition={{ repeat: dragging ? Infinity : 0, duration: 0.8 }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md"
        >
          <UploadIcon className="h-6 w-6" />
        </motion.span>
        <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-200">
          Drag and drop files here, or{' '}
          <span className="text-brand-600 underline-offset-2 hover:underline dark:text-brand-400">
            browse
          </span>
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          They&apos;ll be saved to your {category} folder.
        </p>
      </label>

      {items.length > 0 && (
        <ul className="mt-4 space-y-2">
          {items.map((it) => (
            <motion.li
              key={it.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-gray-200 p-3 dark:border-gray-700"
            >
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="truncate font-medium text-gray-800 dark:text-gray-100">
                  {it.name}
                </span>
                <span
                  className={`font-semibold ${
                    it.status === 'error'
                      ? 'text-rose-500'
                      : it.status === 'done'
                        ? 'text-emerald-500'
                        : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {it.status === 'error'
                    ? 'Failed'
                    : it.status === 'done'
                      ? 'Done'
                      : `${Math.round(it.progress)}%`}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${it.progress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                  className={`h-full rounded-full ${
                    it.status === 'error'
                      ? 'bg-rose-500'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                  }`}
                />
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  )
}

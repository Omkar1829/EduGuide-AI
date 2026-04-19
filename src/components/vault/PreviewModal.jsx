import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { CloseIcon, DownloadIcon, FileTextIcon, ImageIcon } from '../icons'

export default function PreviewModal({ doc, onClose }) {
  useEffect(() => {
    if (!doc) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [doc, onClose])

  const isImage = doc?.mime?.startsWith('image/')
  const isPdf = doc?.mime?.includes('pdf')

  return (
    <AnimatePresence>
      {doc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
          >
            <header className="flex items-center gap-3 border-b border-gray-200 px-5 py-3 dark:border-gray-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                {isImage ? <ImageIcon className="h-4 w-4" /> : <FileTextIcon className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {doc.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {doc.category} • Uploaded{' '}
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              {doc.dataUrl && (
                <a
                  href={doc.dataUrl}
                  download={doc.name}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <DownloadIcon className="h-3.5 w-3.5" />
                  Download
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                aria-label="Close"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </header>

            <div className="flex flex-1 items-center justify-center overflow-auto bg-gray-50 dark:bg-gray-950">
              {!doc.dataUrl ? (
                <EmptyPreview doc={doc} />
              ) : isImage ? (
                <img
                  src={doc.dataUrl}
                  alt={doc.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : isPdf ? (
                <iframe
                  title={doc.name}
                  src={doc.dataUrl}
                  className="h-full w-full border-0"
                />
              ) : (
                <EmptyPreview doc={doc} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function EmptyPreview({ doc }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md">
        <FileTextIcon className="h-6 w-6" />
      </div>
      <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-200">
        Preview unavailable
      </p>
      <p className="mt-1 max-w-xs text-xs text-gray-500 dark:text-gray-400">
        {doc?.size > 750 * 1024
          ? 'Large files aren’t kept in browser storage. Re-upload to preview.'
          : 'This file has no stored preview yet.'}
      </p>
    </div>
  )
}

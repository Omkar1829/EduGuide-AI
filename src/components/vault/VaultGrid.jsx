import { AnimatePresence } from 'framer-motion'
import DocumentCard from './DocumentCard'
import { VAULT_CATEGORIES } from '../../context/VaultContext'
import { FolderIcon } from '../icons'

export default function VaultGrid({ documents, grouped = true, onPreview }) {
  if (documents.length === 0) {
    return (
      <section className="eg-card flex flex-col items-center justify-center py-14 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md">
          <FolderIcon className="h-6 w-6" />
        </div>
        <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-200">
          No documents match your filters.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Try a different category or clear the search.
        </p>
      </section>
    )
  }

  if (!grouped) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence>
          {documents.map((d, i) => (
            <DocumentCard key={d.id} doc={d} index={i} onPreview={onPreview} />
          ))}
        </AnimatePresence>
      </div>
    )
  }

  const byCategory = VAULT_CATEGORIES.map((cat) => ({
    cat,
    docs: documents.filter((d) => d.category === cat),
  })).filter((g) => g.docs.length > 0)

  return (
    <div className="space-y-8">
      {byCategory.map(({ cat, docs }) => (
        <section key={cat}>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {cat}
              </h3>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {docs.length}
              </span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {docs.map((d, i) => (
                <DocumentCard key={d.id} doc={d} index={i} onPreview={onPreview} />
              ))}
            </AnimatePresence>
          </div>
        </section>
      ))}
    </div>
  )
}

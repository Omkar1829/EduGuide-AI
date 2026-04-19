import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useVault } from '../context/VaultContext'
import UploadArea from '../components/vault/UploadArea'
import FilterBar from '../components/vault/FilterBar'
import VaultGrid from '../components/vault/VaultGrid'
import PreviewModal from '../components/vault/PreviewModal'
import { FolderIcon, LockIcon, SparkleIcon } from '../components/icons'

export default function Vault() {
  const { documents } = useVault()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [previewDoc, setPreviewDoc] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return documents.filter((d) => {
      if (category !== 'All' && d.category !== category) return false
      if (q && !d.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [documents, query, category])

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md">
            <FolderIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Academic Vault
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Secure storage for every marksheet, result, degree and certificate.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
          <LockIcon className="h-3.5 w-3.5" />
          Encrypted in your browser
        </div>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-5 text-white shadow-lg"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.22),_transparent_60%)]"
        />
        <div className="relative flex flex-wrap items-center gap-3">
          <SparkleIcon className="h-5 w-5" />
          <p className="text-sm font-medium">
            Your uploaded academic records are being used to improve recommendations.
          </p>
          <span className="ml-auto rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
            {documents.length} document{documents.length === 1 ? '' : 's'} analyzed
          </span>
        </div>
      </motion.section>

      <UploadArea />

      <FilterBar
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        count={filtered.length}
      />

      <VaultGrid
        documents={filtered}
        grouped={category === 'All' && query.trim() === ''}
        onPreview={setPreviewDoc}
      />

      <PreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
    </div>
  )
}

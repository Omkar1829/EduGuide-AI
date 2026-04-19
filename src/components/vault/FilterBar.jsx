import { VAULT_CATEGORIES } from '../../context/VaultContext'
import { SearchIcon } from '../icons'

export default function FilterBar({ query, onQueryChange, category, onCategoryChange, count }) {
  const options = ['All', ...VAULT_CATEGORIES]
  return (
    <section className="eg-card">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search documents by name…"
            className="eg-input !pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {options.map((c) => {
            const active = c === category
            return (
              <button
                key={c}
                type="button"
                onClick={() => onCategoryChange(c)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {c}
              </button>
            )
          })}
        </div>
        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
          {count} document{count === 1 ? '' : 's'}
        </span>
      </div>
    </section>
  )
}

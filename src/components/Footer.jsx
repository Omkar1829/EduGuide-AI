export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white/60 py-10 dark:border-gray-800 dark:bg-gray-900/60">
      <div className="container-page flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M12 2 1 8l11 6 9-4.91V17h2V8L12 2z" />
            </svg>
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            EduGuide AI
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} EduGuide AI. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <a href="#" className="hover:text-gray-900 dark:hover:text-white">
            Privacy
          </a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white">
            Terms
          </a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}

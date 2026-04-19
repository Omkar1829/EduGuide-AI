import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="text-center">
        <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">404</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link to="/" className="eg-btn-primary mt-6 inline-flex">
          Go home
        </Link>
      </div>
    </div>
  )
}

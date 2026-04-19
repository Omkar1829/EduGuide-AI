import { motion } from 'framer-motion'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    sub: 'forever',
    tagline: 'Get started with the basics.',
    features: [
      'AI tutor: 20 messages / day',
      '1 active study plan',
      'Basic quizzes',
      'Community support',
    ],
    cta: 'Start free',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$9',
    sub: '/month',
    tagline: 'For serious students.',
    features: [
      'Unlimited AI tutor',
      'Unlimited study plans',
      'Advanced quizzes &amp; flashcards',
      'Progress analytics',
      'Priority support',
    ],
    cta: 'Go Pro',
    featured: true,
  },
  {
    name: 'Teams',
    price: 'Custom',
    sub: '',
    tagline: 'Schools, tutors and classrooms.',
    features: [
      'Everything in Pro',
      'Classroom dashboards',
      'SSO &amp; admin controls',
      'Dedicated success manager',
    ],
    cta: 'Contact sales',
    featured: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="container-page py-20 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
          Simple, honest pricing
        </h2>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          Start free. Upgrade when you're ready.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {PLANS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className={`eg-card relative flex flex-col ${
              p.featured
                ? 'ring-2 ring-brand-500 dark:ring-brand-400'
                : ''
            }`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {p.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {p.tagline}
            </p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {p.price}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {p.sub}
              </span>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                  <span dangerouslySetInnerHTML={{ __html: f }} />
                </li>
              ))}
            </ul>
            <a
              href="#cta"
              className={`mt-8 w-full text-center ${
                p.featured ? 'eg-btn-primary' : 'eg-btn-ghost border border-gray-200 dark:border-gray-700'
              }`}
            >
              {p.cta}
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

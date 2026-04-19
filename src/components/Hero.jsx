import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-300/40 via-purple-300/30 to-pink-200/20 blur-3xl dark:from-indigo-700/20 dark:via-purple-700/10 dark:to-pink-700/10" />
      </div>

      <div className="container-page py-20 sm:py-28">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/60 px-3 py-1 text-xs font-medium text-gray-600 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300"
          >
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
            Now in public beta
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white"
          >
            Your personal{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI study guide
            </span>{' '}
            for smarter learning
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-2xl text-base text-gray-500 sm:text-lg dark:text-gray-400"
          >
            EduGuide AI builds personalized study plans, explains concepts in
            plain English, and quizzes you on what matters — so you learn faster
            and remember longer.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <a href="#cta" className="eg-btn-primary px-6 py-3 text-base">
              Start learning free
            </a>
            <a
              href="#features"
              className="eg-btn-ghost px-6 py-3 text-base"
            >
              See how it works
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500 dark:text-gray-400"
          >
            <span>⭐ 4.9 / 5 by 12,400+ learners</span>
            <span>🔒 Private &amp; secure</span>
            <span>⚡ Works on any device</span>
          </motion.div>
        </motion.div>

        {/* Mocked product preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
          className="mx-auto mt-16 max-w-5xl"
        >
          <div className="eg-card p-0 shadow-lg">
            <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-gray-500 dark:text-gray-400">
                eduguide.ai / dashboard
              </span>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-3">
              {[
                {
                  title: "Today's plan",
                  sub: '3 topics • 45 min',
                  stat: '72%',
                  tint: 'from-indigo-500/10 to-purple-500/10',
                },
                {
                  title: 'Weak areas',
                  sub: 'Calculus, Organic Chem',
                  stat: '2',
                  tint: 'from-pink-500/10 to-orange-500/10',
                },
                {
                  title: 'Streak',
                  sub: 'Keep it going!',
                  stat: '14d',
                  tint: 'from-emerald-500/10 to-teal-500/10',
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className={`rounded-xl border border-gray-200 bg-gradient-to-br ${c.tint} p-4 dark:border-gray-700`}
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {c.title}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                    {c.stat}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {c.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

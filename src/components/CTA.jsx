import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section id="cta" className="container-page py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-10 text-center shadow-lg sm:p-16"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.25),_transparent_60%)]"
        />
        <h2 className="relative text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Learn smarter, not harder.
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-indigo-100">
          Join thousands of students who study less and remember more with
          EduGuide AI.
        </p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-md transition-all hover:scale-[1.03] hover:shadow-lg"
          >
            Get started free
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Learn more
          </a>
        </div>
      </motion.div>
    </section>
  )
}

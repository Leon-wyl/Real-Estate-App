import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 | Leon Real Estate</title>
      </Helmet>

      <PageShell className="flex items-center justify-center !py-0">
        <div className="relative flex min-h-[70vh] w-full flex-col items-center justify-center text-center">
          {/* Decorative gold lines */}
          <div className="pointer-events-none absolute left-0 right-0 top-1/3 flex items-center justify-center gap-6 opacity-20">
            <span className="h-px w-24 bg-gradient-to-r from-transparent to-gold" />
            <span className="h-2 w-2 rounded-full bg-gold" />
            <span className="h-px w-24 bg-gradient-to-l from-transparent to-gold" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-6"
          >
            <motion.h1
              className="gold-gradient-text font-display text-8xl font-bold tracking-tight sm:text-9xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              404
            </motion.h1>

            <motion.h2
              className="font-display text-2xl font-semibold text-foreground sm:text-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Page Not Found
            </motion.h2>

            <motion.p
              className="mx-auto max-w-md text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-gold/20 transition-all duration-200 hover:bg-gold/90"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </motion.div>
          </motion.div>

          {/* Decorative bottom element */}
          <div className="pointer-events-none absolute bottom-20 left-1/2 -translate-x-1/2 opacity-10">
            <div className="h-32 w-px bg-gradient-to-b from-transparent via-gold to-transparent" />
          </div>
        </div>
      </PageShell>
    </>
  )
}

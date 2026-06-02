import { useLoaderData, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Award, Building2 } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { PageShell } from '@/components/layout/PageShell'
import { PropertyGrid } from '@/components/property/PropertyGrid'
import { EmptyState } from '@/components/shared/EmptyState'
import { SearchBar } from '@/components/search/SearchBar'
import type { Post } from '@/lib/types'

const stats = [
  { icon: Home, value: '16+', label: 'Years Experience' },
  { icon: Award, value: '200+', label: 'Awards Won' },
  { icon: Building2, value: '2,000+', label: 'Properties Sold' },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.15,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
}

export default function HomePage() {
  const { posts } = useLoaderData() as { posts: Post[] }

  return (
    <>
      <Helmet>
        <title>Leon Real Estate — Premium Properties</title>
        <meta
          name="description"
          content="Discover luxury properties for sale and rent. Expert real estate services."
        />
      </Helmet>

      <PageShell className="!py-0">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-surface py-20 sm:py-28 lg:py-36">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsla(var(--gold)/0.12),_transparent_70%)]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE4YzEuNjU3IDAgMy0xLjM0MyAzLTNzLTEuMzQzLTMtMy0zLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzem0tMjQgMGMxLjY1NyAwIDMtMS4zNDMgMy0zcy0xLjM0My0zLTMtMy0zIDEuMzQzLTMgMyAxLjM0MyAzIDMgM3oiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
          <div className="page-shell relative z-10 mx-auto flex flex-col items-center text-center">
            <motion.h1
              className="gold-gradient-text max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Find Your Dream Home
            </motion.h1>
            <motion.p
              className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              Premium Properties, Exceptional Service
            </motion.p>

            {/* Search Bar */}
            <motion.div
              className="mt-10 w-full max-w-3xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.25,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <SearchBar />
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              className="mt-14 grid w-full max-w-3xl grid-cols-3 gap-4 sm:gap-8"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="flex flex-col items-center gap-2 rounded-lg border border-gold/20 bg-surface/80 px-3 py-5 backdrop-blur-sm transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_24px_rgba(212,175,55,0.08)]"
                  variants={fadeInUp}
                  custom={i}
                >
                  <stat.icon className="h-6 w-6 text-gold" />
                  <span className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="py-16 sm:py-24">
          <div className="page-shell mx-auto">
            <motion.div
              className="mb-10 flex items-end justify-between"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div>
                <h2 className="section-title">Featured Properties</h2>
                <p className="section-subtitle">
                  Hand-picked exclusive listings
                </p>
              </div>
              <Link
                to="/list"
                className="shrink-0 text-sm font-medium text-gold transition-colors hover:text-gold/80"
              >
                View All →
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {posts.length > 0 ? (
                <PropertyGrid properties={posts} />
              ) : (
                <EmptyState
                  title="No featured properties yet"
                  description="Check back soon for new listings."
                  action={{ label: 'Browse All Listings', to: '/list' }}
                />
              )}
            </motion.div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative overflow-hidden bg-surface py-16 sm:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsla(var(--gold)/0.08),_transparent_70%)]" />
          <motion.div
            className="page-shell relative z-10 mx-auto flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h2 className="gold-gradient-text font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to find your perfect property?
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Let our experts guide you through the finest selection of premium
              real estate.
            </p>
            <Link
              to="/list"
              className="mt-8 inline-flex h-11 items-center justify-center rounded-md bg-gold px-8 text-base font-medium text-accent-foreground shadow-lg shadow-gold/20 transition-all duration-200 hover:bg-gold/90"
            >
              Browse All Listings
            </Link>
          </motion.div>
        </section>
      </PageShell>
    </>
  )
}

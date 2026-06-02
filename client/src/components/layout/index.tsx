import { Outlet } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from '@/vendor/ui/sonner'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'

export function Layout() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1 pb-16 md:pb-0">
            <Outlet />
          </div>
          <Footer />
          <BottomNav />
        </div>
        <Toaster position="bottom-right" richColors closeButton />
      </ErrorBoundary>
    </HelmetProvider>
  )
}

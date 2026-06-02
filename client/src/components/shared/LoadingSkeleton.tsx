import { Skeleton } from '@/vendor/ui/skeleton'
import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  variant?: 'cards' | 'single' | 'form' | 'fullscreen'
  className?: string
}

export function LoadingSkeleton({
  variant = 'cards',
  className,
}: LoadingSkeletonProps) {
  if (variant === 'fullscreen') {
    return <LoadingScreen />
  }

  if (variant === 'single') {
    return (
      <div className={cn('space-y-6', className)}>
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-4 w-80" />
        </div>
      </div>
    )
  }

  if (variant === 'form') {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    )
  }

  // cards — default grid
  return (
    <div
      className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}
      role="status"
      aria-label="Loading properties"
      aria-busy="true"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="font-display text-2xl font-bold text-gold">
            Leon
          </span>
          <span className="font-display text-2xl font-light text-muted-foreground">
            Real Estate
          </span>
        </div>
        <div className="h-0.5 w-24 animate-pulse rounded-full bg-gold" />
      </div>
    </div>
  )
}

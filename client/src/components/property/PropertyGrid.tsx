import { cn } from '@/lib/utils'
import { PropertyCard } from '@/components/property/PropertyCard'
import type { Post } from '@/lib/types'

interface PropertyGridProps {
  properties: Post[]
  className?: string
}

export function PropertyGrid({ properties, className }: PropertyGridProps) {
  return (
    <div
      className={cn(
        'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
      aria-label="Property listings"
    >
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}

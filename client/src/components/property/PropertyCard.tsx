import { Link } from 'react-router-dom'
import { Bed, Bath, MapPin } from 'lucide-react'
import { SaveButton } from '@/components/property/SaveButton'
import { Badge } from '@/vendor/ui/badge'
import { formatPrice, capitalize, handleImgError } from '@/lib/utils'
import type { Post } from '@/lib/types'

interface PropertyCardProps {
  property: Post
}

export function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.images?.[0] || '/placeholder.jpg'

  return (
    <Link
      to={`/${property.id}`}
      className="luxury-card group overflow-hidden p-0"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={mainImage}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={handleImgError}
        />
        {/* Save button overlay */}
        <div className="absolute right-3 top-3 z-10">
          <SaveButton postId={property.id} isSaved={property.isSaved} />
        </div>
        {/* Type badge */}
        <Badge
          variant="gold"
          className="absolute left-3 top-3 z-10 uppercase tracking-wider"
        >
          {capitalize(property.type)}
        </Badge>
        {/* Price overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <span className="font-display text-xl font-bold text-white">
            {formatPrice(property.price)}
            {property.type === 'rent' && (
              <span className="text-sm font-normal text-white/70">/mo</span>
            )}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="truncate font-display text-base font-semibold text-foreground">
          {property.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {property.address}, {property.city}
          </span>
        </p>
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            {property.bedroom} Beds
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {property.bathroom} Baths
          </span>
        </div>
      </div>
    </Link>
  )
}

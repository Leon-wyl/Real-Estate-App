import { useState, useMemo } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Search } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { FilterSidebar } from '@/components/search/FilterSidebar'
import { FilterSheet } from '@/components/search/FilterSheet'
import { PropertyGrid } from '@/components/property/PropertyGrid'
import { ViewToggle } from '@/components/map/ViewToggle'
import { MapView } from '@/components/map/MapView'
import { EmptyState } from '@/components/shared/EmptyState'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { Post } from '@/lib/types'

interface LoaderData {
  posts: Post[]
  filters: Record<string, string>
}

export default function ListingsPage() {
  const { posts } = useLoaderData() as LoaderData
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [view, setView] = useState<'grid' | 'map'>('grid')

  const mapItems = useMemo(
    () =>
      posts.map((p) => ({
        id: p.id,
        title: p.title,
        latitude: p.latitude,
        longitude: p.longitude,
        price: p.price,
        bedroom: p.bedroom,
        images: p.images,
      })),
    [posts],
  )

  const defaultCenter = useMemo((): [number, number] => {
    if (posts.length === 0) return [40.7128, -74.006]
    const lat = parseFloat(posts[0].latitude)
    const lng = parseFloat(posts[0].longitude)
    if (isNaN(lat) || isNaN(lng)) return [40.7128, -74.006]
    return [lat, lng]
  }, [posts])

  return (
    <>
      <Helmet>
        <title>Property Listings | Leon Real Estate</title>
        <meta
          name="description"
          content="Browse and filter premium properties for sale and rent. Find your dream home with Leon Real Estate."
        />
      </Helmet>
      <PageShell>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="section-title">
              <span className="gold-gradient-text">Property Listings</span>
            </h1>
            <p className="section-subtitle">
              {posts.length} propert{posts.length === 1 ? 'y' : 'ies'} found
            </p>
          </div>
          {!isDesktop && (
            <div className="flex items-center gap-2">
              <FilterSheet />
              <ViewToggle view={view} onChange={setView} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex gap-8">
          {isDesktop && <FilterSidebar className="hidden md:flex" />}

          <div className="min-w-0 flex-1">
            {posts.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No properties match your filters"
                description="Try adjusting your search criteria or clearing filters to see more results."
                action={{
                  label: 'Clear Filters',
                  onClick: () => {
                    navigate('/list')
                  },
                }}
              />
            ) : view === 'map' && !isDesktop ? (
              <div className="h-[calc(100vh-13rem)]">
                <MapView items={mapItems} center={defaultCenter} zoom={12} />
              </div>
            ) : (
              <PropertyGrid
                properties={posts}
                className="lg:grid-cols-2 xl:grid-cols-3"
              />
            )}
          </div>
        </div>
      </PageShell>
    </>
  )
}

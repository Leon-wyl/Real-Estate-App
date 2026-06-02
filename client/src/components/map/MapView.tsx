import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'
import { formatPrice } from '@/lib/utils'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

interface MapItem {
  id: string
  title: string
  latitude: string
  longitude: string
  price: number
  bedroom: number
  images: string[]
}

interface MapViewProps {
  items: MapItem[]
  center?: [number, number]
  zoom?: number
}

function MapController({
  center,
  zoom,
}: {
  center?: [number, number]
  zoom?: number
}) {
  const map = useMapEvents({
    contextmenu: (e) => e.originalEvent.preventDefault(),
  })

  if (center) {
    map.setView(center, zoom ?? 13, { animate: true })
  }

  return null
}

export function MapView({
  items,
  center = [40.7128, -74.006],
  zoom = 12,
}: MapViewProps) {
  const [loaded, setLoaded] = useState(false)

  const onLoad = useCallback(() => {
    setTimeout(() => setLoaded(true), 600)
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-border">
      {!loaded && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-surface/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
            <span className="text-sm text-muted-foreground">
              Loading map...
            </span>
          </div>
        </div>
      )}
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom
        whenReady={onLoad}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          eventHandlers={{
            load: onLoad,
          }}
        />
        <MapController center={center} zoom={zoom} />
        {items.map((item) => {
          const lat = parseFloat(item.latitude)
          const lng = parseFloat(item.longitude)
          if (isNaN(lat) || isNaN(lng)) return null

          const position: [number, number] = [lat, lng]
          const image = item.images?.[0] || '/placeholder.jpg'

          return (
            <Marker key={item.id} position={position}>
              <Popup>
                <div className="w-48 space-y-1.5 font-body">
                  <img
                    src={image}
                    alt={item.title}
                    className="h-28 w-full rounded-md object-cover"
                    loading="lazy"
                  />
                  <p className="truncate text-sm font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs font-bold text-gold">
                    {formatPrice(item.price)}
                    {item.bedroom > 0 && (
                      <span className="ml-2 font-normal text-muted-foreground">
                        {item.bedroom} bed{item.bedroom !== 1 ? 's' : ''}
                      </span>
                    )}
                  </p>
                  <Link
                    to={`/${item.id}`}
                    className="block text-center text-xs text-gold underline-offset-2 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}

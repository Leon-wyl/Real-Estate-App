import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, RotateCcw } from 'lucide-react'
import { Button } from '@/vendor/ui/button'
import { Input } from '@/vendor/ui/input'
import { Label } from '@/vendor/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/vendor/ui/select'
import { cn } from '@/lib/utils'
import {
  FILTER_BEDROOM_OPTIONS,
  PROPERTY_TYPES,
  LISTING_TYPES,
} from '@/lib/constants'

interface FilterSidebarProps {
  className?: string
}

export function FilterSidebar({ className }: FilterSidebarProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const didApply = useRef(false)

  const [city, setCity] = useState(searchParams.get('city') ?? '')
  const [type, setType] = useState(searchParams.get('type') ?? '')
  const [property, setProperty] = useState(searchParams.get('property') ?? '')
  const [bedroom, setBedroom] = useState(searchParams.get('bedroom') ?? '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '')

  useEffect(() => {
    if (didApply.current) {
      didApply.current = false
      return
    }
    const params = new URLSearchParams(searchParams)
    let changed = false
    const clean = (k: string) => {
      if (params.get(k) === '') {
        params.delete(k)
        changed = true
      }
    }
    clean('city')
    clean('type')
    clean('property')
    clean('bedroom')
    clean('minPrice')
    clean('maxPrice')
    if (changed) {
      setSearchParams(params, { replace: true })
      return
    }
    setCity(searchParams.get('city') ?? '')
    setType(searchParams.get('type') ?? '')
    setProperty(searchParams.get('property') ?? '')
    setBedroom(searchParams.get('bedroom') ?? '')
    setMinPrice(searchParams.get('minPrice') ?? '')
    setMaxPrice(searchParams.get('maxPrice') ?? '')
  }, [searchParams])

  const handleApply = () => {
    const next = new URLSearchParams()
    if (city) next.set('city', city)
    if (type) next.set('type', type)
    if (property) next.set('property', property)
    if (bedroom) next.set('bedroom', bedroom)
    if (minPrice) next.set('minPrice', minPrice)
    if (maxPrice) next.set('maxPrice', maxPrice)
    didApply.current = true
    setSearchParams(next, { replace: true })
  }

  const handleReset = () => {
    setCity('')
    setType('')
    setProperty('')
    setBedroom('')
    setMinPrice('')
    setMaxPrice('')
    setSearchParams(new URLSearchParams(), { replace: true })
  }

  const hasFilters = city || type || property || bedroom || minPrice || maxPrice

  return (
    <aside
      className={cn(
        'flex w-[280px] shrink-0 flex-col gap-5 rounded-lg border border-border bg-card p-5',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-gold" />
        <h2 className="font-display text-base font-semibold text-gold">
          Filters
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="Any city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="type">Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent>
              {LISTING_TYPES.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="property">Property</Label>
          <Select value={property} onValueChange={setProperty}>
            <SelectTrigger id="property">
              <SelectValue placeholder="Any property" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bedroom">Bedrooms</Label>
          <Select value={bedroom} onValueChange={setBedroom}>
            <SelectTrigger id="bedroom">
              <SelectValue placeholder="Any bedrooms" />
            </SelectTrigger>
            <SelectContent>
              {FILTER_BEDROOM_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Price Range</Label>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Min"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="h-9"
            />
            <span className="text-xs text-muted-foreground">to</span>
            <Input
              placeholder="Max"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-9"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button variant="gold" onClick={handleApply} className="w-full">
          Apply Filters
        </Button>
        {hasFilters && (
          <Button
            variant="ghost"
            onClick={handleReset}
            className="w-full gap-1.5 text-muted-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>
    </aside>
  )
}

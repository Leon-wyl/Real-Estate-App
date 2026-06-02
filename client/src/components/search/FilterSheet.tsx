import { useState, useEffect } from 'react'
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/vendor/ui/sheet'
import {
  FILTER_BEDROOM_OPTIONS,
  PROPERTY_TYPES,
  LISTING_TYPES,
} from '@/lib/constants'

export function FilterSheet() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [open, setOpen] = useState(false)

  const [city, setCity] = useState(searchParams.get('city') ?? '')
  const [type, setType] = useState(searchParams.get('type') ?? '')
  const [property, setProperty] = useState(searchParams.get('property') ?? '')
  const [bedroom, setBedroom] = useState(searchParams.get('bedroom') ?? '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '')

  useEffect(() => {
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
    setSearchParams(next, { replace: true })
    setOpen(false)
  }

  const handleReset = () => {
    setCity('')
    setType('')
    setProperty('')
    setBedroom('')
    setMinPrice('')
    setMaxPrice('')
    setSearchParams(new URLSearchParams(), { replace: true })
    setOpen(false)
  }

  const hasFilters = city || type || property || bedroom || minPrice || maxPrice

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-gold/30 text-gold"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-5 border-l border-border bg-card pt-12 sm:max-w-[320px]"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="font-display text-lg font-semibold text-gold">
            Filters
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
          <div className="space-y-1.5">
            <Label htmlFor="sheet-city">City</Label>
            <Input
              id="sheet-city"
              placeholder="Any city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sheet-type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="sheet-type">
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
            <Label htmlFor="sheet-property">Property</Label>
            <Select value={property} onValueChange={setProperty}>
              <SelectTrigger id="sheet-property">
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
            <Label htmlFor="sheet-bedroom">Bedrooms</Label>
            <Select value={bedroom} onValueChange={setBedroom}>
              <SelectTrigger id="sheet-bedroom">
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

        <div className="flex flex-col gap-2 border-t border-border pt-4">
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
      </SheetContent>
    </Sheet>
  )
}

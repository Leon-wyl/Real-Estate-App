import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, MapPin, DollarSign } from 'lucide-react'
import { Input } from '@/vendor/ui/input'
import { Button } from '@/vendor/ui/button'
import { Switch } from '@/vendor/ui/switch'

export function SearchBar() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [type, setType] = useState<'buy' | 'rent'>(
    (searchParams.get('type') as 'buy' | 'rent') || 'buy',
  )
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')

  useEffect(() => {
    setType((searchParams.get('type') as 'buy' | 'rent') || 'buy')
    setCity(searchParams.get('city') || '')
    setMinPrice(searchParams.get('minPrice') || '')
    setMaxPrice(searchParams.get('maxPrice') || '')
  }, [searchParams])

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams()
    params.set('type', type)
    if (city.trim()) params.set('city', city.trim())
    if (minPrice.trim()) params.set('minPrice', minPrice.trim())
    if (maxPrice.trim()) params.set('maxPrice', maxPrice.trim())
    navigate(`/list?${params.toString()}`)
  }, [type, city, minPrice, maxPrice, navigate])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSearch()
    },
    [handleSearch],
  )

  return (
    <div className="w-full rounded-xl border border-gold/20 bg-surface/70 p-4 shadow-[0_4px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex shrink-0 items-center gap-3">
          <span
            className={`text-sm font-medium transition-colors ${type === 'buy' ? 'text-gold' : 'text-muted-foreground'}`}
          >
            Buy
          </span>
          <Switch
            checked={type === 'rent'}
            onCheckedChange={(checked) => setType(checked ? 'rent' : 'buy')}
          />
          <span
            className={`text-sm font-medium transition-colors ${type === 'rent' ? 'text-gold' : 'text-muted-foreground'}`}
          >
            Rent
          </span>
        </div>

        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
        </div>

        <div className="relative flex-1">
          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
            min={0}
          />
        </div>

        <div className="relative flex-1">
          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
            min={0}
          />
        </div>

        <Button
          variant="gold"
          onClick={handleSearch}
          className="shrink-0 gap-2"
        >
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  )
}

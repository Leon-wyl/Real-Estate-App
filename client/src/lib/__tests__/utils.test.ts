import { cn, formatPrice, formatDate, capitalize } from '@/lib/utils'

describe('cn', () => {
  it('merges Tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra')
  })
})

describe('formatPrice', () => {
  it('returns "$500,000" for 500000', () => {
    expect(formatPrice(500000)).toBe('$500,000')
  })

  it('returns "$1,200" for 1200', () => {
    expect(formatPrice(1200)).toBe('$1,200')
  })
})

describe('formatDate', () => {
  it('returns "Jan 15, 2024" for "2024-01-15"', () => {
    expect(formatDate('2024-01-15')).toBe('Jan 15, 2024')
  })
})

describe('capitalize', () => {
  it('returns "Buy" for "buy"', () => {
    expect(capitalize('buy')).toBe('Buy')
  })

  it('returns "House" for "house"', () => {
    expect(capitalize('house')).toBe('House')
  })
})

export const PROPERTY_TYPES = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'land', label: 'Land' },
] as const

export const LISTING_TYPES = [
  { value: 'buy', label: 'Buy' },
  { value: 'rent', label: 'Rent' },
] as const

export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5] as const

export const FILTER_BEDROOM_OPTIONS = [
  { value: '1', label: '1 Bed' },
  { value: '2', label: '2 Beds' },
  { value: '3', label: '3 Beds' },
  { value: '4', label: '4 Beds' },
  { value: '5', label: '5+ Beds' },
] as const

export const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Listings', path: '/list' },
  { label: 'Profile', path: '/profile', auth: true },
] as const

export const BOTTOM_NAV_ITEMS = [
  { label: 'Home', path: '/', icon: 'Home' },
  { label: 'Search', path: '/list', icon: 'Search' },
  { label: 'Saved', path: '/profile', icon: 'Heart' },
  { label: 'Profile', path: '/profile', icon: 'User' },
] as const

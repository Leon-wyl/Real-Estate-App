import { useSearchStore } from '@/store/search'

beforeEach(() => {
  useSearchStore.setState({ filters: {} })
})

describe('useSearchStore', () => {
  describe('initial state', () => {
    it('filters is empty object', () => {
      expect(useSearchStore.getState().filters).toEqual({})
    })
  })

  describe('setFilter', () => {
    it('updates city in filters', () => {
      useSearchStore.getState().setFilter('city', 'NYC')
      expect(useSearchStore.getState().filters).toEqual({ city: 'NYC' })
    })
  })

  describe('setFilters', () => {
    it('merges into filters', () => {
      useSearchStore.getState().setFilters({ type: 'buy', property: 'house' })
      expect(useSearchStore.getState().filters).toEqual({
        type: 'buy',
        property: 'house',
      })
    })
  })

  describe('resetFilters', () => {
    it('clears all filters', () => {
      useSearchStore.setState({
        filters: { city: 'NYC', type: 'buy' },
      })
      useSearchStore.getState().resetFilters()
      expect(useSearchStore.getState().filters).toEqual({})
    })
  })

  describe('setFilter then reset', () => {
    it('returns to empty', () => {
      useSearchStore.getState().setFilter('city', 'NYC')
      expect(useSearchStore.getState().filters).toEqual({ city: 'NYC' })
      useSearchStore.getState().resetFilters()
      expect(useSearchStore.getState().filters).toEqual({})
    })
  })
})

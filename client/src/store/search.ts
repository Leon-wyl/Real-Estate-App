import { create } from 'zustand'
import type { PostFilters } from '@/lib/types'

interface SearchState {
  filters: PostFilters
  setFilter: <K extends keyof PostFilters>(
    key: K,
    value: PostFilters[K],
  ) => void
  setFilters: (filters: Partial<PostFilters>) => void
  resetFilters: () => void
}

const defaultFilters: PostFilters = {}

export const useSearchStore = create<SearchState>()((set) => ({
  filters: { ...defaultFilters },

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  resetFilters: () => set({ filters: { ...defaultFilters } }),
}))

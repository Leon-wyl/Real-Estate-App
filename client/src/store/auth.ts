import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/lib/types'
import * as authApi from '@/lib/api/auth'
import { disconnectSocket } from '@/lib/api/socket'

export let resolveAuthHydration: () => void
export const authHydrated = new Promise<void>((resolve) => {
  resolveAuthHydration = resolve
})

interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isHydrated: boolean
  login: (username: string, password: string) => Promise<void>
  register: (data: {
    username: string
    email: string
    password: string
  }) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  updateUser: (data: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,

      login: async (username, password) => {
        set({ isLoading: true })
        try {
          const user = await authApi.login(username, password)
          set({ currentUser: user, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data) => {
        set({ isLoading: true })
        try {
          await authApi.register(data)
          set({ isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          await authApi.logout()
        } catch {
          // Proceed with local logout even if API fails
        }
        disconnectSocket()
        set({ currentUser: null, isAuthenticated: false })
      },

      setUser: (user) => set({ currentUser: user, isAuthenticated: !!user }),

      updateUser: (data) =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, ...data }
            : null,
        })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => {
        return (_state, error) => {
          if (error) {
            console.warn('Auth store hydration failed:', error)
          }
          // Store is now hydrated — resolve so loaders can proceed
          resolveAuthHydration()
        }
      },
    },
  ),
)

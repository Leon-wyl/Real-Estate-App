import { useAuthStore } from '@/store/auth'

vi.mock('@/lib/api/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn().mockResolvedValue(undefined),
  getCurrentUser: vi.fn(),
}))

vi.mock('@/lib/api/socket', () => ({
  disconnectSocket: vi.fn(),
}))

import * as authApi from '@/lib/api/auth'
import * as socket from '@/lib/api/socket'

const mockUser = {
  id: '1',
  username: 'john',
  email: 'john@example.com',
  avatar: 'avatar.png',
  createdAt: '2024-01-01',
}

beforeEach(() => {
  localStorage.clear()
  useAuthStore.setState({
    currentUser: null,
    isAuthenticated: false,
    isLoading: false,
  })
})

describe('useAuthStore', () => {
  describe('initial state', () => {
    it('currentUser is null', () => {
      expect(useAuthStore.getState().currentUser).toBeNull()
    })

    it('isAuthenticated is false', () => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })

  describe('setUser', () => {
    it('sets currentUser and isAuthenticated', () => {
      useAuthStore.getState().setUser(mockUser)
      expect(useAuthStore.getState().currentUser).toEqual(mockUser)
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
    })
  })

  describe('updateUser', () => {
    it('merges data into currentUser', () => {
      useAuthStore.setState({ currentUser: mockUser, isAuthenticated: true })
      useAuthStore.getState().updateUser({ username: 'new' })
      expect(useAuthStore.getState().currentUser).toEqual({
        ...mockUser,
        username: 'new',
      })
    })
  })

  describe('logout', () => {
    it('clears currentUser and isAuthenticated', async () => {
      useAuthStore.setState({ currentUser: mockUser, isAuthenticated: true })
      await useAuthStore.getState().logout()
      expect(useAuthStore.getState().currentUser).toBeNull()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })

    it('calls authApi.logout and disconnectSocket', async () => {
      useAuthStore.setState({ currentUser: mockUser, isAuthenticated: true })
      await useAuthStore.getState().logout()
      expect(authApi.logout).toHaveBeenCalled()
      expect(socket.disconnectSocket).toHaveBeenCalled()
    })
  })
})

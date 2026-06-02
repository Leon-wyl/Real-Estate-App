import axios from 'axios'
import { createErrorFromStatus, NetworkError } from './errors'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new NetworkError())
    }

    const { status, data } = error.response
    const message = data?.message || 'An unexpected error occurred'
    const details = data?.details

    if (status === 401) {
      // Skip auto-logout for the /logout request itself to prevent recursion
      const isLogoutRequest = error.config?.url?.endsWith('/auth/logout')
      if (!isLogoutRequest) {
        import('@/store/auth').then(({ useAuthStore }) => {
          useAuthStore.getState().logout()
        })
      }
    }

    return Promise.reject(createErrorFromStatus(status, message, details))
  },
)

export default apiClient

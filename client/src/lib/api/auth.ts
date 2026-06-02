import apiClient from './client'
import type { User } from '@/lib/types'

interface LoginResponse {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: string
}

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const res = await apiClient.post('/auth/login', { username, password })
  return res.data
}

export async function register(data: {
  username: string
  email: string
  password: string
}): Promise<void> {
  await apiClient.post('/auth/register', data)
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout')
}

export async function getCurrentUser(): Promise<User> {
  const res = await apiClient.get('/users')
  return res.data
}

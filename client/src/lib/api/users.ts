import apiClient from './client'
import type { User, Post } from '@/lib/types'

export async function getUser(id: string): Promise<User> {
  const res = await apiClient.get(`/users/${id}`)
  return res.data
}

export async function updateUser(
  id: string,
  data: {
    username?: string
    email?: string
    password?: string
    avatar?: string
  },
): Promise<User> {
  const res = await apiClient.put(`/users/${id}`, data)
  return res.data
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/users/${id}`)
}

export async function savePost(postId: string): Promise<void> {
  await apiClient.post('/users/save', { postId })
}

export async function getSavedPosts(): Promise<Post[]> {
  const res = await apiClient.get('/users/saved-posts')
  return res.data
}

export async function getNotifications(): Promise<{ count: number }> {
  const res = await apiClient.get('/users/notification')
  return res.data
}

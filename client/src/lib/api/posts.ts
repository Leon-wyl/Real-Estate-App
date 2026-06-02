import apiClient from './client'
import type {
  Post,
  PostFilters,
  CreatePostData,
  UpdatePostData,
} from '@/lib/types'

function buildParams(filters: PostFilters): Record<string, string> {
  const params: Record<string, string> = {}
  if (filters.city) params.city = filters.city
  if (filters.type) params.type = filters.type
  if (filters.property) params.property = filters.property
  if (filters.bedroom != null && String(filters.bedroom) !== '')
    params.bedroom = String(filters.bedroom)
  if (filters.minPrice != null && String(filters.minPrice) !== '')
    params.minPrice = String(filters.minPrice)
  if (filters.maxPrice != null && String(filters.maxPrice) !== '')
    params.maxPrice = String(filters.maxPrice)
  if (filters.userId) params.userId = filters.userId
  return params
}

export async function getPosts(filters: PostFilters = {}): Promise<Post[]> {
  const res = await apiClient.get('/posts', { params: buildParams(filters) })
  return res.data
}

export async function getPost(id: string): Promise<Post> {
  const res = await apiClient.get(`/posts/${id}`)
  return res.data
}

export async function createPost(data: CreatePostData): Promise<Post> {
  const res = await apiClient.post('/posts', data)
  return res.data
}

export async function updatePost(
  id: string,
  data: UpdatePostData,
): Promise<Post> {
  const res = await apiClient.put(`/posts/${id}`, data)
  return res.data
}

export async function deletePost(id: string): Promise<void> {
  await apiClient.delete(`/posts/${id}`)
}

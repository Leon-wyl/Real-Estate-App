import apiClient from './client'
import type { Chat } from '@/lib/types'

export async function getChats(): Promise<Chat[]> {
  const res = await apiClient.get('/chats')
  return res.data
}

export async function getChat(id: string): Promise<Chat> {
  const res = await apiClient.get(`/chats/${id}`)
  return res.data
}

export async function createChat(receiverId: string): Promise<Chat> {
  const res = await apiClient.post('/chats', { receiverId })
  return res.data
}

export async function markRead(chatId: string): Promise<void> {
  await apiClient.put(`/chats/read/${chatId}`)
}

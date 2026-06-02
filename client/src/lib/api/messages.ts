import apiClient from './client'
import type { Message } from '@/lib/types'

export async function sendMessage(
  chatId: string,
  text: string,
): Promise<Message> {
  const res = await apiClient.post(`/messages/${chatId}`, { text })
  return res.data
}

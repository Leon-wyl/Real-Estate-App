import { io, Socket } from 'socket.io-client'
import type { Message } from '@/lib/types'

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8800'

let socket: Socket | null = null

export function getSocket(): Socket | null {
  if (!socket || !socket.connected) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
    })

    socket.on('connect', () => {
      // Socket connected
    })

    socket.on('disconnect', () => {
      // Socket disconnected
    })
  }
  return socket
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export function subscribeToChat(
  chatId: string,
  onMessage: (message: Message) => void,
): () => void {
  const s = getSocket()
  if (!s) return () => {}

  s.emit('joinChat', chatId)
  s.on('newMessage', onMessage)

  return () => {
    s.off('newMessage', onMessage)
    s.emit('leaveChat', chatId)
  }
}

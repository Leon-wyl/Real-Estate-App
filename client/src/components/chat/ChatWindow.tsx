import { useEffect, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/vendor/ui/avatar'
import { ScrollArea } from '@/vendor/ui/scroll-area'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingScreen } from '@/components/shared/LoadingSkeleton'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { MessageInput } from '@/components/chat/MessageInput'
import type { Chat } from '@/lib/types'

interface ChatWindowProps {
  chat: Chat
  currentUserId: string
  onBack?: () => void
  onSend: (text: string) => Promise<void>
  loading?: boolean
}

export function ChatWindow({
  chat,
  currentUserId,
  onBack,
  onSend,
  loading = false,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat.messages])

  if (loading) {
    return (
      <div className="flex h-full flex-col bg-background">
        <LoadingScreen />
      </div>
    )
  }

  const otherUser = chat.users?.find((u) => u.id !== currentUserId)
  const messages = chat.messages ?? []

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="flex shrink-0 items-center gap-3 border-b border-border bg-surface px-4 py-3">
        {onBack && (
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gold/10 lg:hidden"
            aria-label="Back to chat list"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
        <Avatar className="h-9 w-9">
          <AvatarImage
            src={otherUser?.avatar}
            alt={otherUser?.username ?? 'User'}
          />
          <AvatarFallback className="bg-gold/20 text-xs font-semibold text-gold">
            {(otherUser?.username ?? 'U').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-sm font-semibold text-foreground">
            {otherUser?.username ?? 'Unknown User'}
          </h3>
        </div>
      </header>

      <ScrollArea className="flex-1">
        {messages.length === 0 ? (
          <EmptyState
            title="No messages yet"
            description="Say hello! Start a conversation."
          />
        ) : (
          <div className="flex flex-col gap-2 p-4">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.userId === currentUserId}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      <MessageInput onSend={onSend} />
    </div>
  )
}

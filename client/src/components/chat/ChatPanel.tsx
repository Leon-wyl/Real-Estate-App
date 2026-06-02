import { MessageSquare } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/vendor/ui/avatar'
import { ScrollArea } from '@/vendor/ui/scroll-area'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatDate, cn } from '@/lib/utils'
import type { Chat } from '@/lib/types'

interface ChatPanelProps {
  chats: Chat[]
  onSelectChat: (chatId: string) => void
  selectedChatId?: string
  currentUserId: string
}

export function ChatPanel({
  chats,
  onSelectChat,
  selectedChatId,
  currentUserId,
}: ChatPanelProps) {
  if (chats.length === 0) {
    return <EmptyState icon={MessageSquare} title="No conversations yet" />
  }

  return (
    <div className="flex h-full flex-col border-r border-border bg-surface">
      <div className="flex shrink-0 items-center border-b border-border px-4 py-4">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Messages
        </h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {chats.map((chat) => {
            const otherUser = chat.users?.find((u) => u.id !== currentUserId)
            const isSelected = chat.id === selectedChatId
            const isUnread = !chat.seenBy.includes(currentUserId)

            return (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={cn(
                  'flex items-start gap-3 px-4 py-3 text-left transition-colors',
                  'hover:bg-gold/5',
                  isSelected && 'border-l-2 border-gold bg-gold/10',
                  !isSelected && 'border-l-2 border-transparent',
                )}
              >
                <div className="relative shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={otherUser?.avatar}
                      alt={otherUser?.username ?? 'User'}
                    />
                    <AvatarFallback className="bg-gold/20 text-xs font-semibold text-gold">
                      {(otherUser?.username ?? 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isUnread && (
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-gold shadow-md shadow-gold/30 ring-2 ring-surface" />
                  )}
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-display text-sm font-semibold text-foreground">
                      {otherUser?.username ?? 'Unknown User'}
                    </span>
                    {chat.lastMessage && (
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {formatDate(
                          chat.messages?.length
                            ? chat.messages[chat.messages.length - 1].createdAt
                            : chat.createdAt,
                        )}
                      </span>
                    )}
                  </div>
                  {chat.lastMessage && (
                    <p
                      className={cn(
                        'mt-0.5 truncate text-xs',
                        isUnread
                          ? 'font-medium text-foreground'
                          : 'text-muted-foreground',
                      )}
                    >
                      {chat.lastMessage}
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

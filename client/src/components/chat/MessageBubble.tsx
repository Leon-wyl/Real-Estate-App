import { motion } from 'framer-motion'
import { cn, formatDate } from '@/lib/utils'
import type { Message } from '@/lib/types'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const senderName = message.user?.username ?? 'Unknown User'
  const label = isOwn ? 'Your message' : `Message from ${senderName}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}
      aria-label={label}
    >
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2.5',
          isOwn
            ? 'rounded-br-md bg-gradient-to-br from-gold to-gold-muted text-background'
            : 'rounded-bl-md border border-border bg-surface text-foreground',
        )}
      >
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {message.text}
        </p>
        <p
          className={cn(
            'mt-1 text-right text-[10px]',
            isOwn ? 'text-background/60' : 'text-muted-foreground',
          )}
        >
          {formatDate(message.createdAt)}
        </p>
      </div>
    </motion.div>
  )
}

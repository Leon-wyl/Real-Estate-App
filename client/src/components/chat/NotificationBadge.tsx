import { cn } from '@/lib/utils'

interface NotificationBadgeProps {
  count: number
}

export function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count <= 0) return null

  return (
    <span
      className={cn(
        'absolute -right-1 -top-1 z-10 flex items-center justify-center',
        'h-[18px] min-w-[18px] rounded-full px-1',
        'bg-gold text-[10px] font-bold leading-none text-background',
        'shadow-md shadow-gold/30',
        'animate-fade-in',
      )}
      aria-label={`${count} unread notifications`}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}

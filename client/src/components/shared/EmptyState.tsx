import { type LucideIcon, PackageOpen } from 'lucide-react'
import { Button } from '@/vendor/ui/button'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: { label: string; to?: string; onClick?: () => void }
  className?: string
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 text-center',
        className,
      )}
    >
      <div className="rounded-full bg-gold/10 p-4">
        <Icon className="h-8 w-8 text-gold" />
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-lg font-semibold text-foreground">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action &&
        (action.to ? (
          <Button variant="gold" asChild>
            <Link to={action.to}>{action.label}</Link>
          </Button>
        ) : (
          <Button variant="gold" onClick={action.onClick}>
            {action.label}
          </Button>
        ))}
    </div>
  )
}

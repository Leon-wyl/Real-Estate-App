import { LayoutList, Map } from 'lucide-react'
import { Button } from '@/vendor/ui/button'
import { cn } from '@/lib/utils'

interface ViewToggleProps {
  view: 'grid' | 'map'
  onChange: (view: 'grid' | 'map') => void
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center overflow-hidden rounded-md border border-border md:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange('grid')}
        className={cn(
          'h-9 gap-1.5 rounded-none border-0',
          view === 'grid'
            ? 'bg-gold/15 text-gold shadow-[inset_0_1px_0_0_rgba(212,175,55,0.2)]'
            : 'text-muted-foreground hover:text-foreground',
        )}
        aria-pressed={view === 'grid'}
        aria-label="Grid view"
      >
        <LayoutList className="h-4 w-4" />
        Grid
      </Button>
      <div className="h-5 w-px bg-border" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange('map')}
        className={cn(
          'h-9 gap-1.5 rounded-none border-0',
          view === 'map'
            ? 'bg-gold/15 text-gold shadow-[inset_0_1px_0_0_rgba(212,175,55,0.2)]'
            : 'text-muted-foreground hover:text-foreground',
        )}
        aria-pressed={view === 'map'}
        aria-label="Map view"
      >
        <Map className="h-4 w-4" />
        Map
      </Button>
    </div>
  )
}

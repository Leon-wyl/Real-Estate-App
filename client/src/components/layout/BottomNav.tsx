import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Heart, User } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'
import { BOTTOM_NAV_ITEMS } from '@/lib/constants'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Search,
  Heart,
  User,
}

export function BottomNav() {
  const { isAuthenticated } = useAuthStore()
  const { pathname } = useLocation()

  const items = BOTTOM_NAV_ITEMS.map((item) => ({
    href:
      (item.label === 'Saved' || item.label === 'Profile') && !isAuthenticated
        ? '/login'
        : item.path,
    label: item.label,
    icon: ICON_MAP[item.icon],
  }))

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex h-16 max-w-[480px] items-center justify-around">
        {items.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href === '/list' && pathname.startsWith('/list'))
          return (
            <Link
              key={label}
              to={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5',
                isActive ? 'text-gold' : 'text-muted-foreground',
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

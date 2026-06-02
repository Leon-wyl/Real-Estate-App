import { Link, useNavigate } from 'react-router-dom'
import { Menu, Bell, Heart, User, LogOut, PlusSquare } from 'lucide-react'
import { Button } from '@/vendor/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/vendor/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/vendor/ui/sheet'
import { NotificationBadge } from '@/components/chat/NotificationBadge'
import { getNotifications } from '@/lib/api/users'
import { useAuthStore } from '@/store/auth'
import { useState, useEffect } from 'react'

export function Navbar() {
  const { currentUser, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    if (!isAuthenticated) return
    const fetchNotifications = async () => {
      try {
        const { count } = await getNotifications()
        setNotificationCount(count)
      } catch {
        // silently ignore
      }
    }
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30_000)
    return () => clearInterval(interval)
  }, [isAuthenticated])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/list', label: 'Listings' },
  ]

  return (
    <nav className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="page-shell flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-gold">Leon</span>
          <span className="font-display text-xl font-light text-foreground">
            Real Estate
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="h-6 w-px bg-border" />
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/add"
                className="flex items-center gap-1.5 text-sm text-gold transition-opacity hover:opacity-80"
              >
                <PlusSquare className="h-4 w-4" />
                Add Listing
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Chat notifications"
                onClick={() => navigate('/profile#chat')}
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                <NotificationBadge count={notificationCount} />
              </Button>
              <Link to="/profile" className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage
                    src={currentUser?.avatar}
                    alt={currentUser?.username}
                  />
                  <AvatarFallback className="bg-gold/10 text-xs text-gold">
                    {currentUser?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-foreground">
                  {currentUser?.username}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                size="sm"
              >
                Sign In
              </Button>
              <Button
                variant="gold"
                onClick={() => navigate('/register')}
                size="sm"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[280px] border-l border-border bg-card"
          >
            <nav className="mt-8 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-border" />
              {isAuthenticated ? (
                <>
                  <Link
                    to="/add"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gold transition-colors hover:bg-secondary"
                  >
                    <PlusSquare className="h-4 w-4" />
                    Add Listing
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                  >
                    <Heart className="h-4 w-4" />
                    Saved
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      handleLogout()
                    }}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-secondary"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-sm text-gold transition-colors hover:bg-secondary"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

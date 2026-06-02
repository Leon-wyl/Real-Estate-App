import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { savePost } from '@/lib/api/users'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface SaveButtonProps {
  postId: string
  isSaved?: boolean
  className?: string
}

export function SaveButton({
  postId,
  isSaved = false,
  className,
}: SaveButtonProps) {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(isSaved)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setSaved(isSaved)
  }, [isSaved])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setLoading(true)
    const previous = saved
    setSaved(!saved) // Optimistic update

    try {
      await savePost(postId)
      toast.success(saved ? 'Removed from saved' : 'Saved')
    } catch {
      setSaved(previous)
      toast.error('Failed to update saved status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      aria-label={saved ? 'Un-save property' : 'Save property'}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200',
        saved
          ? 'bg-gold/20 text-gold hover:bg-gold/30'
          : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white',
        loading && 'opacity-50',
        className,
      )}
    >
      <Heart
        className={cn('h-5 w-5 transition-transform', saved && 'fill-gold')}
      />
    </button>
  )
}

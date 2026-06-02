import { useState } from 'react'
import { useLoaderData, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  MapPin,
  Bed,
  Bath,
  School,
  Bus,
  UtensilsCrossed,
  Mail,
  Ruler,
  Edit,
  Trash2,
  MessageSquare,
} from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { ImageGallery } from '@/components/property/ImageGallery'
import { SaveButton } from '@/components/property/SaveButton'
import { MapView } from '@/components/map/MapView'
import { Button } from '@/vendor/ui/button'
import { Badge } from '@/vendor/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/vendor/ui/avatar'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/vendor/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/vendor/ui/sheet'
import { useAuthStore } from '@/store/auth'
import { deletePost } from '@/lib/api/posts'
import { createChat } from '@/lib/api/chats'
import { formatPrice, capitalize } from '@/lib/utils'
import { toast } from 'sonner'
import type { Post } from '@/lib/types'

export default function PropertyPage() {
  const post = useLoaderData() as Post
  const navigate = useNavigate()
  const { currentUser, isAuthenticated } = useAuthStore()

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatLoading, setChatLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isOwner = post.userId === currentUser?.id
  const lat = parseFloat(post.latitude)
  const lng = parseFloat(post.longitude)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deletePost(post.id)
      toast.success('Listing deleted')
      navigate('/profile')
    } catch {
      toast.error('Failed to delete listing')
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  const handleContact = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (post.userId === currentUser?.id) {
      toast.error("You can't message yourself")
      return
    }
    setChatLoading(true)
    try {
      const chat = await createChat(post.userId)
      navigate(`/profile?chat=${chat.id}`)
    } catch {
      toast.error('Failed to start chat')
    } finally {
      setChatLoading(false)
    }
  }

  const policyItems = [
    { label: 'Utilities Policy', value: post.postDetail?.utilities },
    { label: 'Pet Policy', value: post.postDetail?.pet },
    { label: 'Income Policy', value: post.postDetail?.income },
  ].filter((item) => item.value)

  const nearbyItems = [
    { icon: School, label: 'School', value: post.postDetail?.school },
    { icon: Bus, label: 'Bus Stop', value: post.postDetail?.bus },
    {
      icon: UtensilsCrossed,
      label: 'Restaurant',
      value: post.postDetail?.restaurant,
    },
  ].filter((item) => item.value !== undefined && item.value !== null)

  return (
    <>
      <Helmet>
        <title>{post.title} | Leon Real Estate</title>
        <meta
          name="description"
          content={post.postDetail?.desc || post.title}
        />
      </Helmet>

      <PageShell>
        <ImageGallery images={post.images} title={post.title} />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Left Column — Property Info */}
          <div className="space-y-8">
            {/* Price & Title */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-gold sm:text-4xl">
                  {formatPrice(post.price)}
                </span>
                {post.type === 'rent' && (
                  <span className="text-lg text-muted-foreground">/mo</span>
                )}
              </div>
              <h1 className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl">
                {post.title}
              </h1>
              <div className="mt-2 flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4 text-gold" />
                <span className="text-sm">{post.address}</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="gold">
                {post.type === 'buy' ? 'For Sale' : 'For Rent'}
              </Badge>
              <Badge variant="outline" className="border-gold/30 text-gold">
                {capitalize(post.property)}
              </Badge>
            </div>

            {/* Beds / Baths */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 text-foreground">
                <Bed className="h-5 w-5 text-gold" />
                <span className="text-sm font-medium">{post.bedroom} Beds</span>
              </div>
              <div className="flex items-center gap-1.5 text-foreground">
                <Bath className="h-5 w-5 text-gold" />
                <span className="text-sm font-medium">
                  {post.bathroom} Baths
                </span>
              </div>
            </div>

            {/* Description */}
            {post.postDetail?.desc && (
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Description
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {post.postDetail.desc}
                </p>
              </div>
            )}

            {/* Policies */}
            {policyItems.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Policies
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {policyItems.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-md border border-border bg-surface/50 px-4 py-3"
                    >
                      <span className="text-xs text-muted-foreground">
                        {item.label}
                      </span>
                      <p className="mt-0.5 text-sm font-medium text-foreground">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {post.postDetail?.size && (
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-gold" />
                <span className="text-sm text-muted-foreground">
                  {post.postDetail.size.toLocaleString()} sqft
                </span>
              </div>
            )}

            {/* Nearby Places */}
            {nearbyItems.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Nearby
                </h3>
                <div className="grid gap-2 sm:grid-cols-3">
                  {nearbyItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 rounded-md border border-border bg-surface/50 px-4 py-3"
                    >
                      <item.icon className="h-4 w-4 shrink-0 text-gold" />
                      <div className="min-w-0">
                        <span className="text-xs text-muted-foreground">
                          {item.label}
                        </span>
                        <p className="text-sm font-medium text-foreground">
                          {item.value}m
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Owner / Agent Card */}
            <motion.div
              className="rounded-lg border border-gold/20 bg-surface p-5"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 ring-2 ring-gold/30">
                  <AvatarImage src={post.user?.avatar} />
                  <AvatarFallback className="bg-gold/10 text-gold">
                    {post.user?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-display font-semibold text-foreground">
                    {post.user?.username || 'Agent'}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>Listed by agent</span>
                  </div>
                </div>
              </div>

              <Button
                variant="gold"
                className="mt-4 w-full"
                onClick={handleContact}
                disabled={chatLoading}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {chatLoading ? 'Starting chat...' : 'Contact Agent'}
              </Button>
            </motion.div>
          </div>

          {/* Right Column — Sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Save Button */}
              <div className="flex justify-end">
                <SaveButton
                  postId={post.id}
                  isSaved={post.isSaved}
                  className="h-11 w-11 text-lg"
                />
              </div>

              {/* Mini Map */}
              {!isNaN(lat) && !isNaN(lng) && (
                <div className="overflow-hidden rounded-lg border border-gold/20">
                  <MiniMap lat={lat} lng={lng} title={post.title} />
                </div>
              )}

              {/* Owner Actions */}
              {isOwner && (
                <div className="space-y-3 rounded-lg border border-border bg-surface p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Manage Listing
                  </p>
                  <Link
                    to={`/edit/${post.id}`}
                    className="flex w-full items-center gap-2 rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-secondary hover:text-gold"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Listing
                  </Link>

                  <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <DialogTrigger asChild>
                      <button className="flex w-full items-center gap-2 rounded-md border border-destructive/30 bg-transparent px-4 py-2 text-sm font-medium text-destructive transition-all hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                        Delete Listing
                      </button>
                    </DialogTrigger>
                    <DialogContent className="border-border bg-card">
                      <DialogHeader>
                        <DialogTitle className="text-foreground">
                          Delete Listing
                        </DialogTitle>
                      </DialogHeader>
                      <DialogDescription className="text-muted-foreground">
                        Are you sure? This cannot be undone.
                      </DialogDescription>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setDeleteOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDelete}
                          disabled={deleting}
                        >
                          {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Mobile Fixed CTA Bar */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-sm lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-xl font-bold text-gold">
                {formatPrice(post.price)}
              </span>
              {post.type === 'rent' && (
                <span className="text-xs text-muted-foreground">/mo</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <SaveButton postId={post.id} isSaved={post.isSaved} />
              <Button
                variant="gold"
                size="sm"
                onClick={handleContact}
                disabled={chatLoading}
              >
                <MessageSquare className="mr-1.5 h-4 w-4" />
                Contact Agent
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Owner Actions */}
        {isOwner && (
          <div className="mt-6 space-y-3 lg:hidden">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Manage Listing
            </p>
            <Link
              to={`/edit/${post.id}`}
              className="flex w-full items-center gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-secondary hover:text-gold"
            >
              <Edit className="h-4 w-4" />
              Edit Listing
            </Link>

            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogTrigger asChild>
                <button className="flex w-full items-center gap-2 rounded-md border border-destructive/30 bg-surface px-4 py-3 text-sm font-medium text-destructive transition-all hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                  Delete Listing
                </button>
              </DialogTrigger>
              <DialogContent className="border-border bg-card">
                <DialogHeader>
                  <DialogTitle className="text-foreground">
                    Delete Listing
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-muted-foreground">
                  Are you sure? This cannot be undone.
                </DialogDescription>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Chat Sheet */}
        <Sheet open={chatOpen} onOpenChange={setChatOpen}>
          <SheetContent
            side="right"
            className="flex w-full flex-col border-border bg-card p-0 sm:max-w-md"
          >
            <SheetHeader className="border-b border-border px-6 py-4">
              <SheetTitle className="text-foreground">
                Chat with {post.user?.username || 'Agent'}
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
              <div className="rounded-full bg-gold/10 p-4">
                <MessageSquare className="h-8 w-8 text-gold" />
              </div>
              <p className="text-sm text-muted-foreground">
                Chat will be available in the next update.
              </p>
            </div>
          </SheetContent>
        </Sheet>

        {/* Mobile bottom padding for CTA bar */}
        <div className="h-20 lg:hidden" />
      </PageShell>
    </>
  )
}

function MiniMap({
  lat,
  lng,
  title,
}: {
  lat: number
  lng: number
  title: string
}) {
  return (
    <div className="h-[300px] w-full overflow-hidden rounded-lg border border-border">
      <MapView
        items={[
          {
            id: '0',
            title,
            latitude: String(lat),
            longitude: String(lng),
            price: 0,
            bedroom: 0,
            images: [],
          },
        ]}
        center={[lat, lng]}
        zoom={14}
      />
    </div>
  )
}

import { useLoaderData, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'sonner'
import { Trash2, User, Mail, Settings } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { PropertyGrid } from '@/components/property/PropertyGrid'
import { EmptyState } from '@/components/shared/EmptyState'
import { Avatar, AvatarImage, AvatarFallback } from '@/vendor/ui/avatar'
import { Button } from '@/vendor/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/vendor/ui/tabs'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/vendor/ui/dialog'
import { Sheet, SheetContent } from '@/vendor/ui/sheet'
import { Input } from '@/vendor/ui/input'
import { useAuthStore } from '@/store/auth'
import { deleteUser } from '@/lib/api/users'
import { getChats } from '@/lib/api/chats'
import { subscribeToChat } from '@/lib/api/socket'
import type { Post, Chat, Message } from '@/lib/types'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { sendMessage } from '@/lib/api/messages'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const { myPosts, savedPosts } = useLoaderData() as {
    myPosts: Post[]
    savedPosts: Post[]
  }
  const { currentUser, logout } = useAuthStore()
  const navigate = useNavigate()

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteEmail, setDeleteEmail] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)

  useEffect(() => {
    getChats()
      .then(setChats)
      .catch(() => {
        setChats([])
        toast.error('Failed to load chats')
      })
  }, [])

  useEffect(() => {
    if (!selectedChatId) return

    const onNewMessage = (message: Message) => {
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== selectedChatId) return chat
          const existing = chat.messages ?? []
          const alreadyReceived = existing.some((m) => m.id === message.id)
          if (alreadyReceived) return chat
          return {
            ...chat,
            messages: [...existing, message],
            lastMessage: message.text,
          }
        }),
      )
    }

    const unsubscribe = subscribeToChat(selectedChatId, onNewMessage)
    return () => {
      unsubscribe()
    }
  }, [selectedChatId])

  const handleDelete = async () => {
    if (!currentUser || deleteEmail !== currentUser.email) return
    setIsDeleting(true)
    try {
      await deleteUser(currentUser.id)
      await logout()
      toast.success('Account deleted')
      navigate('/')
    } catch {
      toast.error('Failed to delete account. Please try again.')
    } finally {
      setIsDeleting(false)
      setDeleteOpen(false)
    }
  }

  if (!currentUser) return null

  const initials = currentUser.username.charAt(0).toUpperCase()

  return (
    <>
      <Helmet>
        <title>My Profile | Leon Real Estate</title>
        <meta
          name="description"
          content="Manage your profile, listings, saved properties, and conversations on Leon Real Estate."
        />
      </Helmet>

      <PageShell>
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1">
            {/* Profile Header */}
            <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-8 text-center sm:flex-row sm:text-left">
              <Avatar className="h-24 w-24 border-2 border-gold/30 shadow-lg shadow-gold/10">
                <AvatarImage
                  src={currentUser.avatar}
                  alt={currentUser.username}
                />
                <AvatarFallback className="bg-gold/10 font-display text-2xl text-gold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                  {currentUser.username}
                </h1>
                <div className="flex items-center justify-center gap-1.5 text-muted-foreground sm:justify-start">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{currentUser.email}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link to="/profile/edit">
                    <Settings className="mr-1.5 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="listings" className="mt-8">
              <TabsList className="w-full justify-start rounded-lg border border-border bg-surface p-1">
                <TabsTrigger
                  value="listings"
                  className="data-[state=active]:bg-gold data-[state=active]:text-accent-foreground"
                >
                  My Listings
                </TabsTrigger>
                <TabsTrigger
                  value="saved"
                  className="data-[state=active]:bg-gold data-[state=active]:text-accent-foreground"
                >
                  Saved Posts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="listings" className="mt-6">
                {myPosts.length > 0 ? (
                  <PropertyGrid properties={myPosts} />
                ) : (
                  <EmptyState
                    icon={User}
                    title="You haven't listed any properties"
                    action={{ label: 'Create Your First Listing', to: '/add' }}
                  />
                )}
              </TabsContent>

              <TabsContent value="saved" className="mt-6">
                {savedPosts.length > 0 ? (
                  <PropertyGrid properties={savedPosts} />
                ) : (
                  <EmptyState
                    title="You haven't saved any properties yet"
                    description="Save properties you love to view them here."
                    action={{ label: 'Browse Properties', to: '/list' }}
                  />
                )}
              </TabsContent>
            </Tabs>

            {/* Danger Zone */}
            <div className="mt-12 rounded-lg border border-destructive/30 bg-destructive/5 p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold text-destructive">
                    Danger Zone
                  </h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Permanently delete your account and all associated data.
                  </p>
                </div>
                <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-1.5 h-4 w-4" />
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-destructive/40 sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-display text-destructive">
                        Delete Account
                      </DialogTitle>
                      <DialogDescription>
                        This action is permanent and cannot be undone. All your
                        listings, messages, and data will be erased.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Please type{' '}
                        <span className="font-medium text-foreground">
                          {currentUser.email}
                        </span>{' '}
                        to confirm:
                      </p>
                      <Input
                        placeholder="Enter your email"
                        value={deleteEmail}
                        onChange={(e) => setDeleteEmail(e.target.value)}
                        className="bg-surface/60"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        disabled={
                          deleteEmail !== currentUser.email || isDeleting
                        }
                        onClick={handleDelete}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete My Account'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Chat Sidebar (Desktop) */}
          <div className="hidden w-80 shrink-0 lg:block">
            <div className="sticky top-24 rounded-lg border border-border bg-card">
              <div className="border-b border-border px-4 py-3">
                <h3 className="font-display text-base font-semibold text-gold">
                  Messages
                </h3>
              </div>
              <ChatPanel
                chats={chats}
                onSelectChat={setSelectedChatId}
                selectedChatId={selectedChatId ?? undefined}
                currentUserId={currentUser?.id ?? ''}
              />
            </div>
          </div>
        </div>

        {/* Chat Sheet */}
        <Sheet
          open={!!selectedChatId}
          onOpenChange={(open) => !open && setSelectedChatId(null)}
        >
          <SheetContent
            side="right"
            className="w-full border-l border-border bg-card sm:max-w-md"
          >
            {selectedChatId &&
              (() => {
                const chat = chats.find((c) => c.id === selectedChatId)
                if (!chat) return null
                return (
                  <ChatWindow
                    chat={chat}
                    currentUserId={currentUser?.id ?? ''}
                    onBack={() => setSelectedChatId(null)}
                    onSend={async (text) => {
                      await sendMessage(selectedChatId, text)
                    }}
                  />
                )
              })()}
          </SheetContent>
        </Sheet>
      </PageShell>
    </>
  )
}

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { profileUpdateSchema, type ProfileUpdateInput } from '@/lib/types'
import { useAuthStore } from '@/store/auth'
import { updateUser } from '@/lib/api/users'
import { PageShell } from '@/components/layout/PageShell'
import { UploadButton } from '@/components/upload/UploadButton'
import { Avatar, AvatarImage, AvatarFallback } from '@/vendor/ui/avatar'
import { Button } from '@/vendor/ui/button'
import { Input } from '@/vendor/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/vendor/ui/card'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/vendor/ui/form'

export default function ProfileEditPage() {
  const { currentUser, updateUser: updateAuthUser } = useAuthStore()
  const navigate = useNavigate()

  const form = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      username: currentUser?.username ?? '',
      email: currentUser?.email ?? '',
      password: '',
      avatar: currentUser?.avatar ?? '',
    },
  })

  const avatarValue = form.watch('avatar')

  async function onSubmit(data: ProfileUpdateInput) {
    if (!currentUser) return
    const payload: Record<string, string> = {}
    if (data.username) payload.username = data.username
    if (data.email) payload.email = data.email
    if (data.password) payload.password = data.password
    if (data.avatar) payload.avatar = data.avatar
    try {
      const updated = await updateUser(currentUser.id, payload)
      updateAuthUser(updated)
      toast.success('Profile updated!')
      navigate('/profile')
    } catch {
      toast.error('Failed to update profile. Please try again.')
    }
  }

  if (!currentUser) return null

  const initials = currentUser.username.charAt(0).toUpperCase()

  return (
    <>
      <Helmet>
        <title>Edit Profile | Leon Real Estate</title>
        <meta
          name="description"
          content="Update your profile information and avatar on Leon Real Estate."
        />
      </Helmet>

      <PageShell>
        <div className="mx-auto max-w-xl animate-fade-in pt-2 sm:pt-4">
          <Link
            to="/profile"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>

          <Card className="luxury-card gold-border border-t-2 border-t-gold p-0 shadow-xl shadow-gold/5">
            <CardHeader className="px-6 pb-4 pt-6">
              <CardTitle className="font-display text-xl font-semibold text-gold">
                Edit Profile
              </CardTitle>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                  noValidate
                >
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                    <Avatar className="h-20 w-20 border-2 border-gold/30 shadow-lg shadow-gold/10">
                      <AvatarImage
                        src={avatarValue || currentUser.avatar}
                        alt={currentUser.username}
                      />
                      <AvatarFallback className="bg-gold/10 font-display text-xl text-gold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center gap-2 sm:items-start">
                      <UploadButton
                        onUpload={(urls) => {
                          if (urls.length > 0) {
                            form.setValue('avatar', urls[0], {
                              shouldValidate: true,
                            })
                          }
                        }}
                      />
                      <FormField
                        control={form.control}
                        name="avatar"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="text-xs text-muted-foreground">
                              Or paste avatar URL
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://..."
                                className="bg-surface/60 text-sm transition-colors focus-visible:border-gold/40 focus-visible:ring-gold"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">
                          Username
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your username"
                            className="bg-surface/60 transition-colors focus-visible:border-gold/40 focus-visible:ring-gold"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="bg-surface/60 transition-colors focus-visible:border-gold/40 focus-visible:ring-gold"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">
                          New Password{' '}
                          <span className="text-xs text-muted-foreground/60">
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Leave blank to keep current"
                            className="bg-surface/60 transition-colors focus-visible:border-gold/40 focus-visible:ring-gold"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-3 border-t border-border pt-4">
                    <Button variant="outline" asChild>
                      <Link to="/profile">Cancel</Link>
                    </Button>
                    <Button
                      type="submit"
                      variant="gold"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </PageShell>
    </>
  )
}

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Loader2, LogIn } from 'lucide-react'
import { loginSchema, type LoginInput } from '@/lib/types'
import { ApiError } from '@/lib/api/errors'
import { useAuthStore } from '@/store/auth'
import { PageShell } from '@/components/layout/PageShell'
import { Button } from '@/vendor/ui/button'
import { Input } from '@/vendor/ui/input'
import { Card, CardHeader, CardContent } from '@/vendor/ui/card'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/vendor/ui/form'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  async function onSubmit(values: LoginInput) {
    try {
      await login(values.username, values.password)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err: unknown) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Login failed. Please try again.'
      toast.error(message)
    }
  }

  return (
    <PageShell>
      <Helmet>
        <title>Login | Leon Real Estate</title>
      </Helmet>

      <div className="mx-auto max-w-md animate-fade-in pt-4 sm:pt-8">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 ring-1 ring-gold/30">
            <LogIn className="h-6 w-6 text-gold" />
          </div>
          <h1 className="gold-gradient-text font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage your properties
          </p>
        </div>

        <Card className="luxury-card gold-border border-t-2 border-t-gold p-0 shadow-xl shadow-gold/5">
          <CardHeader className="px-6 pb-4 pt-6">
            <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
              Sign In
            </h2>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
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
                          placeholder="Enter your username"
                          autoComplete="username"
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
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          className="bg-surface/60 transition-colors focus-visible:border-gold/40 focus-visible:ring-gold"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  disabled={form.formState.isSubmitting}
                  className="w-full gap-2 text-sm font-semibold tracking-wide"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center justify-center gap-1.5">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-xs text-muted-foreground">or</span>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-gold underline-offset-4 transition-colors hover:text-gold/80 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </PageShell>
  )
}

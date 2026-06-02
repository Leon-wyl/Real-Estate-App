import { createBrowserRouter, redirect } from 'react-router-dom'
import { Layout } from '@/components/layout/index'
import { useAuthStore, authHydrated } from '@/store/auth'
import { getPosts, getPost } from '@/lib/api/posts'
import { getSavedPosts } from '@/lib/api/users'
import { lazy } from 'react'

const HomePage = lazy(() => import('@/page/HomePage'))
const ListingsPage = lazy(() => import('@/page/ListingsPage'))
const PropertyPage = lazy(() => import('@/page/PropertyPage'))
const EditListingPage = lazy(() => import('@/page/EditListingPage'))
const LoginPage = lazy(() => import('@/page/LoginPage'))
const RegisterPage = lazy(() => import('@/page/RegisterPage'))
const ProfilePage = lazy(() => import('@/page/ProfilePage'))
const ProfileEditPage = lazy(() => import('@/page/ProfileEditPage'))
const NewListingPage = lazy(() => import('@/page/NewListingPage'))
const NotFoundPage = lazy(() => import('@/page/NotFoundPage'))

// Auth guard loader — redirects to /login if not authenticated
async function requireAuth() {
  await authHydrated
  const { isAuthenticated } = useAuthStore.getState()
  if (!isAuthenticated) throw redirect('/login')
  return null
}

// Owner guard — redirects if current user is not the post owner
async function requireOwner({ params }: { params: { id?: string } }) {
  await authHydrated
  const { currentUser, isAuthenticated } = useAuthStore.getState()
  if (!isAuthenticated || !params.id) throw redirect('/login')
  try {
    const post = await getPost(params.id)
    if (post.userId !== currentUser?.id) throw redirect('/')
    return post
  } catch (err: any) {
    if (err?.status === 404) throw redirect('/')
    throw err
  }
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: async () => {
          const posts = await getPosts().catch(() => [])
          return { posts: posts.slice(0, 6) }
        },
      },
      {
        path: 'list',
        element: <ListingsPage />,
        loader: async ({ request }) => {
          const url = new URL(request.url)
          const raw = Object.fromEntries(url.searchParams)
          const params: Record<string, any> = { ...raw }
          if (raw.bedroom) params.bedroom = Number(raw.bedroom)
          if (raw.minPrice) params.minPrice = Number(raw.minPrice)
          if (raw.maxPrice) params.maxPrice = Number(raw.maxPrice)
          const posts = await getPosts(params).catch(() => [])
          return { posts, filters: raw }
        },
      },
      {
        path: 'edit/:id',
        element: <EditListingPage />,
        loader: requireOwner,
      },
      {
        path: ':id',
        element: <PropertyPage />,
        loader: async ({ params }) => {
          if (!params.id) throw new Error('No ID provided')
          const post = await getPost(params.id)
          return post
        },
      },
      {
        path: 'login',
        element: <LoginPage />,
        loader: async () => {
          await authHydrated
          if (useAuthStore.getState().isAuthenticated) throw redirect('/')
          return null
        },
      },
      {
        path: 'register',
        element: <RegisterPage />,
        loader: async () => {
          await authHydrated
          if (useAuthStore.getState().isAuthenticated) throw redirect('/')
          return null
        },
      },
      {
        path: 'profile',
        element: <ProfilePage />,
        loader: async () => {
          await authHydrated
          const { currentUser, isAuthenticated } = useAuthStore.getState()
          if (!isAuthenticated || !currentUser) throw redirect('/login')
          const [myPosts, savedPosts] = await Promise.all([
            getPosts({ userId: currentUser.id }).catch(() => []),
            getSavedPosts().catch(() => []),
          ])
          return { myPosts, savedPosts }
        },
      },
      {
        path: 'profile/edit',
        element: <ProfileEditPage />,
        loader: requireAuth,
      },
      {
        path: 'add',
        element: <NewListingPage />,
        loader: requireAuth,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])

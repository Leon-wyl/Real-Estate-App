import { useState } from 'react'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Pencil } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { ListingForm } from '@/components/property/ListingForm'
import { Card, CardContent } from '@/vendor/ui/card'
import { updatePost } from '@/lib/api/posts'
import { toast } from 'sonner'
import type { Post, UpdateListingInput } from '@/lib/types'

export default function EditListingPage() {
  const post = useLoaderData() as Post
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: UpdateListingInput) => {
    if (!id) return
    setIsLoading(true)
    try {
      await updatePost(id, data)
      toast.success('Listing updated!')
      navigate(`/${id}`)
    } catch {
      toast.error('Failed to update listing')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Edit Listing | Leon Real Estate</title>
        <meta
          name="description"
          content="Edit your property listing details, photos, and pricing on Leon Real Estate."
        />
      </Helmet>

      <PageShell>
        <motion.div
          className="mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Card className="luxury-card">
            <CardContent className="pt-6">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
                  <Pencil className="h-5 w-5 text-gold" />
                </div>
                <h1 className="gold-gradient-text font-display text-2xl font-bold sm:text-3xl">
                  Edit Listing
                </h1>
              </div>

              <ListingForm
                mode="edit"
                defaultValues={post}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </motion.div>
      </PageShell>
    </>
  )
}

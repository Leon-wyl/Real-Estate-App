import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { ListingForm } from '@/components/property/ListingForm'
import { Card, CardContent } from '@/vendor/ui/card'
import { createPost } from '@/lib/api/posts'
import { toast } from 'sonner'
import type { CreateListingInput, UpdateListingInput } from '@/lib/types'

export default function NewListingPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (
    data: CreateListingInput | UpdateListingInput,
  ) => {
    setIsLoading(true)
    try {
      const response = await createPost(data as CreateListingInput)
      toast.success('Listing created!')
      navigate(`/${response.id}`)
    } catch {
      toast.error('Failed to create listing')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Add Listing | Leon Real Estate</title>
        <meta
          name="description"
          content="List your property for sale or rent on Leon Real Estate. Reach thousands of potential buyers and tenants."
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
                  <Plus className="h-5 w-5 text-gold" />
                </div>
                <h1 className="gold-gradient-text font-display text-2xl font-bold sm:text-3xl">
                  Create New Listing
                </h1>
              </div>

              <ListingForm
                mode="create"
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

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/vendor/ui/button'
import { Input } from '@/vendor/ui/input'
import { Textarea } from '@/vendor/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/vendor/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/vendor/ui/form'
import { UploadButton } from '@/components/upload/UploadButton'
import ImagePreview from '@/components/upload/ImagePreview'
import { PROPERTY_TYPES, LISTING_TYPES, BEDROOM_OPTIONS } from '@/lib/constants'
import type { CreateListingInput, UpdateListingInput, Post } from '@/lib/types'
import { createListingSchema, updateListingSchema } from '@/lib/types'
import { useMemo } from 'react'

interface ListingFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Post
  onSubmit: (data: CreateListingInput | UpdateListingInput) => Promise<void>
  isLoading?: boolean
}

type CreateFormData = {
  postData: {
    title: string
    price: number
    images: string[]
    address: string
    city: string
    bedroom: number
    bathroom: number
    latitude: string
    longitude: string
    type: 'buy' | 'rent'
    property: 'house' | 'apartment' | 'condo' | 'land'
  }
  postDetail: {
    desc: string
    utilities?: string
    pet?: string
    income?: string
    size?: number
    school?: number
    bus?: number
    restaurant?: number
  }
}

export function ListingForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading,
}: ListingFormProps) {
  const isCreate = mode === 'create'

  const createDefaults = useMemo<CreateFormData>(
    () => ({
      postData: {
        title: '',
        price: 0,
        images: [],
        address: '',
        city: '',
        bedroom: 1,
        bathroom: 1,
        latitude: '',
        longitude: '',
        type: 'buy',
        property: 'house',
      },
      postDetail: {
        desc: '',
        utilities: '',
        pet: '',
        income: '',
        size: undefined,
        school: undefined,
        bus: undefined,
        restaurant: undefined,
      },
    }),
    [],
  )

  const editDefaults = useMemo(
    () =>
      defaultValues
        ? {
            title: defaultValues.title,
            price: defaultValues.price,
            images: defaultValues.images,
            address: defaultValues.address,
            city: defaultValues.city,
            bedroom: defaultValues.bedroom,
            bathroom: defaultValues.bathroom,
            latitude: defaultValues.latitude,
            longitude: defaultValues.longitude,
            type: defaultValues.type,
            property: defaultValues.property,
            postDetail: {
              desc: defaultValues.postDetail?.desc ?? '',
              utilities: defaultValues.postDetail?.utilities ?? '',
              pet: defaultValues.postDetail?.pet ?? '',
              income: defaultValues.postDetail?.income ?? '',
              size: defaultValues.postDetail?.size,
              school: defaultValues.postDetail?.school,
              bus: defaultValues.postDetail?.bus,
              restaurant: defaultValues.postDetail?.restaurant,
            },
          }
        : {},
    [defaultValues],
  )

  // `any` is intentional — create mode uses nested `postData.*` paths while
  // edit mode uses flat top-level paths via the `fieldPath()` helper
  const form = useForm<any>({
    resolver: zodResolver(isCreate ? createListingSchema : updateListingSchema),
    defaultValues: isCreate ? createDefaults : editDefaults,
  })

  const images = form.watch(isCreate ? 'postData.images' : 'images')

  const handleSubmit = form.handleSubmit(async (data: any) => {
    await onSubmit(data)
  })

  function fieldPath(base: string): string {
    return isCreate ? `postData.${base}` : base
  }

  // postDetail is nested the same way in both create and edit modes,
  // so its field paths don't need the fieldPath() prefix transform

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset className="space-y-4">
          <legend className="font-display text-lg font-semibold text-foreground">
            Basic Information
          </legend>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name={fieldPath('type')}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Listing Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LISTING_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={fieldPath('property')}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROPERTY_TYPES.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name={fieldPath('title')}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Luxury Villa with Ocean View"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={fieldPath('price')}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 500000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name={fieldPath('address')}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main Street" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={fieldPath('city')}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. New York" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name={fieldPath('bedroom')}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(Number(v))}
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BEDROOM_OPTIONS.map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={fieldPath('bathroom')}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(Number(v))}
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BEDROOM_OPTIONS.map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name={fieldPath('latitude')}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 40.7128" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={fieldPath('longitude')}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. -74.0060" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-display text-lg font-semibold text-foreground">
            Images
          </legend>
          <FormField
            control={form.control}
            name={fieldPath('images')}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-3">
                    <UploadButton
                      onUpload={(urls) =>
                        field.onChange([...field.value, ...urls])
                      }
                    />
                    {images?.length > 0 && (
                      <ImagePreview
                        images={images}
                        onRemove={(index) => {
                          const next = [...field.value]
                          next.splice(index, 1)
                          field.onChange(next)
                        }}
                      />
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Upload clear photos of the property.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-display text-lg font-semibold text-foreground">
            Details
          </legend>

          <FormField
            control={form.control}
            name="postDetail.desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the property..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="postDetail.utilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Utilities Policy</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Included" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postDetail.pet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pet Policy</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Allowed" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="postDetail.income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Income Policy</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. No requirement" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postDetail.size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size (sqft)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 1500" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="postDetail.school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School (m)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Distance" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postDetail.bus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bus Stop (m)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Distance" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postDetail.restaurant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant (m)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Distance" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </fieldset>

        <Button
          type="submit"
          variant="gold"
          className="w-full sm:w-auto"
          disabled={isLoading}
        >
          {isLoading
            ? 'Saving...'
            : isCreate
              ? 'Create Listing'
              : 'Save Changes'}
        </Button>
      </form>
    </Form>
  )
}

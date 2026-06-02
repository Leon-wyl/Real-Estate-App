import { X } from 'lucide-react'
import { handleImgError } from '@/lib/utils'

interface ImagePreviewProps {
  images: string[]
  onRemove: (index: number) => void
}

export default function ImagePreview({ images, onRemove }: ImagePreviewProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {images.map((url, i) => (
        <div
          key={url}
          className="group relative h-24 w-24 overflow-hidden rounded-md border border-border"
        >
          <img
            src={url}
            alt={`Uploaded image ${i + 1}`}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={handleImgError}
          />
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
            aria-label={`Remove image ${i + 1}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}

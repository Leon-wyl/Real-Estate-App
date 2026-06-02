import { useState, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react'
import { Dialog, DialogContent } from '@/vendor/ui/dialog'
import { cn, handleImgError } from '@/lib/utils'

interface ImageGalleryProps {
  images: string[]
  title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!images || images.length === 0) return null

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < images.length) setSelected(index)
    },
    [images.length],
  )

  const goNext = useCallback(
    () => goTo((selected + 1) % images.length),
    [goTo, selected, images.length],
  )
  const goPrev = useCallback(
    () => goTo((selected - 1 + images.length) % images.length),
    [goTo, selected, images.length],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, goNext, goPrev])

  const openLightbox = (index: number) => {
    setSelected(index)
    setLightboxOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div
        className="relative cursor-pointer overflow-hidden rounded-lg border border-border"
        onClick={() => openLightbox(selected)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && openLightbox(selected)}
        aria-label="Open image gallery"
      >
        <img
          src={images[selected]}
          alt={`${title} - Image ${selected + 1}`}
          className="h-[300px] w-full object-cover sm:h-[400px] lg:h-[500px]"
          onError={handleImgError}
        />
        <div className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60">
          <Maximize2 className="h-4 w-4" />
        </div>
        {/* Arrow navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goPrev()
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goNext()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        {/* Counter */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
          {selected + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                'h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all',
                i === selected
                  ? 'border-gold'
                  : 'border-transparent opacity-60 hover:opacity-100',
              )}
            >
              <img
                src={img}
                alt={`${title} - Thumbnail ${i + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={handleImgError}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[90vw] border-0 bg-black/95 p-0">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative flex items-center justify-center p-4">
            <img
              src={images[selected]}
              alt={`${title} - Image ${selected + 1}`}
              className="max-h-[80vh] w-full object-contain"
              onError={handleImgError}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white hover:bg-black/60"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white hover:bg-black/60"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

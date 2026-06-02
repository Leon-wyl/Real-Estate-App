import { useCallback, useEffect, useRef } from 'react'

interface UploadButtonProps {
  onUpload: (urls: string[]) => void
}

export function UploadButton({ onUpload }: UploadButtonProps) {
  const cloudinaryRef = useRef<any>()
  const widgetRef = useRef<any>()
  const onUploadRef = useRef(onUpload)
  onUploadRef.current = onUpload

  useEffect(() => {
    cloudinaryRef.current = (window as any).cloudinary
    widgetRef.current = cloudinaryRef.current?.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'leonwu',
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'estate',
        folder: 'posts',
        multiple: true,
        maxFiles: 10,
        sources: ['local', 'url', 'camera'],
        styles: {
          palette: {
            window: '#0F0F0F',
            sourceBg: '#1A1A1A',
            windowBorder: '#D4AF37',
            tabIcon: '#D4AF37',
            inactiveTabIcon: '#555555',
            menuIcons: '#D4AF37',
            link: '#D4AF37',
            action: '#D4AF37',
            inProgress: '#D4AF37',
            complete: '#D4AF37',
            error: '#EF4444',
            textDark: '#FFFFFF',
            textLight: '#D1D5DB',
          },
          fonts: {
            default: null,
            "'Inter', sans-serif": {
              url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600',
              active: true,
            },
          },
        },
      },
      (error: any, result: any) => {
        if (!error && result?.event === 'success') {
          onUploadRef.current([result.info.secure_url])
        }
        if (error) {
          console.error('Upload error:', error)
        }
      },
    )

    return () => {
      widgetRef.current?.destroy()
      widgetRef.current = null
    }
  }, [])

  const openWidget = useCallback(() => {
    widgetRef.current?.open()
  }, [])

  return (
    <div>
      <button
        type="button"
        onClick={openWidget}
        className="inline-flex items-center gap-2 rounded-md border border-dashed border-gold/40 px-6 py-4 text-sm text-gold transition-colors hover:border-gold hover:bg-gold/5"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Upload Images
      </button>
    </div>
  )
}

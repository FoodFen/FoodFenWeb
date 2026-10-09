import { photoUrl } from '@/lib/photos'

export function Photo({
  id,
  alt,
  w,
  h,
  className = '',
  priority = false,
}: {
  id: string
  alt: string
  w: number
  h?: number
  className?: string
  priority?: boolean
}) {
  return (
    <img
      src={photoUrl(id, w, h)}
      alt={alt}
      width={w}
      height={h ?? w}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className={`object-cover ${className}`}
    />
  )
}

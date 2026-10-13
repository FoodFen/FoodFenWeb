import { ImageOff } from 'lucide-react'

/** Square dish photo, or a placeholder when the dish has none. */
export function DishThumb({ url, name }: { url: string | null; name: string }) {
  const size = 'size-20 shrink-0 rounded-xl sm:size-24'
  return url ? (
    <img src={url} alt={name} className={`${size} object-cover`} />
  ) : (
    <div className={`${size} bg-muted text-muted-foreground flex items-center justify-center`}>
      <ImageOff className="size-6" aria-hidden />
    </div>
  )
}

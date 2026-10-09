import type { LucideIcon } from 'lucide-react'

export function IconBadge({
  icon: Icon,
  className = '',
}: {
  icon: LucideIcon
  className?: string
}) {
  return (
    <span className={`relative flex size-11 items-center justify-center rounded-xl ${className}`}>
      <Icon className="size-5" aria-hidden />
    </span>
  )
}

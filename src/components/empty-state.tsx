import { cn } from 'cn'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

/** Centered icon, title and optional hint and action for lists with nothing to show. */
export function EmptyState({
  icon: Icon,
  title,
  hint,
  className,
  children,
}: {
  icon: LucideIcon
  title: string
  hint?: string
  className?: string
  children?: ReactNode
}) {
  return (
    <div className={cn('flex flex-col items-center gap-2 py-16 text-center', className)}>
      <Icon className="text-muted-foreground size-10" aria-hidden />
      <p className="font-medium">{title}</p>
      {hint && <p className="text-muted-foreground text-sm">{hint}</p>}
      {children}
    </div>
  )
}

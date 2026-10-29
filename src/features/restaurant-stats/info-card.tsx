import { IconBadge } from '@/components/icon-badge'
import { Card } from '@/components/ui/card'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

/** Same frame as `StatCard`, for values that are not a plain number (a badge, a sentence). */
export function InfoCard({
  icon,
  label,
  children,
}: {
  icon: LucideIcon
  label: string
  children: ReactNode
}) {
  return (
    <Card className="gap-3 rounded-2xl p-4 sm:gap-4 sm:p-5">
      <IconBadge icon={icon} className="bg-primary/10 text-primary" />
      <div className="space-y-1">
        <div className="flex min-h-8 flex-col justify-center gap-1 sm:min-h-9">{children}</div>
        <p className="text-muted-foreground text-sm">{label}</p>
      </div>
    </Card>
  )
}

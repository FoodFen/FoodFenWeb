import { IconBadge } from '@/components/icon-badge'
import { Card } from '@/components/ui/card'
import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react'

export function StatCard({
  icon,
  label,
  value,
  delta,
  format = (n) => n.toLocaleString('vi-VN'),
}: {
  icon: LucideIcon
  label: string
  value: number
  delta?: number
  format?: (value: number) => string
}) {
  const up = (delta ?? 0) >= 0
  const Trend = up ? TrendingUp : TrendingDown
  return (
    <Card className="rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <IconBadge icon={icon} className="bg-primary/10 text-primary" />
        {delta !== undefined && (
          <span
            className={`flex items-center gap-1 text-sm font-medium tabular-nums ${up ? 'text-primary' : 'text-destructive'}`}
          >
            <Trend className="size-4" aria-hidden />
            {up ? '+' : ''}
            {delta.toLocaleString('vi-VN')} %<span className="sr-only">so với hôm qua</span>
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold tracking-tight tabular-nums">{format(value)}</p>
        <p className="text-muted-foreground text-sm">{label}</p>
      </div>
    </Card>
  )
}

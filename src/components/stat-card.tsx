import { IconBadge } from '@/components/icon-badge'
import { Card } from '@/components/ui/card'
import { formatNumber } from '@/lib/format'
import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function StatCard({
  icon,
  label,
  value,
  delta,
  format = formatNumber,
}: {
  icon: LucideIcon
  label: string
  value: number
  delta?: number
  format?: (value: number) => string
}) {
  const { t } = useTranslation('admin')
  const up = (delta ?? 0) >= 0
  const Trend = up ? TrendingUp : TrendingDown
  return (
    <Card className="gap-3 rounded-2xl p-4 sm:gap-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <IconBadge icon={icon} className="bg-primary/10 text-primary" />
        {delta !== undefined && (
          <span
            className={`flex items-center gap-1 text-sm font-medium tabular-nums ${up ? 'text-primary' : 'text-destructive'}`}
          >
            <Trend className="size-4" aria-hidden />
            {up ? '+' : ''}
            {formatNumber(delta)} %<span className="sr-only">{t('vsYesterday')}</span>
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
          {format(value)}
        </p>
        <p className="text-muted-foreground text-sm">{label}</p>
      </div>
    </Card>
  )
}

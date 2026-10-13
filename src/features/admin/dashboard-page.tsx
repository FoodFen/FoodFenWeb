import { parseApiError } from '@/api/errors'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DashboardView } from './dashboard-view'
import type { DateRange } from './date-range-fields'
import { useDashboard } from './use-dashboard'

export function DashboardPage() {
  const { t } = useTranslation(['admin', 'common'])
  const [range, setRange] = useState<DateRange | null>(null)
  const dashboard = useDashboard(range)

  if (dashboard.isPending) return <Skeleton className="h-96 w-full rounded-2xl" aria-busy />

  if (dashboard.isError) {
    return (
      <div className="space-y-3">
        <p role="alert">{parseApiError(dashboard.error).message}</p>
        <Button
          variant="outline"
          className="h-11 px-4"
          onClick={() => (range ? setRange(null) : void dashboard.refetch())}
        >
          {range ? t('dashboard.backToDefault') : t('common:retry')}
        </Button>
      </div>
    )
  }

  const { from, to, totals, daily } = dashboard.data
  return (
    <DashboardView
      totals={totals}
      daily={daily}
      range={range ?? { from, to }}
      onRangeChange={setRange}
    />
  )
}

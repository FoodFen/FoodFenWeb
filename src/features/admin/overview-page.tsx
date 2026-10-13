import type { DashboardResponse } from '@/api/generated'
import { Skeleton } from '@/components/ui/skeleton'
import { Crown, UserPlus, UtensilsCrossed } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DailyChart } from '@/components/daily-chart'
import { PageHeader } from './page-header'
import { percentChange } from './percent-change'
import { QueryError } from '@/components/query-error'
import { StatCard } from './stat-card'
import { useDashboard } from './use-dashboard'

export function OverviewPage() {
  const { t } = useTranslation('admin')
  const dashboard = useDashboard(null)

  return (
    <div className="space-y-6">
      <PageHeader title={t('overview.title')} description={t('overview.description')} />
      {dashboard.isPending ? (
        <Skeleton className="h-96 w-full rounded-2xl" aria-busy />
      ) : dashboard.isError ? (
        <QueryError error={dashboard.error} onRetry={() => void dashboard.refetch()} />
      ) : (
        <Overview {...dashboard.data} />
      )}
    </div>
  )
}

function Overview({ daily, totals }: Pick<DashboardResponse, 'daily' | 'totals'>) {
  const { t } = useTranslation('admin')
  const today = daily.at(-1)
  const yesterday = daily.at(-2)
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          icon={UserPlus}
          label={t('overview.newUsersToday')}
          value={today?.newUsers ?? 0}
          delta={today && yesterday && percentChange(today.newUsers, yesterday.newUsers)}
        />
        <StatCard
          icon={UtensilsCrossed}
          label={t('overview.mealsToday')}
          value={today?.foodEntries ?? 0}
          delta={today && yesterday && percentChange(today.foodEntries, yesterday.foodEntries)}
        />
        <StatCard icon={Crown} label={t('overview.premiumUsers')} value={totals.premiumUsers} />
      </div>
      <DailyChart
        title={t('dashboard.charts.newUsers.title')}
        description={t('overview.last30Days')}
        rows={daily}
        series={[
          { key: 'newUsers', label: t('dashboard.series.newUsers'), color: 'var(--chart-1)' },
        ]}
      />
    </>
  )
}

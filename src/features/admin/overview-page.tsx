import type { DashboardResponse } from '@/api/generated'
import { Skeleton } from '@/components/ui/skeleton'
import { Crown, UserPlus, UtensilsCrossed } from 'lucide-react'
import { DailyChart } from '@/components/daily-chart'
import { PageHeader } from './page-header'
import { percentChange } from './percent-change'
import { QueryError } from './query-error'
import { StatCard } from './stat-card'
import { useDashboard } from './use-dashboard'

export function OverviewPage() {
  const dashboard = useDashboard(null)

  return (
    <div className="space-y-6">
      <PageHeader title="Tổng quan" description="Hoạt động của FoodFen trong ngày hôm nay." />
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
  const today = daily.at(-1)
  const yesterday = daily.at(-2)
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          icon={UserPlus}
          label="Người dùng mới hôm nay"
          value={today?.newUsers ?? 0}
          delta={today && yesterday && percentChange(today.newUsers, yesterday.newUsers)}
        />
        <StatCard
          icon={UtensilsCrossed}
          label="Bữa ăn được ghi hôm nay"
          value={today?.foodEntries ?? 0}
          delta={today && yesterday && percentChange(today.foodEntries, yesterday.foodEntries)}
        />
        <StatCard icon={Crown} label="Người dùng Premium" value={totals.premiumUsers} />
      </div>
      <DailyChart
        title="Người dùng mới theo ngày"
        description="30 ngày gần nhất"
        rows={daily}
        series={[{ key: 'newUsers', label: 'Người dùng mới', color: 'var(--chart-1)' }]}
      />
    </>
  )
}

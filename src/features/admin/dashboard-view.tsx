import type { DashboardDayResponse, DashboardTotalsResponse } from '@/api/generated'
import { formatVnd } from '@/lib/format'
import { Crown, Megaphone, Store, UserPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DailyChart } from '@/components/daily-chart'
import { DateRangeFields, type DateRange } from './date-range-fields'
import { PageHeader } from '@/components/page-header'
import { StatCard } from './stat-card'

type Props = {
  totals: DashboardTotalsResponse
  daily: DashboardDayResponse[]
  range: DateRange
  onRangeChange: (range: DateRange) => void
}

export function DashboardView({ totals, daily, range, onRangeChange }: Props) {
  const { t } = useTranslation('admin')
  return (
    <div className="space-y-6">
      <PageHeader title={t('dashboard.title')} description={t('dashboard.description')} />
      <DateRangeFields value={range} onChange={onRangeChange} />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          icon={Crown}
          label={t('dashboard.stats.premiumRevenue')}
          value={totals.premiumRevenue}
          format={formatVnd}
        />
        <StatCard
          icon={Megaphone}
          label={t('dashboard.stats.adRevenue')}
          value={totals.adRevenue}
          format={formatVnd}
        />
        <StatCard icon={UserPlus} label={t('dashboard.stats.newUsers')} value={totals.newUsers} />
        <StatCard
          icon={Store}
          label={t('dashboard.stats.newRestaurants')}
          value={totals.newRestaurants}
        />
      </div>
      <DailyChart
        title={t('dashboard.charts.revenue.title')}
        description={t('dashboard.charts.revenue.description')}
        rows={daily}
        stacked
        series={[
          { key: 'premiumRevenue', label: t('dashboard.series.premium'), color: 'var(--chart-1)' },
          { key: 'adRevenue', label: t('dashboard.series.ads'), color: 'var(--chart-2)' },
        ]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <DailyChart
          title={t('dashboard.charts.newUsers.title')}
          description={t('dashboard.charts.newUsers.description')}
          rows={daily}
          series={[
            { key: 'newUsers', label: t('dashboard.series.newUsers'), color: 'var(--chart-1)' },
          ]}
        />
        <DailyChart
          title={t('dashboard.charts.newRestaurants.title')}
          description={t('dashboard.charts.newRestaurants.description')}
          rows={daily}
          series={[
            {
              key: 'newRestaurants',
              label: t('dashboard.series.newRestaurants'),
              color: 'var(--chart-3)',
            },
          ]}
        />
      </div>
    </div>
  )
}

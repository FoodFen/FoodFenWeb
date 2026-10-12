import type { DashboardDayResponse, DashboardTotalsResponse } from '@/api/generated'
import { formatVnd } from '@/lib/format'
import { Crown, Megaphone, Store, UserPlus } from 'lucide-react'
import { DailyChart } from '@/components/daily-chart'
import { DateRangeFields, type DateRange } from './date-range-fields'
import { PageHeader } from './page-header'
import { StatCard } from './stat-card'

type Props = {
  totals: DashboardTotalsResponse
  daily: DashboardDayResponse[]
  range: DateRange
  onRangeChange: (range: DateRange) => void
}

export function DashboardView({ totals, daily, range, onRangeChange }: Props) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dòng tiền và tăng trưởng"
        description="Doanh thu và lượng người dùng, quán mới theo ngày (giờ Việt Nam)."
      />
      <DateRangeFields value={range} onChange={onRangeChange} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Crown}
          label="Doanh thu Premium"
          value={totals.premiumRevenue}
          format={formatVnd}
        />
        <StatCard
          icon={Megaphone}
          label="Doanh thu quảng cáo"
          value={totals.adRevenue}
          format={formatVnd}
        />
        <StatCard icon={UserPlus} label="Người dùng mới" value={totals.newUsers} />
        <StatCard icon={Store} label="Quán mới" value={totals.newRestaurants} />
      </div>
      <DailyChart
        title="Doanh thu theo ngày"
        description="Premium và quảng cáo, đơn vị đồng"
        rows={daily}
        stacked
        series={[
          { key: 'premiumRevenue', label: 'Premium', color: 'var(--chart-1)' },
          { key: 'adRevenue', label: 'Quảng cáo', color: 'var(--chart-2)' },
        ]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <DailyChart
          title="Người dùng mới theo ngày"
          description="Tài khoản đăng ký mới"
          rows={daily}
          series={[{ key: 'newUsers', label: 'Người dùng mới', color: 'var(--chart-1)' }]}
        />
        <DailyChart
          title="Quán mới theo ngày"
          description="Quán đăng ký mới"
          rows={daily}
          series={[{ key: 'newRestaurants', label: 'Quán mới', color: 'var(--chart-3)' }]}
        />
      </div>
    </div>
  )
}

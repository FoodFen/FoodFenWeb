import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { kpis } from './mock-overview'
import { PageHeader } from './page-header'
import { RecentActivity } from './recent-activity'
import { SignupsChart } from './signups-chart'
import { StatCard } from './stat-card'

export function OverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tổng quan"
        description="Hoạt động của FoodFen trong ngày hôm nay."
        actions={
          <Button variant="outline" className="h-11 px-4">
            <Download aria-hidden />
            Xuất báo cáo
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <StatCard key={kpi.label} {...kpi} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <SignupsChart />
        <RecentActivity />
      </div>
    </div>
  )
}

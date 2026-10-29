import { parseApiError } from '@/api/errors'
import { PageHeader } from '@/components/page-header'
import { QueryError } from '@/components/query-error'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslation } from 'react-i18next'
import { ImpressionsChart } from './impressions-chart'
import { MenuSummary } from './menu-summary'
import { NoRestaurant } from './no-restaurant'
import { OverviewCards } from './overview-cards'
import { PaymentsCard } from './payments-card'
import { adSpend, summarizeMenu } from './stats'
import { useStatsAds, useStatsDishes, useStatsPayments, useStatsRestaurant } from './use-stats'

export function StatsPage() {
  const { t } = useTranslation('restaurant')
  const restaurant = useStatsRestaurant()
  const dishes = useStatsDishes()
  const ads = useStatsAds()
  const payments = useStatsPayments()

  const failure = restaurant.error ?? dishes.error ?? ads.error ?? payments.error
  if (failure) {
    if (parseApiError(failure).status === 404) return <NoRestaurant />
    return (
      <QueryError
        error={failure}
        onRetry={() =>
          void Promise.all([
            restaurant.refetch(),
            dishes.refetch(),
            ads.refetch(),
            payments.refetch(),
          ])
        }
      />
    )
  }
  if (!restaurant.data || !dishes.data || !ads.data || !payments.data) {
    return <Skeleton className="h-96 w-full rounded-2xl" aria-busy />
  }

  const rows = payments.data.pages.flatMap((page) => page.payments)
  const menu = summarizeMenu(dishes.data)
  return (
    <div className="space-y-6">
      <PageHeader title={t('stats.title')} description={t('stats.description')} />
      <OverviewCards
        restaurant={restaurant.data}
        ads={ads.data}
        menu={menu}
        spend={adSpend(rows)}
        loadedPayments={rows.length}
        partialSpend={payments.hasNextPage}
      />
      <ImpressionsChart impressions={ads.data.impressions} />
      <MenuSummary menu={menu} />
      <PaymentsCard
        payments={rows}
        hasMore={payments.hasNextPage}
        loadingMore={payments.isFetchingNextPage}
        onLoadMore={() => void payments.fetchNextPage()}
      />
    </div>
  )
}

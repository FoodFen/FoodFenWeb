import { parseApiError } from '@/api/errors'
import { getMyRestaurantRestaurantsMineGetOptions } from '@/api/generated/@tanstack/react-query.gen'
import { DailyChart } from '@/components/daily-chart'
import { PageHeader } from '@/components/page-header'
import { EmptyState } from '@/components/empty-state'
import { QueryError } from '@/components/query-error'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatNumber } from '@/lib/format'
import { Store } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { AdsExplainer } from './ads-explainer'
import { AdsStatus } from './ads-status'
import { OrderBanner } from './order-banner'
import { PackagePicker } from './package-picker'
import { useMyAds } from './use-ads'

export function AdsPage() {
  const { t } = useTranslation('ads')
  const restaurant = useQuery(getMyRestaurantRestaurantsMineGetOptions())
  const ads = useMyAds()

  if (restaurant.isPending || ads.isPending) {
    return <Skeleton className="h-96 w-full rounded-2xl" aria-busy />
  }

  const failure = restaurant.error ?? ads.error
  if (failure || !restaurant.data || !ads.data) {
    if (parseApiError(failure).status === 404) return <NoRestaurant />
    return (
      <QueryError
        error={failure}
        onRetry={() => void Promise.all([restaurant.refetch(), ads.refetch()])}
      />
    )
  }

  const { featuredUntil, packages, impressions } = ads.data
  const total = impressions.reduce((sum, day) => sum + day.count, 0)
  const approved = restaurant.data.status === 'approved'
  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />
      <OrderBanner />
      <AdsExplainer />
      <AdsStatus featuredUntil={featuredUntil} approved={approved} />
      <PackagePicker packages={packages} approved={approved} />
      <DailyChart
        title={t('impressions.title')}
        description={t('impressions.description', { count: total, total: formatNumber(total) })}
        rows={impressions}
        series={[{ key: 'count', label: t('impressions.title'), color: 'var(--chart-1)' }]}
      />
    </div>
  )
}

function NoRestaurant() {
  const { t } = useTranslation('ads')
  return (
    <EmptyState icon={Store} title={t('noRestaurant.message')}>
      <Link to="/restaurant" className={buttonVariants({ className: 'mt-2 h-11 px-4' })}>
        {t('noRestaurant.link')}
      </Link>
    </EmptyState>
  )
}

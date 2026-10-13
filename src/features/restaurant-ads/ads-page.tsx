import { parseApiError } from '@/api/errors'
import { getMyRestaurantRestaurantsMineGetOptions } from '@/api/generated/@tanstack/react-query.gen'
import { DailyChart } from '@/components/daily-chart'
import { QueryError } from '@/components/query-error'
import { Skeleton } from '@/components/ui/skeleton'
import { formatNumber } from '@/lib/format'
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
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </header>
      <OrderBanner />
      <AdsExplainer />
      <AdsStatus featuredUntil={featuredUntil} />
      <PackagePicker packages={packages} approved={restaurant.data.status === 'approved'} />
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
    <div className="space-y-3">
      <p>{t('noRestaurant.message')}</p>
      <Link to="/restaurant" className="text-primary font-medium underline underline-offset-4">
        {t('noRestaurant.link')}
      </Link>
    </div>
  )
}

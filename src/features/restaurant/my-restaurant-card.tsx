import { parseApiError } from '@/api/errors'
import { QueryError } from '@/components/query-error'
import { StatusBadge } from '@/components/status-badge'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSessionStore } from '@/lib/session-store'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Store } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useMyRestaurant } from './use-restaurant'

/** The "my restaurant" section of the account page. Admins manage restaurants from /admin instead. */
export function MyRestaurantCard() {
  const isAdmin = useSessionStore((s) => s.user?.role === 'admin')
  return isAdmin ? null : <MyRestaurantSection />
}

function MyRestaurantSection() {
  const { t } = useTranslation('restaurant')
  const restaurant = useMyRestaurant()
  const none = restaurant.isError && parseApiError(restaurant.error).status === 404

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{t('myRestaurant.title')}</h2>
      {restaurant.isPending ? (
        <Skeleton className="h-28 w-full rounded-2xl" aria-busy />
      ) : restaurant.data ? (
        <div className="bg-card flex flex-wrap items-center gap-3 rounded-2xl border p-6">
          <Store className="text-primary size-5" aria-hidden />
          <p className="font-medium">{restaurant.data.name}</p>
          <StatusBadge status={restaurant.data.status} />
          <Link
            to="/restaurant"
            className={buttonVariants({ variant: 'outline', className: 'ml-auto h-11 px-4' })}
          >
            {t('myRestaurant.manage')}
          </Link>
        </div>
      ) : none ? (
        <div className="bg-card space-y-4 rounded-2xl border p-6">
          <p className="text-muted-foreground">{t('myRestaurant.pitch')}</p>
          <Link to="/restaurant" className={buttonVariants({ className: 'h-11 px-4' })}>
            {t('myRestaurant.open')}
            <ArrowRight aria-hidden />
          </Link>
        </div>
      ) : (
        <QueryError error={restaurant.error} onRetry={() => void restaurant.refetch()} />
      )}
    </section>
  )
}

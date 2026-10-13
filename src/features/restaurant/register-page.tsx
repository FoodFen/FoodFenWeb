import { parseApiError } from '@/api/errors'
import { QueryError } from '@/components/query-error'
import { buttonVariants } from '@/components/ui/button'
import { Link, Navigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageSkeleton } from './page-skeleton'
import { RestaurantForm } from './restaurant-form'
import { emptyRestaurant } from './restaurant-schema'
import { useCreateRestaurant, useMyRestaurant, useUploadImage } from './use-restaurant'

export function RegisterPage() {
  const { t } = useTranslation('restaurant')
  const restaurant = useMyRestaurant()
  const create = useCreateRestaurant()
  const upload = useUploadImage()

  if (restaurant.isPending) return <PageSkeleton />

  // Also the success path: creating the restaurant fills the query cache, which lands here.
  if (restaurant.data) return <Navigate to="/restaurant" replace />

  if (parseApiError(restaurant.error).status !== 404) {
    return <QueryError error={restaurant.error} onRetry={() => void restaurant.refetch()} />
  }

  return (
    <div className="space-y-4">
      <Link
        to="/restaurant"
        className={buttonVariants({ variant: 'ghost', className: 'h-11 px-3' })}
      >
        <ArrowLeft aria-hidden />
        {t('register.back')}
      </Link>
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{t('register.title')}</h1>
        <p className="text-muted-foreground">{t('register.hint')}</p>
      </header>
      <RestaurantForm
        defaultValues={emptyRestaurant}
        submitLabel={t('register.submit')}
        upload={upload}
        onSubmit={async (values) => void (await create(values))}
      />
    </div>
  )
}

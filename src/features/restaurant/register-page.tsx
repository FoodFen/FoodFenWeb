import { parseApiError } from '@/api/errors'
import { BackLink } from '@/components/back-link'
import { PageHeader } from '@/components/page-header'
import { QueryError } from '@/components/query-error'
import { Navigate } from '@tanstack/react-router'
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
    <div className="max-w-3xl space-y-6">
      <div className="space-y-2">
        <BackLink to="/restaurant">{t('register.back')}</BackLink>
        <PageHeader title={t('register.title')} description={t('register.hint')} />
      </div>
      <RestaurantForm
        defaultValues={emptyRestaurant}
        submitLabel={t('register.submit')}
        upload={upload}
        onSubmit={async (values) => void (await create(values))}
      />
    </div>
  )
}

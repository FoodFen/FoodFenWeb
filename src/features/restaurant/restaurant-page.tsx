import { parseApiError } from '@/api/errors'
import { QueryError } from '@/components/query-error'
import { MenuSection } from './menu-section'
import { OnboardingIntro } from './onboarding-intro'
import { PageSkeleton } from './page-skeleton'
import { RestaurantProfile } from './restaurant-profile'
import { useMyRestaurant, useUploadImage } from './use-restaurant'

export function RestaurantPage() {
  const restaurant = useMyRestaurant()
  const upload = useUploadImage()

  if (restaurant.isPending) return <PageSkeleton />

  if (restaurant.data) {
    return (
      <div className="space-y-8">
        <RestaurantProfile restaurant={restaurant.data} upload={upload} />
        <MenuSection upload={upload} />
      </div>
    )
  }

  if (parseApiError(restaurant.error).status === 404) return <OnboardingIntro />

  return <QueryError error={restaurant.error} onRetry={() => void restaurant.refetch()} />
}

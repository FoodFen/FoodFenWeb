import { parseApiError } from '@/api/errors'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { MenuSection } from './menu-section'
import { RestaurantForm } from './restaurant-form'
import { emptyRestaurant } from './restaurant-schema'
import { RestaurantProfile } from './restaurant-profile'
import { useCreateRestaurant, useMyRestaurant, useUploadImage } from './use-restaurant'

export function RestaurantPage() {
  const restaurant = useMyRestaurant()
  const create = useCreateRestaurant()
  const upload = useUploadImage()

  if (restaurant.isPending) {
    return (
      <div className="space-y-4" aria-busy>
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    )
  }

  if (restaurant.data) {
    return (
      <div className="space-y-8">
        <RestaurantProfile restaurant={restaurant.data} upload={upload} />
        <MenuSection upload={upload} />
      </div>
    )
  }

  if (parseApiError(restaurant.error).status === 404) {
    return (
      <div className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Đăng ký quán của bạn</h1>
          <p className="text-muted-foreground">
            Miễn phí. Quán được hiển thị sau khi FoodFen duyệt hồ sơ và thực đơn.
          </p>
        </header>
        <RestaurantForm
          defaultValues={emptyRestaurant}
          submitLabel="Gửi duyệt"
          upload={upload}
          onSubmit={async (values) => void (await create(values))}
        />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p role="alert">{parseApiError(restaurant.error).message}</p>
      <Button variant="outline" className="h-11 px-4" onClick={() => void restaurant.refetch()}>
        Thử lại
      </Button>
    </div>
  )
}

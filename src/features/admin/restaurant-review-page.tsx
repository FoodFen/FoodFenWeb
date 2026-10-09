import { parseApiError } from '@/api/errors'
import { FormError } from '@/components/form-parts'
import { Button, buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Link, getRouteApi } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { RestaurantReview } from './restaurant-review'
import { useAdminRestaurant, useReviewActions } from './use-moderation'

const route = getRouteApi('/admin/restaurants/$restaurantId')

export function RestaurantReviewPage() {
  const { restaurantId } = route.useParams()
  const detail = useAdminRestaurant(restaurantId)
  const { busy, error, reviewRestaurant, reviewDish } = useReviewActions(restaurantId)

  return (
    <div className="space-y-6">
      <Link
        to="/admin/restaurants"
        className={buttonVariants({ variant: 'ghost', className: 'h-11 px-3' })}
      >
        <ArrowLeft aria-hidden />
        Danh sách duyệt
      </Link>
      {detail.isPending ? (
        <Skeleton className="h-64 w-full rounded-2xl" aria-busy />
      ) : detail.isError ? (
        <div className="space-y-3">
          <p role="alert">{parseApiError(detail.error).message}</p>
          <Button variant="outline" className="h-11 px-4" onClick={() => void detail.refetch()}>
            Thử lại
          </Button>
        </div>
      ) : (
        <>
          <FormError message={error ? parseApiError(error).message : null} />
          <RestaurantReview
            restaurant={detail.data.restaurant}
            dishes={detail.data.dishes}
            busy={busy}
            onApproveRestaurant={() =>
              void reviewRestaurant({ decision: 'approved' }).catch(() => {})
            }
            onRejectRestaurant={async (reason) => {
              await reviewRestaurant({ decision: 'rejected', reason })
            }}
            onApproveDish={(dish) =>
              void reviewDish(dish.id, { decision: 'approved' }).catch(() => {})
            }
            onRejectDish={async (dish, reason) => {
              await reviewDish(dish.id, { decision: 'rejected', reason })
            }}
          />
        </>
      )}
    </div>
  )
}

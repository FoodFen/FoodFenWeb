import type { ModerationStatus, ReviewRequest } from '@/api/generated'
import {
  getRestaurantAdminRestaurantsRestaurantIdGetOptions,
  getRestaurantAdminRestaurantsRestaurantIdGetQueryKey,
  listRestaurantsAdminRestaurantsGetOptions,
  reviewDishAdminDishesDishIdReviewPostMutation,
  reviewRestaurantAdminRestaurantsRestaurantIdReviewPostMutation,
} from '@/api/generated/@tanstack/react-query.gen'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export type QueueFilter = 'needsReview' | Extract<ModerationStatus, 'approved' | 'rejected'>

export const useReviewQueue = (filter: QueueFilter) =>
  useQuery(
    listRestaurantsAdminRestaurantsGetOptions({
      query: filter === 'needsReview' ? { needsReview: true } : { status: filter },
    }),
  )

export const useAdminRestaurant = (restaurantId: string) =>
  useQuery(
    getRestaurantAdminRestaurantsRestaurantIdGetOptions({ path: { restaurant_id: restaurantId } }),
  )

/** Reviews of one restaurant page: refreshes that page and every queue list afterwards. */
export function useReviewActions(restaurantId: string) {
  const queryClient = useQueryClient()
  const refresh = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: [{ _id: 'listRestaurantsAdminRestaurantsGet' }] }),
      queryClient.invalidateQueries({
        queryKey: getRestaurantAdminRestaurantsRestaurantIdGetQueryKey({
          path: { restaurant_id: restaurantId },
        }),
      }),
    ])
  const restaurant = useMutation({
    ...reviewRestaurantAdminRestaurantsRestaurantIdReviewPostMutation(),
    onSuccess: refresh,
  })
  const dish = useMutation({
    ...reviewDishAdminDishesDishIdReviewPostMutation(),
    onSuccess: refresh,
  })

  return {
    busy: restaurant.isPending || dish.isPending,
    error: restaurant.error ?? dish.error,
    reviewRestaurant: (body: ReviewRequest) =>
      restaurant.mutateAsync({ path: { restaurant_id: restaurantId }, body }),
    reviewDish: (dishId: string, body: ReviewRequest) =>
      dish.mutateAsync({ path: { dish_id: dishId }, body }),
  }
}

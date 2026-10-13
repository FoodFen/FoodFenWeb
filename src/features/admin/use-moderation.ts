import type { ReviewRequest } from '@/api/generated'
import {
  getRestaurantAdminRestaurantsRestaurantIdGetOptions,
  getRestaurantAdminRestaurantsRestaurantIdGetQueryKey,
  listRestaurantsAdminRestaurantsGetOptions,
  reviewDishAdminDishesDishIdReviewPostMutation,
  reviewRestaurantAdminRestaurantsRestaurantIdReviewPostMutation,
} from '@/api/generated/@tanstack/react-query.gen'
import type { RestaurantTab } from './restaurant-tabs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const tabQueries = {
  all: undefined,
  pending: { needsReview: true },
  approved: { status: 'approved' },
  rejected: { status: 'rejected' },
} as const

export const useRestaurantList = (tab: RestaurantTab) =>
  useQuery(listRestaurantsAdminRestaurantsGetOptions({ query: tabQueries[tab] }))

export const useAdminRestaurant = (restaurantId: string) =>
  useQuery(
    getRestaurantAdminRestaurantsRestaurantIdGetOptions({ path: { restaurant_id: restaurantId } }),
  )

/** Reviews of one restaurant page: refreshes that page and every restaurant list afterwards. */
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
    onSettled: refresh,
  })
  const dish = useMutation({
    ...reviewDishAdminDishesDishIdReviewPostMutation(),
    onSettled: refresh,
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

import { reviewDishAdminDishesDishIdReviewPost } from '@/api/generated'
import type { DishResponse, RestaurantResponse, ReviewRequest } from '@/api/generated'
import {
  getRestaurantAdminRestaurantsRestaurantIdGetOptions,
  getRestaurantAdminRestaurantsRestaurantIdGetQueryKey,
  listRestaurantsAdminRestaurantsGetOptions,
  reviewDishAdminDishesDishIdReviewPostMutation,
  reviewRestaurantAdminRestaurantsRestaurantIdReviewPostMutation,
} from '@/api/generated/@tanstack/react-query.gen'
import type { RestaurantTab } from './restaurant-tabs'
import i18n from '@/i18n'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

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

/** Rejecting an approved item is a take-down; the toast says which one happened. */
function reviewMessage(kind: 'restaurant' | 'dish', current: string, body: ReviewRequest) {
  const outcome =
    body.decision === 'approved' ? 'Approved' : current === 'approved' ? 'TakenDown' : 'Rejected'
  return i18n.t(`admin:toast.${kind}${outcome}`)
}

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
    meta: { errorToast: false },
  })
  const dish = useMutation({
    ...reviewDishAdminDishesDishIdReviewPostMutation(),
    onSettled: refresh,
    meta: { errorToast: false },
  })
  // One request per dish (the BE has no bulk endpoint); stops at the first failure.
  const dishes = useMutation({
    mutationFn: async (list: DishResponse[]) => {
      for (const d of list) {
        await reviewDishAdminDishesDishIdReviewPost({
          path: { dish_id: d.id },
          body: { decision: 'approved', expectedUpdatedAt: d.updatedAt },
          throwOnError: true,
        })
      }
    },
    onSettled: refresh,
    meta: { errorToast: false },
  })

  // A failed reject is shown by RejectDialog itself, so the page-level error skips it.
  const pageError = (m: typeof restaurant | typeof dish) =>
    m.variables?.body.decision === 'rejected' ? null : m.error

  return {
    busy: restaurant.isPending || dish.isPending || dishes.isPending,
    error: pageError(restaurant) ?? pageError(dish) ?? dishes.error,
    approveDishes: async (list: DishResponse[]) => {
      await dishes.mutateAsync(list)
      toast.success(i18n.t('admin:toast.dishesApproved', { count: list.length }))
    },
    reviewRestaurant: async (current: RestaurantResponse, body: ReviewRequest) => {
      await restaurant.mutateAsync({ path: { restaurant_id: restaurantId }, body })
      toast.success(reviewMessage('restaurant', current.status, body))
    },
    reviewDish: async (current: DishResponse, body: ReviewRequest) => {
      await dish.mutateAsync({ path: { dish_id: current.id }, body })
      toast.success(reviewMessage('dish', current.status, body))
    },
  }
}

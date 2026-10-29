import {
  getMyAdsRestaurantsMineAdsGetOptions,
  getMyRestaurantRestaurantsMineGetOptions,
  listMyDishesRestaurantsMineDishesGetOptions,
  listMyPaymentsRestaurantsMinePaymentsGetInfiniteOptions,
} from '@/api/generated/@tanstack/react-query.gen'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

const PAGE_LIMIT = 20

/** All four 404 while the user has no restaurant. */
export const useStatsRestaurant = () => useQuery(getMyRestaurantRestaurantsMineGetOptions())
export const useStatsDishes = () => useQuery(listMyDishesRestaurantsMineDishesGetOptions())
export const useStatsAds = () => useQuery(getMyAdsRestaurantsMineAdsGetOptions())

export const useStatsPayments = () =>
  useInfiniteQuery({
    ...listMyPaymentsRestaurantsMinePaymentsGetInfiniteOptions({ query: { limit: PAGE_LIMIT } }),
    initialPageParam: '0',
    getNextPageParam: (last) => last.nextCursor,
  })

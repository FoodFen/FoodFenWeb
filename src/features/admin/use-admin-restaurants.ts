import { listRestaurantsAdminRestaurantsGetInfiniteOptions } from '@/api/generated/@tanstack/react-query.gen'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import type { RestaurantTab } from './restaurant-tabs'

const tabQueries = {
  all: {},
  pending: { needsReview: true },
  approved: { status: 'approved' },
  rejected: { status: 'rejected' },
} as const

export const useAdminRestaurants = (tab: RestaurantTab, q = '') =>
  useInfiniteQuery({
    ...listRestaurantsAdminRestaurantsGetInfiniteOptions({
      query: { ...tabQueries[tab], q: q || undefined },
    }),
    initialPageParam: '0',
    getNextPageParam: (last) => last.nextCursor,
    placeholderData: keepPreviousData,
  })

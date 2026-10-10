import type { SubscriptionTier } from '@/api/generated'
import { listUsersAdminUsersGetInfiniteOptions } from '@/api/generated/@tanstack/react-query.gen'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'

export const useAdminUsers = (q: string, tier: SubscriptionTier | undefined) =>
  useInfiniteQuery({
    ...listUsersAdminUsersGetInfiniteOptions({ query: { q: q || undefined, tier } }),
    initialPageParam: null,
    getNextPageParam: (last) => last.nextCursor,
    placeholderData: keepPreviousData,
  })

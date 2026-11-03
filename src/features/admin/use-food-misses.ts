import type { FoodMissStatus } from '@/api/generated'
import {
  ignoreFoodMissAdminFoodMissesMissIdIgnorePostMutation,
  listFoodMissesAdminFoodMissesGetInfiniteOptions,
  listFoodMissesAdminFoodMissesGetInfiniteQueryKey,
  reopenFoodMissAdminFoodMissesMissIdReopenPostMutation,
} from '@/api/generated/@tanstack/react-query.gen'
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

export const useFoodMisses = (status: FoodMissStatus) =>
  useInfiniteQuery({
    ...listFoodMissesAdminFoodMissesGetInfiniteOptions({ query: { status } }),
    initialPageParam: '0',
    getNextPageParam: (last) => last.nextCursor,
    placeholderData: keepPreviousData,
  })

const useRefresh = () => {
  const queryClient = useQueryClient()
  return () =>
    queryClient.invalidateQueries({
      queryKey: listFoodMissesAdminFoodMissesGetInfiniteQueryKey(),
    })
}

export const useIgnoreMiss = () =>
  useMutation({
    ...ignoreFoodMissAdminFoodMissesMissIdIgnorePostMutation(),
    onSuccess: useRefresh(),
    meta: { success: 'admin:toast.missIgnored' },
  })

export const useReopenMiss = () =>
  useMutation({
    ...reopenFoodMissAdminFoodMissesMissIdReopenPostMutation(),
    onSuccess: useRefresh(),
    meta: { success: 'admin:toast.missReopened' },
  })

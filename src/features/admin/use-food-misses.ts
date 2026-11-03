import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { adminRequest } from './admin-request'
import type { FoodMiss, FoodMissStatus, FoodPage } from './food-types'

export const missesRoot = ['admin', 'food-misses'] as const

export const useFoodMisses = (status: FoodMissStatus) =>
  useInfiniteQuery({
    queryKey: [...missesRoot, status],
    queryFn: ({ pageParam, signal }) =>
      adminRequest<FoodPage<FoodMiss>>('get', '/admin/food-misses', {
        query: { status, cursor: pageParam },
        signal,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    placeholderData: keepPreviousData,
  })

function useMissAction(action: 'ignore' | 'reopen') {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      adminRequest<FoodMiss>('post', `/admin/food-misses/${id}/${action}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: missesRoot }),
    meta: { success: action === 'ignore' ? 'admin:toast.missIgnored' : 'admin:toast.missReopened' },
  })
}

export const useIgnoreMiss = () => useMissAction('ignore')
export const useReopenMiss = () => useMissAction('reopen')

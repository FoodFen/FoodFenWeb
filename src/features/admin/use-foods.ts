import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { adminRequest } from './admin-request'
import { toFoodBody, toFoodPatch, toFoodValues, type FoodValues } from './food-schema'
import type {
  AdminFood,
  AdminFoodDetail,
  FoodBody,
  FoodChange,
  FoodFilters,
  FoodPage,
} from './food-types'
import { missesRoot } from './use-food-misses'

const foodsRoot = ['admin', 'foods'] as const
const detailKey = (slug: string) => [...foodsRoot, 'detail', slug] as const

export const useAdminFoods = (filters: FoodFilters) =>
  useInfiniteQuery({
    queryKey: [...foodsRoot, 'list', filters],
    queryFn: ({ pageParam, signal }) =>
      adminRequest<FoodPage<AdminFood>>('get', '/admin/foods', {
        query: { ...filters, cursor: pageParam },
        signal,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    placeholderData: keepPreviousData,
  })

export const useAdminFood = (slug: string | null) =>
  useQuery({
    queryKey: detailKey(slug ?? ''),
    queryFn: ({ signal }) =>
      adminRequest<AdminFoodDetail>('get', `/admin/foods/${slug}`, { signal }),
    enabled: slug !== null,
  })

/** Changes are fetched only once the history panel is opened. */
export const useFoodChanges = (slug: string, enabled: boolean) =>
  useQuery({
    queryKey: [...foodsRoot, 'changes', slug],
    queryFn: ({ signal }) =>
      adminRequest<{ items: FoodChange[] }>('get', `/admin/foods/${slug}/changes`, { signal }),
    enabled,
  })

/** A food write can resolve a miss, so both lists refresh. */
function useRefreshFoods() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: foodsRoot }),
      queryClient.invalidateQueries({ queryKey: missesRoot }),
    ])
}

/**
 * Creates a food (with `missId` when it came from an AI miss), or with `editing` sends a PATCH of
 * the fields that changed. Resolves without a request when nothing changed.
 */
export function useSaveFood(editing: AdminFoodDetail | null) {
  const onSuccess = useRefreshFoods()
  const create = useMutation({
    mutationFn: (body: FoodBody & { missId?: string }) =>
      adminRequest<AdminFoodDetail>('post', '/admin/foods', { body }),
    onSuccess,
    meta: { success: 'admin:toast.foodCreated', errorToast: false },
  })
  const update = useMutation({
    mutationFn: (patch: Partial<FoodBody>) =>
      adminRequest<AdminFoodDetail>('patch', `/admin/foods/${editing?.slug}`, { body: patch }),
    onSuccess,
    meta: { success: 'admin:toast.foodUpdated', errorToast: false },
  })

  return async (values: FoodValues, missId?: string) => {
    if (!editing) return create.mutateAsync({ ...toFoodBody(values), missId })
    const patch = toFoodPatch(values, toFoodValues(editing))
    if (Object.keys(patch).length > 0) await update.mutateAsync(patch)
  }
}

function useArchiveAction(action: 'archive' | 'unarchive') {
  const queryClient = useQueryClient()
  const refresh = useRefreshFoods()
  return useMutation({
    mutationFn: (slug: string) =>
      adminRequest<AdminFoodDetail>('post', `/admin/foods/${slug}/${action}`),
    onSuccess: (food) => {
      queryClient.setQueryData(detailKey(food.slug), food)
      return refresh()
    },
    meta: {
      success: action === 'archive' ? 'admin:toast.foodArchived' : 'admin:toast.foodUnarchived',
    },
  })
}

export const useArchiveFood = () => useArchiveAction('archive')
export const useUnarchiveFood = () => useArchiveAction('unarchive')

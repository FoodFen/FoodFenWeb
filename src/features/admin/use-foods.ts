import type { AdminFoodResponse, ListFoodsAdminFoodsGetData } from '@/api/generated'
import {
  archiveFoodAdminFoodsSlugArchivePostMutation,
  createFoodAdminFoodsPostMutation,
  getFoodAdminFoodsSlugGetOptions,
  getFoodAdminFoodsSlugGetQueryKey,
  listFoodChangesAdminFoodsSlugChangesGetOptions,
  listFoodChangesAdminFoodsSlugChangesGetQueryKey,
  listFoodMissesAdminFoodMissesGetInfiniteQueryKey,
  listFoodsAdminFoodsGetInfiniteOptions,
  listFoodsAdminFoodsGetInfiniteQueryKey,
  unarchiveFoodAdminFoodsSlugUnarchivePostMutation,
  updateFoodAdminFoodsSlugPatchMutation,
} from '@/api/generated/@tanstack/react-query.gen'
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { toFoodBody, toFoodPatch, toFoodValues, type FoodValues } from './food-schema'

type FoodFilters = Pick<
  NonNullable<ListFoodsAdminFoodsGetData['query']>,
  'q' | 'category' | 'verified' | 'archived'
>

export const useAdminFoods = (filters: FoodFilters) =>
  useInfiniteQuery({
    ...listFoodsAdminFoodsGetInfiniteOptions({ query: filters }),
    initialPageParam: '0',
    getNextPageParam: (last) => last.nextCursor,
    placeholderData: keepPreviousData,
  })

export const useAdminFood = (slug: string | null) =>
  useQuery({
    ...getFoodAdminFoodsSlugGetOptions({ path: { slug: slug ?? '' } }),
    enabled: slug !== null,
  })

/** Changes are fetched only once the history panel is opened. */
export const useFoodChanges = (slug: string, enabled: boolean) =>
  useQuery({
    ...listFoodChangesAdminFoodsSlugChangesGetOptions({ path: { slug } }),
    enabled,
  })

/** A food write can resolve a miss, so the misses list refreshes too. */
function useRefreshFoods() {
  const queryClient = useQueryClient()
  return ({ slug }: AdminFoodResponse) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: listFoodsAdminFoodsGetInfiniteQueryKey() }),
      queryClient.invalidateQueries({
        queryKey: getFoodAdminFoodsSlugGetQueryKey({ path: { slug } }),
      }),
      queryClient.invalidateQueries({
        queryKey: listFoodChangesAdminFoodsSlugChangesGetQueryKey({ path: { slug } }),
      }),
      queryClient.invalidateQueries({
        queryKey: listFoodMissesAdminFoodMissesGetInfiniteQueryKey(),
      }),
    ])
}

/**
 * Creates a food (with `missId` when it came from an AI miss), or with `editing` sends a PATCH of
 * the fields that changed. Resolves without a request when nothing changed.
 */
export function useSaveFood(editing: AdminFoodResponse | null) {
  const onSuccess = useRefreshFoods()
  const create = useMutation({
    ...createFoodAdminFoodsPostMutation(),
    onSuccess,
    meta: { success: 'admin:toast.foodCreated', errorToast: false },
  })
  const update = useMutation({
    ...updateFoodAdminFoodsSlugPatchMutation(),
    onSuccess,
    meta: { success: 'admin:toast.foodUpdated', errorToast: false },
  })

  return async (values: FoodValues, missId?: string) => {
    if (!editing) return create.mutateAsync({ body: { ...toFoodBody(values), missId } })
    const body = toFoodPatch(values, toFoodValues(editing))
    if (Object.keys(body).length > 0) {
      await update.mutateAsync({ path: { slug: editing.slug }, body })
    }
  }
}

/**
 * Archive and unarchive do not wait for the refetch: their confirm closes when the request settles, and a
 * refetch in between would flip `archived` under a dialog that is still open.
 */
function useRefreshInBackground() {
  const refresh = useRefreshFoods()
  return (food: AdminFoodResponse) => void refresh(food)
}

export const useArchiveFood = () =>
  useMutation({
    ...archiveFoodAdminFoodsSlugArchivePostMutation(),
    onSuccess: useRefreshInBackground(),
    meta: { success: 'admin:toast.foodArchived' },
  })

export const useUnarchiveFood = () =>
  useMutation({
    ...unarchiveFoodAdminFoodsSlugUnarchivePostMutation(),
    onSuccess: useRefreshInBackground(),
    meta: { success: 'admin:toast.foodUnarchived' },
  })

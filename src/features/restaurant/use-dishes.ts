import type { DishResponse } from '@/api/generated'
import {
  createDishRestaurantsMineDishesPostMutation,
  deleteDishRestaurantsMineDishesDishIdDeleteMutation,
  listMyDishesRestaurantsMineDishesGetOptions,
  listMyDishesRestaurantsMineDishesGetQueryKey,
  updateDishRestaurantsMineDishesDishIdPatchMutation,
} from '@/api/generated/@tanstack/react-query.gen'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toDishBody, toDishPatch, type DishValues } from './dish-schema'

export const useMyDishes = () => useQuery(listMyDishesRestaurantsMineDishesGetOptions())

function useDishCache() {
  const queryClient = useQueryClient()
  const key = listMyDishesRestaurantsMineDishesGetQueryKey()
  return (change: (dishes: DishResponse[]) => DishResponse[]) =>
    queryClient.setQueryData<DishResponse[]>(key, (dishes) => change(dishes ?? []))
}

export function useCreateDish() {
  const change = useDishCache()
  const { mutateAsync } = useMutation({
    ...createDishRestaurantsMineDishesPostMutation(),
    onSuccess: (dish) => change((dishes) => [...dishes, dish]),
  })
  return (values: DishValues) => mutateAsync({ body: toDishBody(values) })
}

export function useUpdateDish() {
  const change = useDishCache()
  const { mutateAsync } = useMutation({
    ...updateDishRestaurantsMineDishesDishIdPatchMutation(),
    onSuccess: (dish) => change((dishes) => dishes.map((d) => (d.id === dish.id ? dish : d))),
  })
  return (dishId: string, values: DishValues, dirty: Partial<Record<keyof DishValues, unknown>>) =>
    mutateAsync({ path: { dish_id: dishId }, body: toDishPatch(values, dirty) })
}

export function useDeleteDish() {
  const change = useDishCache()
  const mutation = useMutation(deleteDishRestaurantsMineDishesDishIdDeleteMutation())
  return {
    isPending: mutation.isPending,
    remove: (dishId: string) =>
      mutation
        .mutateAsync({ path: { dish_id: dishId } })
        .then(() => change((dishes) => dishes.filter((d) => d.id !== dishId))),
  }
}

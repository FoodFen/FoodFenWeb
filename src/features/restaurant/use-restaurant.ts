import {
  createRestaurantRestaurantsPostMutation,
  getMyRestaurantRestaurantsMineGetOptions,
  getMyRestaurantRestaurantsMineGetQueryKey,
  updateMyRestaurantRestaurantsMinePatchMutation,
  uploadImageRestaurantsMineImagesPostMutation,
} from '@/api/generated/@tanstack/react-query.gen'
import type { RestaurantResponse } from '@/api/generated'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toRestaurantBody, toRestaurantPatch, type RestaurantValues } from './restaurant-schema'

/** 404 means the user has not created a restaurant yet; the page shows the create form. */
export const useMyRestaurant = () => useQuery(getMyRestaurantRestaurantsMineGetOptions())

function useSaveToCache() {
  const queryClient = useQueryClient()
  return (restaurant: RestaurantResponse) =>
    queryClient.setQueryData(getMyRestaurantRestaurantsMineGetQueryKey(), restaurant)
}

export function useCreateRestaurant() {
  const save = useSaveToCache()
  const { mutateAsync } = useMutation({
    ...createRestaurantRestaurantsPostMutation(),
    meta: { success: 'restaurant:toast.restaurantCreated', errorToast: false },
    onSuccess: save,
  })
  return (values: RestaurantValues) => mutateAsync({ body: toRestaurantBody(values) })
}

export function useUpdateRestaurant() {
  const save = useSaveToCache()
  const { mutateAsync } = useMutation({
    ...updateMyRestaurantRestaurantsMinePatchMutation(),
    meta: { success: 'restaurant:toast.restaurantUpdated', errorToast: false },
    onSuccess: save,
  })
  return (values: RestaurantValues) => mutateAsync({ body: toRestaurantPatch(values) })
}

/** Uploads one image and resolves to its hosted URL. */
export function useUploadImage() {
  const { mutateAsync } = useMutation({
    ...uploadImageRestaurantsMineImagesPostMutation(),
    meta: { success: 'restaurant:toast.imageUploaded', errorToast: false },
  })
  return async (image: File) => (await mutateAsync({ body: { image } })).url
}

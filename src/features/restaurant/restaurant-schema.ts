import type { RestaurantResponse } from '@/api/generated'
import { parseCoordinates } from '@/lib/coordinates'
import { z } from 'zod'

export const restaurantSchema = z.object({
  name: z.string().trim().min(1, 'Nhập tên quán').max(255, 'Tên tối đa 255 ký tự'),
  description: z.string().trim().max(2000, 'Mô tả tối đa 2.000 ký tự'),
  address: z.string().trim().min(1, 'Nhập địa chỉ').max(500, 'Địa chỉ tối đa 500 ký tự'),
  phone: z.string().trim().min(1, 'Nhập số điện thoại').max(32, 'Số điện thoại tối đa 32 ký tự'),
  openingHours: z.string().trim().min(1, 'Nhập giờ mở cửa').max(255, 'Giờ mở cửa tối đa 255 ký tự'),
  location: z
    .string()
    .refine((text) => parseCoordinates(text) !== null, 'Dán toạ độ dạng "10.7769, 106.7009"'),
  imageUrl: z.string(),
})

export type RestaurantValues = z.infer<typeof restaurantSchema>

export const emptyRestaurant: RestaurantValues = {
  name: '',
  description: '',
  address: '',
  phone: '',
  openingHours: '',
  location: '',
  imageUrl: '',
}

export function toRestaurantValues(restaurant: RestaurantResponse): RestaurantValues {
  return {
    name: restaurant.name,
    description: restaurant.description ?? '',
    address: restaurant.address,
    phone: restaurant.phone,
    openingHours: restaurant.openingHours,
    location: `${restaurant.latitude}, ${restaurant.longitude}`,
    imageUrl: restaurant.imageUrl ?? '',
  }
}

/** Request body for create and update; `null` clears an optional field on PATCH. */
export function toRestaurantBody(values: RestaurantValues) {
  const { location, description, imageUrl, ...rest } = values
  return {
    ...rest,
    description: description || null,
    imageUrl: imageUrl || null,
    ...parseCoordinates(location)!,
  }
}

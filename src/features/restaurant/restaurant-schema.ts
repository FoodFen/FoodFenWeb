import type { RestaurantResponse } from '@/api/generated'
import { parseCoordinates } from '@/lib/coordinates'
import { isValidPhone, toStoredPhone } from '@/lib/phone'
import { z } from 'zod'

export const restaurantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'restaurant:validation.restaurantNameRequired')
    .max(255, 'restaurant:validation.nameMax'),
  description: z.string().trim().max(2000, 'restaurant:validation.descriptionMax'),
  address: z
    .string()
    .trim()
    .min(1, 'restaurant:validation.addressRequired')
    .max(500, 'restaurant:validation.addressMax'),
  phone: z
    .string()
    .trim()
    .min(1, 'restaurant:validation.phoneRequired')
    .refine(isValidPhone, 'restaurant:validation.phoneInvalid'),
  openingHours: z
    .string()
    .trim()
    .min(1, 'restaurant:validation.hoursRequired')
    .max(255, 'restaurant:validation.hoursMax'),
  location: z
    .string()
    .refine((text) => parseCoordinates(text) !== null, 'restaurant:validation.locationInvalid'),
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
  const { location, description, imageUrl, phone, ...rest } = values
  return {
    ...rest,
    phone: toStoredPhone(phone),
    description: description || null,
    imageUrl: imageUrl || null,
    ...parseCoordinates(location)!,
  }
}

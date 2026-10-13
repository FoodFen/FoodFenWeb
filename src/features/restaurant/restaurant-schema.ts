import type { RestaurantResponse } from '@/api/generated'
import { parseCoordinates } from '@/lib/coordinates'
import { formatHours, parseHours } from '@/lib/opening-hours'
import { isValidPhone, toStoredPhone } from '@/lib/phone'
import { z } from 'zod'
import { hoursSchema } from './hours-schema'

export const restaurantSchema = z
  .object({
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
    hours: hoursSchema,
    /** Saved text the shift picker cannot read; kept untouched unless the owner picks shifts. */
    legacyHours: z.string(),
    location: z
      .string()
      .refine((text) => parseCoordinates(text) !== null, 'restaurant:validation.locationInvalid'),
    imageUrl: z.string(),
  })
  .refine((values) => values.hours.length > 0 || values.legacyHours !== '', {
    path: ['hours'],
    message: 'restaurant:validation.hoursRequired',
  })

export type RestaurantValues = z.infer<typeof restaurantSchema>

export const emptyRestaurant: RestaurantValues = {
  name: '',
  description: '',
  address: '',
  phone: '',
  hours: [{ open: '', close: '' }],
  legacyHours: '',
  location: '',
  imageUrl: '',
}

export function toRestaurantValues(restaurant: RestaurantResponse): RestaurantValues {
  const hours = parseHours(restaurant.openingHours)
  return {
    name: restaurant.name,
    description: restaurant.description ?? '',
    address: restaurant.address,
    phone: restaurant.phone,
    hours: hours ?? [],
    legacyHours: hours ? '' : restaurant.openingHours,
    location: `${restaurant.latitude}, ${restaurant.longitude}`,
    imageUrl: restaurant.imageUrl ?? '',
  }
}

/** Request body for create and update; `null` clears an optional field on PATCH. */
export function toRestaurantBody(values: RestaurantValues) {
  return {
    name: values.name,
    address: values.address,
    phone: toStoredPhone(values.phone),
    openingHours: formatHours(values.hours),
    description: values.description || null,
    imageUrl: values.imageUrl || null,
    ...parseCoordinates(values.location)!,
  }
}

/** PATCH body: saved hours the owner never re-picked (no shifts) are left out, so they stay as they are. */
export function toRestaurantPatch(values: RestaurantValues) {
  const { openingHours, ...body } = toRestaurantBody(values)
  return values.hours.length > 0 ? { ...body, openingHours } : body
}

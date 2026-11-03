import { applyApiError } from '@/api/form-errors'
import { parseApiError } from '@/api/errors'
import type { UseFormSetError } from 'react-hook-form'
import { foodSchema, type FoodValues } from './food-schema'

const FIELDS = Object.keys(foodSchema.shape) as (keyof FoodValues)[]

/**
 * Puts a failed save where the admin can see it: a duplicate name (409) on the name, the BE's field
 * errors on their fields. Returns the text for the whole form when there is nowhere else for it.
 */
export function applyFoodError(error: unknown, setError: UseFormSetError<FoodValues>) {
  if (parseApiError(error).status === 409) {
    setError('name', { message: 'admin:foods.validation.nameTaken' })
    return null
  }
  return applyApiError(error, setError, FIELDS)
}

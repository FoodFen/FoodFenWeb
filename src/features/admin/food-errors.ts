import { applyApiError } from '@/api/form-errors'
import { parseApiError } from '@/api/errors'
import type { UseFormSetError } from 'react-hook-form'
import { foodSchema, type FoodValues } from './food-schema'

const FIELDS = Object.keys(foodSchema.shape) as (keyof FoodValues)[]

/**
 * Puts a failed save where the admin can see it: a taken name (`food_name_taken`, else any 409) on the name, the BE's field
 * errors on their fields. Returns the text for the whole form when there is nowhere else for it.
 */
export function applyFoodError(error: unknown, setError: UseFormSetError<FoodValues>) {
  const { code, status } = parseApiError(error)
  if (code === 'food_name_taken' || status === 409) {
    setError('name', { message: 'admin:foods.validation.nameTaken' })
    return null
  }
  return applyApiError(error, setError, FIELDS)
}

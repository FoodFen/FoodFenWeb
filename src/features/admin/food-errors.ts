import { parseApiError } from '@/api/errors'
import type { UseFormSetError } from 'react-hook-form'
import { foodSchema, type FoodValues } from './food-schema'

const FIELDS: readonly string[] = Object.keys(foodSchema.shape)
const SERVING_FIELD = /^servings\.(\d+)\.(label|grams)$/
const ALIAS_ITEM = /^aliases\.\d+$/

/** The form field a BE error key belongs to: `aliases.2` is on the aliases, `servings.0.grams` on that row; else null. */
const formField = (key: string, servingRows: number) => {
  if (ALIAS_ITEM.test(key)) return 'aliases'
  const row = SERVING_FIELD.exec(key)
  if (row) return Number(row[1]) < servingRows ? key : null
  return FIELDS.includes(key) ? key : null
}

/**
 * Puts a failed save where the admin can see it: a taken name (`food_name_taken`, else any 409) on the name, the BE's field
 * errors on their fields (servings rows that exist, and aliases). Returns the text for the whole form: the errors that have
 * no field, or the general message when there was no field error at all.
 */
export function applyFoodError(
  error: unknown,
  setError: UseFormSetError<FoodValues>,
  servingRows: number,
) {
  const { code, status, message, fields } = parseApiError(error)
  if (code === 'food_name_taken' || status === 409) {
    setError('name', { message: 'admin:foods.validation.nameTaken' })
    return null
  }
  const loose: string[] = []
  let attached = false
  for (const [key, text] of Object.entries(fields)) {
    const field = formField(key, servingRows)
    if (field) {
      setError(field as keyof FoodValues, { message: text })
      attached = true
    } else {
      loose.push(`${key}: ${text}`)
    }
  }
  if (loose.length > 0) return loose.join(' ')
  return attached ? null : message
}

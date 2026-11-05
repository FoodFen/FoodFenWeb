import { parseApiError } from '@/api/errors'
import i18n from '@/i18n'
import type { ParseKeys } from 'i18next'
import type { UseFormSetError } from 'react-hook-form'
import { foodSchema, type FoodValues } from './food-schema'

const FIELDS: readonly string[] = Object.keys(foodSchema.shape)
const SERVING_FIELD = /^servings\.(\d+)\.(label|grams)$/
const ALIAS_ITEM = /^aliases\.\d+$/

// The BE's catalog-food 422 codes, each mapped to the copy the form's own validation already uses.
const CODE_TEXT = {
  name_required: 'foods.validation.nameLength',
  name_too_long: 'foods.validation.nameLength',
  name_en_too_long: 'foods.validation.nameEnLength',
  too_many_aliases: 'foods.validation.aliasesMax',
  alias_too_long: 'foods.validation.aliasLength',
  kcal_out_of_range: 'foods.validation.kcal',
  macro_out_of_range: 'foods.validation.macroRange',
  macros_sum_over_100: 'foods.validation.macroSum',
  fiber_out_of_range: 'foods.validation.macroRange',
  servings_count_out_of_range: 'foods.validation.servingsCount',
  serving_label_out_of_range: 'foods.validation.servingLabel',
  serving_grams_out_of_range: 'foods.validation.servingGrams',
  servings_need_one_default: 'foods.validation.servingDefault',
  slug_invalid: 'foods.validation.generic',
  source_ref_mismatch: 'foods.validation.generic',
} as const satisfies Record<string, ParseKeys<'admin'>>

/** The form field a BE error key belongs to: `aliases.2` is on the aliases, `servings.0.grams` on that row; else null. */
const formField = (key: string, servingRows: number) => {
  if (ALIAS_ITEM.test(key)) return 'aliases'
  const row = SERVING_FIELD.exec(key)
  if (row) return Number(row[1]) < servingRows ? key : null
  return FIELDS.includes(key) ? key : null
}

/**
 * Puts a failed save where the admin can see it: a taken name (`food_name_taken`, else any 409) on the name; a known
 * catalog rule `code` as its vi/en text on the BE's `field` (the macro sum on the fat field, where the form shows it), or
 * on the whole form when that field has no input; else the BE's field errors on their fields (servings rows that exist,
 * and aliases). Returns the text for the whole form: the errors that have no field, or the general message when there
 * was no field error at all.
 */
export function applyFoodError(
  error: unknown,
  setError: UseFormSetError<FoodValues>,
  servingRows: number,
) {
  const { code, field, status, message, fields } = parseApiError(error)
  if (code === 'food_name_taken' || status === 409) {
    setError('name', { message: 'admin:foods.validation.nameTaken' })
    return null
  }
  if (code && Object.hasOwn(CODE_TEXT, code)) {
    const key = CODE_TEXT[code as keyof typeof CODE_TEXT]
    const target = formField(field ?? (code === 'macros_sum_over_100' ? 'fatG' : ''), servingRows)
    if (!target) return i18n.t(key, { ns: 'admin' })
    setError(target as keyof FoodValues, { message: `admin:${key}` })
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

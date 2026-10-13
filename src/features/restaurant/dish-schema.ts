import type { DishResponse } from '@/api/generated'
import { DIET_TAGS } from '@/lib/diet-tag'
import { parseDecimal, parseWhole } from '@/lib/number-input'
import { z } from 'zod'

// Form fields stay strings (what inputs hold); `toDishBody` turns them into the numbers the BE wants.
// Limits mirror the BE's CreateDishRequest. Decimals accept "12,5", whole numbers "65.000".
const decimal = (message: string, max: number) =>
  z
    .string()
    .trim()
    .refine((text) => inRange(parseDecimal(text), 0, max), message)

const whole = (message: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .refine((text) => inRange(parseWhole(text), min, max), message)

const inRange = (value: number, min: number, max: number) =>
  Number.isFinite(value) && value >= min && value <= max

export const dishSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'restaurant:validation.nameRequired')
    .max(255, 'restaurant:validation.nameMax'),
  description: z.string().trim().max(2000, 'restaurant:validation.descriptionMax'),
  imageUrl: z.string(),
  price: whole('restaurant:validation.price', 0, 999_999_999_999),
  servingG: whole('restaurant:validation.servingG', 1, 10_000),
  kcal: whole('restaurant:validation.kcal', 0, 20_000),
  proteinG: decimal('restaurant:validation.proteinRange', 2000),
  carbsG: decimal('restaurant:validation.carbsRange', 2000),
  fatG: decimal('restaurant:validation.fatRange', 2000),
  fiberG: z
    .string()
    .trim()
    .refine(
      (text) => text === '' || inRange(parseDecimal(text), 0, 2000),
      'restaurant:validation.fiberRange',
    ),
  dietTag: z.enum(DIET_TAGS),
})

export type DishValues = z.infer<typeof dishSchema>

export const emptyDish: DishValues = {
  name: '',
  description: '',
  imageUrl: '',
  price: '',
  servingG: '',
  kcal: '',
  proteinG: '',
  carbsG: '',
  fatG: '',
  fiberG: '',
  dietTag: 'none',
}

/** Request body for create and update; `null` clears an optional field on PATCH. */
export function toDishBody(values: DishValues) {
  return {
    name: values.name,
    description: values.description || null,
    imageUrl: values.imageUrl || null,
    price: parseWhole(values.price),
    servingG: parseWhole(values.servingG),
    kcal: parseWhole(values.kcal),
    proteinG: parseDecimal(values.proteinG),
    carbsG: parseDecimal(values.carbsG),
    fatG: parseDecimal(values.fatG),
    fiberG: values.fiberG === '' ? null : parseDecimal(values.fiberG),
    dietTag: values.dietTag,
  }
}

export function toDishValues(dish: DishResponse): DishValues {
  return {
    name: dish.name,
    description: dish.description ?? '',
    imageUrl: dish.imageUrl ?? '',
    price: String(dish.price),
    servingG: String(dish.servingG),
    kcal: String(dish.kcal),
    proteinG: String(dish.proteinG),
    carbsG: String(dish.carbsG),
    fatG: String(dish.fatG),
    fiberG: dish.fiberG === null ? '' : String(dish.fiberG),
    dietTag: dish.dietTag,
  }
}

/** PATCH body with only the edited fields: any edit sends the dish back to review, so keep it minimal. */
export function toDishPatch(values: DishValues, dirty: Partial<Record<keyof DishValues, unknown>>) {
  return Object.fromEntries(
    Object.entries(toDishBody(values)).filter(([key]) => dirty[key as keyof DishValues]),
  )
}

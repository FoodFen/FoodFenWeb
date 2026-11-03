import type { AdminFoodResponse, CreateFoodRequest, UpdateFoodRequest } from '@/api/generated'
import { parseDecimal, parseWhole } from '@/lib/number-input'
import { z } from 'zod'
import { foodCategories } from './food-categories'

// Form fields stay strings (what inputs hold); `toFoodBody` turns them into numbers. Limits mirror
// the BE: name 1 to 120, 20 aliases of 1 to 80, kcal 0 to 900, macros 0 to 100 g and at most 100 g
// together, 1 to 10 servings of 1 to 5000 whole grams with exactly one default.
const v = (key: string) => `admin:foods.validation.${key}`

export const MACRO_SUM_ERROR = v('macroSum')

const inRange = (value: number, min: number, max: number) =>
  Number.isFinite(value) && value >= min && value <= max

const macro = (key: string) =>
  z
    .string()
    .trim()
    .refine((text) => inRange(parseDecimal(text), 0, 100), v(key))

const serving = z.object({
  label: z.string().trim().min(1, v('servingLabel')).max(40, v('servingLabel')),
  grams: z
    .string()
    .trim()
    .refine((text) => inRange(parseWhole(text), 1, 5000), v('servingGrams')),
  default: z.boolean(),
})

export const foodSchema = z
  .object({
    name: z.string().trim().min(1, v('nameLength')).max(120, v('nameLength')),
    nameEn: z.string().trim().max(120, v('nameEnLength')),
    aliases: z
      .array(z.string().trim().min(1, v('aliasLength')).max(80, v('aliasLength')))
      .max(20, v('aliasesMax')),
    category: z.enum(foodCategories, v('category')),
    kcal: z
      .string()
      .trim()
      .refine((text) => inRange(parseWhole(text), 0, 900), v('kcal')),
    carbsG: macro('macroRange'),
    proteinG: macro('macroRange'),
    fatG: macro('macroRange'),
    fiberG: z
      .string()
      .trim()
      .refine((text) => text === '' || inRange(parseDecimal(text), 0, 100), v('macroRange')),
    servings: z
      .array(serving)
      .min(1, v('servingsCount'))
      .max(10, v('servingsCount'))
      .refine((rows) => rows.filter((row) => row.default).length === 1, v('servingDefault')),
  })
  .refine(
    ({ carbsG, proteinG, fatG }) => {
      const sum = parseDecimal(carbsG) + parseDecimal(proteinG) + parseDecimal(fatG)
      return Number.isNaN(sum) || sum <= 100 // a bad single value already has its own message
    },
    { path: ['fatG'], message: MACRO_SUM_ERROR },
  )

export type FoodValues = z.infer<typeof foodSchema>

/** The food a "Thêm món" from the AI misses list starts from. */
export type FoodPrefill = { missId?: string; name?: string; nameEn?: string }

export const newFoodValues = ({ name = '', nameEn = '' }: FoodPrefill = {}): FoodValues => ({
  name,
  nameEn,
  aliases: [],
  category: 'mon-man',
  kcal: '',
  carbsG: '',
  proteinG: '',
  fatG: '',
  fiberG: '',
  servings: [{ label: '100 g', grams: '100', default: true }],
})

export const toFoodValues = (food: AdminFoodResponse): FoodValues => ({
  name: food.name,
  nameEn: food.nameEn ?? '',
  aliases: [...food.aliases],
  category: food.category,
  kcal: String(food.kcal),
  carbsG: String(food.carbsG),
  proteinG: String(food.proteinG),
  fatG: String(food.fatG),
  fiberG: food.fiberG === null ? '' : String(food.fiberG),
  servings: food.servings.map(({ label, grams, default: isDefault }) => ({
    label,
    grams: String(grams),
    default: isDefault,
  })),
})

/** Request body for create. Empty fiber is "not tracked" (`null`), a typed `0` stays `0`. */
export const toFoodBody = (values: FoodValues): CreateFoodRequest => ({
  name: values.name,
  nameEn: values.nameEn || null,
  aliases: values.aliases,
  category: values.category,
  kcal: parseWhole(values.kcal),
  carbsG: parseDecimal(values.carbsG),
  proteinG: parseDecimal(values.proteinG),
  fatG: parseDecimal(values.fatG),
  fiberG: values.fiberG === '' ? null : parseDecimal(values.fiberG),
  servings: values.servings.map((row) => ({ ...row, grams: parseWhole(row.grams) })),
})

/** PATCH body: only the fields whose form value differs from `original`, so an untouched number is never sent. */
export function toFoodPatch(values: FoodValues, original: FoodValues): UpdateFoodRequest {
  const body = toFoodBody(values)
  return Object.fromEntries(
    (Object.keys(values) as (keyof FoodValues)[])
      .filter((key) => JSON.stringify(values[key]) !== JSON.stringify(original[key]))
      .map((key) => [key, body[key]]),
  )
}

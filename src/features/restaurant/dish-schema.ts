import type { DishResponse } from '@/api/generated'
import { DIET_TAGS } from '@/lib/diet-tag'
import { z } from 'zod'

// Form fields stay strings (what inputs hold); `toDishBody` turns them into the numbers the BE wants.
// Vietnamese users type "12,5", so the comma counts as a decimal point.
const toNumber = (text: string) => (text === '' ? NaN : Number(text.replace(',', '.')))

const numeric = (message: string, { min = 0, max, integer = false }: Range) =>
  z
    .string()
    .trim()
    .refine((text) => inRange(toNumber(text), { min, max, integer }), message)

type Range = { min?: number; max: number; integer?: boolean }

function inRange(value: number, { min = 0, max, integer = false }: Range) {
  return (
    Number.isFinite(value) && value >= min && value <= max && (!integer || Number.isInteger(value))
  )
}

const grams = (label: string) => numeric(`${label} từ 0 đến 2.000 g`, { max: 2000 })

export const dishSchema = z.object({
  name: z.string().trim().min(1, 'Nhập tên món').max(255, 'Tên tối đa 255 ký tự'),
  description: z.string().trim().max(2000, 'Mô tả tối đa 2.000 ký tự'),
  imageUrl: z.string(),
  price: numeric('Giá là số nguyên từ 0 đồng', { max: 999_999_999_999, integer: true }),
  servingG: numeric('Khẩu phần từ 1 đến 10.000 g', { min: 1, max: 10_000, integer: true }),
  kcal: numeric('Năng lượng là số nguyên từ 0 đến 20.000 kcal', { max: 20_000, integer: true }),
  proteinG: grams('Đạm'),
  carbsG: grams('Tinh bột'),
  fatG: grams('Chất béo'),
  fiberG: grams('Chất xơ').or(z.literal('')),
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
    price: toNumber(values.price),
    servingG: toNumber(values.servingG),
    kcal: toNumber(values.kcal),
    proteinG: toNumber(values.proteinG),
    carbsG: toNumber(values.carbsG),
    fatG: toNumber(values.fatG),
    fiberG: values.fiberG === '' ? null : toNumber(values.fiberG),
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

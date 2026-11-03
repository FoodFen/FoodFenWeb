import type { FoodSnapshot } from '@/api/generated'

/** Fields a change snapshot holds; each has a label under `admin:foods.fields`. */
const foodFields = [
  'name',
  'nameEn',
  'aliases',
  'category',
  'kcal',
  'carbsG',
  'proteinG',
  'fatG',
  'fiberG',
  'servings',
  'sourceKind',
  'sourceRef',
  'archived',
] as const satisfies readonly (keyof FoodSnapshot)[]

/** The fields whose values differ between two snapshots (`before` is null for a create). */
export const diffFood = (before: FoodSnapshot | null, after: FoodSnapshot) =>
  foodFields
    .filter((field) => JSON.stringify(before?.[field] ?? null) !== JSON.stringify(after[field]))
    .map((field) => ({ field, before: before?.[field] ?? null, after: after[field] }))

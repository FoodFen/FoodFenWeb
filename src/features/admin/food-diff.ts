/** Fields a change snapshot can hold; each has a label under `admin:foods.fields`. */
export const foodFields = [
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
] as const
export type FoodField = (typeof foodFields)[number]

// A snapshot's keys may be camelCase or snake_case: both map to the same field.
const fieldOf: Record<string, FoodField> = Object.fromEntries(
  foodFields.flatMap((field) => {
    const snake = field.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    return [
      [field, field],
      [snake, field],
    ]
  }),
)

export const isFoodField = (key: string): key is FoodField =>
  (foodFields as readonly string[]).includes(key)

const canonical = (snapshot: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(snapshot).map(([key, value]) => [fieldOf[key] ?? key, value]))

/** The fields whose values differ between two snapshots; unknown keys keep their raw name. */
export function diffFood(before: Record<string, unknown> | null, after: Record<string, unknown>) {
  const from = canonical(before ?? {})
  const to = canonical(after)
  return [...new Set([...Object.keys(from), ...Object.keys(to)])]
    .filter((field) => JSON.stringify(from[field] ?? null) !== JSON.stringify(to[field] ?? null))
    .map((field) => ({ field, before: from[field] ?? null, after: to[field] ?? null }))
}

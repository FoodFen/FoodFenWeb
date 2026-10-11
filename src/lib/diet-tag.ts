export const DIET_TAGS = ['none', 'vegetarian', 'vegan'] as const

export type DietTag = (typeof DIET_TAGS)[number]

export const DIET_TAG_LABELS: Record<DietTag, string> = {
  none: 'Không chay',
  vegetarian: 'Chay',
  vegan: 'Thuần chay',
}

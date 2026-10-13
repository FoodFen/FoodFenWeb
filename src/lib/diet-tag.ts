export const DIET_TAGS = ['none', 'vegetarian', 'vegan'] as const

export type DietTag = (typeof DIET_TAGS)[number]

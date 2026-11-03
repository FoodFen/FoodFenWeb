// Wire types of the admin foods endpoints (camelCase). Hand-written until the BE is in the generated
// client; every other file imports them from here.

export type FoodCategory =
  | 'an-vat'
  | 'banh-mi'
  | 'bun-tron'
  | 'che-trang-mieng'
  | 'chien-nuong'
  | 'com'
  | 'do-uong'
  | 'mon-man'
  | 'mon-nuoc'
  | 'nguyen-lieu'
  | 'rau-chay'
  | 'trai-cay'

export type FoodSourceKind = 'nin' | 'usda' | 'recipe' | 'label' | 'team' | 'legacy'

export type Serving = { label: string; grams: number; default: boolean }

export type AdminFood = {
  slug: string
  name: string
  nameEn: string | null
  category: FoodCategory
  sourceKind: FoodSourceKind
  sourceRef: string | null
  verified: boolean
  kcal: number
  carbsG: number
  proteinG: number
  fatG: number
  fiberG: number | null
  archived: boolean
  updatedAt: string
}

export type AdminFoodDetail = AdminFood & {
  aliases: string[]
  servings: Serving[]
  updatedByEmail: string | null
}

export type FoodBody = {
  name: string
  nameEn: string | null
  aliases: string[]
  category: FoodCategory
  kcal: number
  carbsG: number
  proteinG: number
  fatG: number
  fiberG: number | null
  servings: Serving[]
}

export type FoodChangeAction = 'create' | 'update' | 'archive' | 'unarchive'

export type FoodChange = {
  id: string
  adminEmail: string | null
  action: FoodChangeAction
  createdAt: string
  before: Record<string, unknown> | null
  after: Record<string, unknown>
}

export type FoodMissStatus = 'open' | 'ignored' | 'resolved'

export type FoodMiss = {
  id: string
  name: string
  language: string
  count: number
  firstSeenAt: string
  lastSeenAt: string
  status: FoodMissStatus
  existingFood: { slug: string; name: string } | null
}

export type FoodPage<T> = { items: T[]; nextCursor: string | null }

export type FoodFilters = {
  q?: string
  category?: FoodCategory
  verified?: boolean
  archived?: boolean
}

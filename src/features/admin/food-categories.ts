import type { FoodCategory } from './food-types'

export const foodCategories = [
  'an-vat',
  'banh-mi',
  'bun-tron',
  'che-trang-mieng',
  'chien-nuong',
  'com',
  'do-uong',
  'mon-man',
  'mon-nuoc',
  'nguyen-lieu',
  'rau-chay',
  'trai-cay',
] as const satisfies readonly FoodCategory[]

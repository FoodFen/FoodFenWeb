import type { FoodMissStatus } from '@/api/generated'
import { z } from 'zod'
import { foodCategories } from './food-categories'

export const foodTabs = ['catalog', 'misses'] as const
export type FoodTab = (typeof foodTabs)[number]

export const missStatuses = [
  'open',
  'ignored',
  'resolved',
] as const satisfies readonly FoodMissStatus[]

/** Every filter of the foods page lives in the URL; an invalid value is dropped. */
export const foodSearchSchema = z.object({
  tab: z.enum(foodTabs).optional().catch(undefined),
  q: z.coerce.string().optional().catch(undefined),
  category: z.enum(foodCategories).optional().catch(undefined),
  verified: z.boolean().optional().catch(undefined),
  archived: z.boolean().optional().catch(undefined),
  status: z.enum(missStatuses).optional().catch(undefined),
  /** Slug of the food whose edit dialog is open. */
  food: z.string().optional().catch(undefined),
})
export type FoodSearch = z.infer<typeof foodSearchSchema>

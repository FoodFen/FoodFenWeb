import { z } from 'zod'

export const restaurantTabs = ['all', 'pending', 'approved', 'rejected'] as const
export type RestaurantTab = (typeof restaurantTabs)[number]

export const restaurantSearchSchema = z.object({
  tab: z.enum(restaurantTabs).optional().catch(undefined),
  q: z.coerce.string().optional().catch(undefined),
})
export type RestaurantSearch = z.infer<typeof restaurantSearchSchema>

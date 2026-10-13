import { RestaurantListPage } from '@/features/admin/restaurant-list-page'
import { restaurantSearchSchema } from '@/features/admin/restaurant-tabs'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin/restaurants/')({
  validateSearch: restaurantSearchSchema,
  component: RestaurantListPage,
})

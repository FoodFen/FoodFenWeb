import { RestaurantReviewPage } from '@/features/admin/restaurant-review-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin/restaurants/$restaurantId')({
  component: RestaurantReviewPage,
})

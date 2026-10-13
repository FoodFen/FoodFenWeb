import { RestaurantPage } from '@/features/restaurant/restaurant-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/restaurant/')({ component: RestaurantPage })

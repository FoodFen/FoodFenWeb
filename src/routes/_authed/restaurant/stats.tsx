import { StatsPage } from '@/features/restaurant-stats/stats-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/restaurant/stats')({ component: StatsPage })

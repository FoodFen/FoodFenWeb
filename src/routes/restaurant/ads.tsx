import { AdsPage } from '@/features/restaurant-ads/ads-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/restaurant/ads')({ component: AdsPage })

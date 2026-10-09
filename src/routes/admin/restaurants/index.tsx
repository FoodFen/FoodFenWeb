import { ReviewQueuePage } from '@/features/admin/review-queue-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/restaurants/')({ component: ReviewQueuePage })

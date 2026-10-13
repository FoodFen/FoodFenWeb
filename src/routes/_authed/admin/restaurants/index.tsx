import { ReviewQueuePage } from '@/features/admin/review-queue-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin/restaurants/')({ component: ReviewQueuePage })

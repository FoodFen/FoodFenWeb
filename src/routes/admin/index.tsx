import { OverviewPage } from '@/features/admin/overview-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({ component: OverviewPage })

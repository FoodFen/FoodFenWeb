import { OverviewPage } from '@/features/admin/overview-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin/')({ component: OverviewPage })

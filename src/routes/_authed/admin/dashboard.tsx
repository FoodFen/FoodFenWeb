import { DashboardPage } from '@/features/admin/dashboard-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin/dashboard')({ component: DashboardPage })

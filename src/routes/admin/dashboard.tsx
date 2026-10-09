import { DashboardPage } from '@/features/admin/dashboard-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/dashboard')({ component: DashboardPage })

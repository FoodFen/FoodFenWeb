import { UsersPage } from '@/features/admin/users-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin/users')({ component: UsersPage })

import { requireAdmin } from '@/features/auth/guards'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin')({
  beforeLoad: ({ location }) => requireAdmin(location.href),
})

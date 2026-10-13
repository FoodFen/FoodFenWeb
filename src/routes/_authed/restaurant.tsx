import { requireOwner } from '@/features/auth/guards'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/restaurant')({
  beforeLoad: ({ location }) => requireOwner(location.href),
})

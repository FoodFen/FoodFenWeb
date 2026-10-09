import { AppLayout } from '@/features/auth/app-layout'
import { requireUser } from '@/features/auth/guards'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app')({
  beforeLoad: ({ location }) => requireUser(location.href),
  component: AppLayout,
})

import { AppShell } from '@/components/app-shell'
import { requireUser } from '@/features/auth/guards'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ location }) => requireUser(location.href),
  component: AppShell,
})

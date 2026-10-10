import { AppShell } from '@/components/app-shell'
import { requireUser } from '@/features/auth/guards'
import { UserMenu } from '@/features/auth/user-menu'
import { createFileRoute } from '@tanstack/react-router'
import { Store, UserRound } from 'lucide-react'

const nav = [
  { to: '/app', label: 'Tài khoản', icon: UserRound },
  { to: '/restaurant', label: 'Quán của tôi', icon: Store, exact: true },
]

export const Route = createFileRoute('/restaurant')({
  beforeLoad: ({ location }) => requireUser(location.href),
  component: () => <AppShell title="FoodFen Quán" nav={nav} footer={<UserMenu />} />,
})

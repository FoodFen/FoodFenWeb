import { AppShell } from '@/components/app-shell'
import { requireAdmin } from '@/features/auth/guards'
import { UserMenu } from '@/features/auth/user-menu'
import { createFileRoute } from '@tanstack/react-router'
import { LayoutDashboard, ListChecks, Store, Users, Wallet } from 'lucide-react'

const nav = [
  { to: '/admin', label: 'Tổng quan', icon: LayoutDashboard, exact: true },
  { to: '/admin/dashboard', label: 'Dòng tiền', icon: Wallet },
  { to: '/admin/restaurants', label: 'Duyệt quán', icon: Store },
  { to: '/admin/users', label: 'Người dùng', icon: Users },
  { to: '/admin/content', label: 'Nội dung', icon: ListChecks },
]

export const Route = createFileRoute('/admin')({
  beforeLoad: ({ location }) => requireAdmin(location.href),
  component: () => <AppShell title="FoodFen Admin" nav={nav} footer={<UserMenu />} />,
})

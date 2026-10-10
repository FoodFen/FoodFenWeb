import { AppShell } from '@/components/app-shell'
import { UserMenu } from '@/features/auth/user-menu'
import { useSessionStore } from '@/lib/session-store'
import { ShieldCheck, Store, UserRound } from 'lucide-react'

const nav = [
  { to: '/app', label: 'Tài khoản', icon: UserRound, exact: true },
  { to: '/restaurant', label: 'Quán của tôi', icon: Store },
]
const adminNav = [...nav, { to: '/admin/restaurants', label: 'Quản trị', icon: ShieldCheck }]

export function AppLayout() {
  const isAdmin = useSessionStore((s) => s.user?.role === 'admin')
  return <AppShell title="FoodFen" nav={isAdmin ? adminNav : nav} footer={<UserMenu />} />
}

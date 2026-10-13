import {
  Megaphone,
  ListChecks,
  ShieldCheck,
  Store,
  UserRound,
  Users,
  Wallet,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = { to: string; label: string; icon: LucideIcon; exact?: boolean }
export type NavSection = {
  label: string
  icon: LucideIcon
  adminOnly?: boolean
  children: NavItem[]
}
export type NavEntry = NavItem | NavSection

export const isNavSection = (entry: NavEntry): entry is NavSection => 'children' in entry

export const appNav: NavEntry[] = [
  { to: '/app', label: 'Tài khoản', icon: UserRound, exact: true },
  {
    label: 'Quán của tôi',
    icon: Store,
    children: [
      { to: '/restaurant', label: 'Hồ sơ quán', icon: Store, exact: true },
      { to: '/restaurant/ads', label: 'Quảng cáo', icon: Megaphone },
    ],
  },
  {
    label: 'Quản trị',
    icon: ShieldCheck,
    adminOnly: true,
    children: [
      { to: '/admin', label: 'Tổng quan', icon: LayoutDashboard, exact: true },
      { to: '/admin/dashboard', label: 'Dòng tiền', icon: Wallet },
      { to: '/admin/restaurants', label: 'Duyệt quán', icon: Store },
      { to: '/admin/users', label: 'Người dùng', icon: Users },
      { to: '/admin/content', label: 'Nội dung', icon: ListChecks },
      { to: '/admin/ad-packages', label: 'Gói quảng cáo', icon: Megaphone },
    ],
  },
]

export const isActivePath = (pathname: string, { to, exact }: NavItem) =>
  pathname === to || (!exact && pathname.startsWith(`${to}/`))

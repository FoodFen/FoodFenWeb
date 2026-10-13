import type { ParseKeys } from 'i18next'
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

/** `label` is a key in the `nav` namespace. */
type NavLabel = ParseKeys<'nav'>

export type NavItem = { to: string; label: NavLabel; icon: LucideIcon; exact?: boolean }
export type NavSection = {
  label: NavLabel
  icon: LucideIcon
  adminOnly?: boolean
  userOnly?: boolean
  children: NavItem[]
}
export type NavEntry = NavItem | NavSection

export const isNavSection = (entry: NavEntry): entry is NavSection => 'children' in entry

export const appNav: NavEntry[] = [
  { to: '/app', label: 'account', icon: UserRound, exact: true },
  {
    label: 'myRestaurant',
    icon: Store,
    userOnly: true,
    children: [
      { to: '/restaurant', label: 'restaurantProfile', icon: Store, exact: true },
      { to: '/restaurant/ads', label: 'ads', icon: Megaphone },
    ],
  },
  {
    label: 'admin',
    icon: ShieldCheck,
    adminOnly: true,
    children: [
      { to: '/admin', label: 'overview', icon: LayoutDashboard, exact: true },
      { to: '/admin/dashboard', label: 'cashflow', icon: Wallet },
      { to: '/admin/restaurants', label: 'restaurants', icon: Store },
      { to: '/admin/users', label: 'users', icon: Users },
      { to: '/admin/content', label: 'content', icon: ListChecks },
      { to: '/admin/ad-packages', label: 'adPackages', icon: Megaphone },
    ],
  },
]

export const isActivePath = (pathname: string, { to, exact }: NavItem) =>
  pathname === to || (!exact && pathname.startsWith(`${to}/`))

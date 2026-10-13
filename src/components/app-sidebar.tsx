import { UserMenu } from '@/features/auth/user-menu'
import { useSessionStore } from '@/lib/session-store'
import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'
import { appNav, isNavSection } from './app-nav'
import { NavGroup } from './nav-group'
import { NavLeaf } from './nav-leaf'
import { ThemeToggle } from './theme-toggle'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from './ui/sidebar'

export function AppSidebar() {
  const isAdmin = useSessionStore((s) => s.user?.role === 'admin')
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { setOpenMobile } = useSidebar()

  // The mobile sheet stays open across client-side navigation otherwise.
  useEffect(() => setOpenMobile(false), [pathname, setOpenMobile])

  return (
    <Sidebar>
      <SidebarHeader className="flex-row items-center justify-between px-4 py-3">
        <Link to="/" className="text-primary rounded-md text-xl font-semibold">
          FoodFen
        </Link>
        <ThemeToggle />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu className="gap-1">
          {appNav
            .filter((entry) => isAdmin || !(isNavSection(entry) && entry.adminOnly))
            .map((entry) =>
              isNavSection(entry) ? (
                <NavGroup key={entry.label} section={entry} pathname={pathname} />
              ) : (
                <NavLeaf key={entry.to} item={entry} pathname={pathname} />
              ),
            )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  )
}

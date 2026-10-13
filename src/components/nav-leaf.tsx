import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { isActivePath, type NavItem } from './app-nav'

export function NavLeaf({ item, pathname }: { item: NavItem; pathname: string }) {
  const { to, label, icon: Icon, exact } = item
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="h-11 md:h-9"
        isActive={isActivePath(pathname, item)}
        render={<Link to={to} activeOptions={{ exact }} />}
      >
        <Icon aria-hidden />
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

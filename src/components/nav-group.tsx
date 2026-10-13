import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { isActivePath, type NavSection } from './app-nav'

export function NavGroup({ section, pathname }: { section: NavSection; pathname: string }) {
  const { label, icon: Icon, children } = section
  return (
    <Collapsible
      defaultOpen={children.some((child) => isActivePath(pathname, child))}
      render={<SidebarMenuItem />}
    >
      <CollapsibleTrigger render={<SidebarMenuButton className="h-11 md:h-9" />}>
        <Icon aria-hidden />
        <span>{label}</span>
        <ChevronRight
          aria-hidden
          className="ml-auto transition-transform group-data-[panel-open]/menu-button:rotate-90"
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {children.map((child) => (
            <SidebarMenuSubItem key={child.to}>
              <SidebarMenuSubButton
                className="h-11 md:h-8"
                isActive={isActivePath(pathname, child)}
                render={<Link to={child.to} activeOptions={{ exact: child.exact }} />}
              >
                <child.icon aria-hidden />
                <span>{child.label}</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

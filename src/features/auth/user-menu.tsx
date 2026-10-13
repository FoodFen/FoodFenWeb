import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { useSessionStore } from '@/lib/session-store'
import { useRouter } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import { useSignOut } from './use-auth'

export function UserMenu() {
  const user = useSessionStore((s) => s.user)
  const refreshToken = useSessionStore((s) => s.refreshToken)
  const signOut = useSignOut()
  const router = useRouter()

  const handleSignOut = () => {
    // Revokes the refresh token server-side; the local session is cleared whatever the outcome.
    signOut.mutate({ body: { refreshToken: refreshToken ?? '' } })
    router.navigate({ to: '/' })
  }

  return (
    <div className="flex flex-col gap-1 border-t pt-2">
      {user && (
        <div className="px-2 py-1 text-sm">
          <p className="truncate font-medium">{user.displayName ?? user.email}</p>
          <p className="text-muted-foreground truncate text-xs">{user.email}</p>
        </div>
      )}
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton className="h-11 md:h-9" onClick={handleSignOut}>
            <LogOut aria-hidden />
            <span>Đăng xuất</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  )
}

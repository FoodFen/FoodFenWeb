import { navItemClass } from '@/components/nav-item-class'
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
    <div className="flex flex-1 flex-col gap-2 md:mt-auto md:flex-none md:border-t md:pt-3">
      {user && (
        <div className="hidden px-3 text-sm md:block">
          <p className="truncate font-medium">{user.displayName ?? user.email}</p>
          <p className="text-muted-foreground truncate text-xs">{user.email}</p>
        </div>
      )}
      <button type="button" onClick={handleSignOut} className={navItemClass}>
        <LogOut className="size-5" aria-hidden />
        Đăng xuất
      </button>
    </div>
  )
}

import { redirect } from '@tanstack/react-router'
import { useSessionStore } from '@/lib/session-store'

export function requireUser(href: string) {
  if (!useSessionStore.getState().user) {
    throw redirect({ to: '/login', search: { redirect: href } })
  }
}

export function requireAdmin(href: string) {
  const { user } = useSessionStore.getState()
  if (!user) throw redirect({ to: '/login', search: { redirect: href } })
  if (user.role !== 'admin') throw redirect({ to: '/app' })
}

/** Admins do not own a restaurant: they manage them from /admin. */
export function requireOwner(href: string) {
  const { user } = useSessionStore.getState()
  if (!user) throw redirect({ to: '/login', search: { redirect: href } })
  if (user.role === 'admin') throw redirect({ to: '/admin' })
}

export function redirectIfSignedIn() {
  if (useSessionStore.getState().user) throw redirect({ to: '/app' })
}

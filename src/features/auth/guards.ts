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

export function redirectIfSignedIn() {
  if (useSessionStore.getState().user) throw redirect({ to: '/app' })
}

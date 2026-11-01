import { z } from 'zod'

export const loginSearch = z.object({ redirect: z.string().optional().catch(undefined) })

// Only same-origin absolute paths are allowed, so `?redirect=` cannot bounce users to another site.
export function safeTarget(target: string | undefined, fallback = '/app') {
  return target?.startsWith('/') && !target.startsWith('//') && !target.includes('\\')
    ? target
    : fallback
}

/** Where a signed-in user lands by default: admins manage from /admin, everyone else has /app. */
export const homePath = (user: { role: string } | null | undefined) =>
  user?.role === 'admin' ? '/admin' : '/app'

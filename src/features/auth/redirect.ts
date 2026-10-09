import { z } from 'zod'

export const loginSearch = z.object({ redirect: z.string().optional().catch(undefined) })

// Only same-origin absolute paths are allowed, so `?redirect=` cannot bounce users to another site.
export function safeTarget(target: string | undefined) {
  return target?.startsWith('/') && !target.startsWith('//') && !target.includes('\\')
    ? target
    : '/app'
}

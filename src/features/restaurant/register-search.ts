import { redirect } from '@tanstack/react-router'
import { z } from 'zod'

export const registerSearchSchema = z.object({ accepted: z.boolean().catch(false) })

/** The registration form is only reachable after the terms were accepted on the onboarding page. */
export function requireAcceptedTerms({ accepted }: z.infer<typeof registerSearchSchema>) {
  if (!accepted) throw redirect({ to: '/restaurant' })
}

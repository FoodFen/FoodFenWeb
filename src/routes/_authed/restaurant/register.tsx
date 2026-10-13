import { RegisterPage } from '@/features/restaurant/register-page'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_authed/restaurant/register')({
  validateSearch: z.object({ accepted: z.boolean().catch(false) }),
  beforeLoad: ({ search }) => {
    if (!search.accepted) throw redirect({ to: '/restaurant' })
  },
  component: RegisterPage,
})

import { RegisterPage } from '@/features/restaurant/register-page'
import { registerSearchSchema, requireAcceptedTerms } from '@/features/restaurant/register-search'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/restaurant/register')({
  validateSearch: registerSearchSchema,
  beforeLoad: ({ search }) => requireAcceptedTerms(search),
  component: RegisterPage,
})

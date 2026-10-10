import { tokenSearch } from '@/features/auth/schemas'
import { VerifyEmailPage } from '@/features/auth/verify-email-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/verify-email')({
  validateSearch: tokenSearch,
  component: VerifyEmailPage,
})

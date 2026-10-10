import { ResetPasswordForm } from '@/features/auth/reset-password-form'
import { tokenSearch } from '@/features/auth/schemas'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/reset-password')({
  validateSearch: tokenSearch,
  component: ResetPasswordForm,
})

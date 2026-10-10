import { redirectIfSignedIn } from '@/features/auth/guards'
import { RegisterForm } from '@/features/auth/register-form'
import { loginSearch } from '@/features/auth/redirect'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
  validateSearch: loginSearch,
  beforeLoad: redirectIfSignedIn,
  component: RegisterForm,
})

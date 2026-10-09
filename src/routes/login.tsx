import { redirectIfSignedIn } from '@/features/auth/guards'
import { LoginForm } from '@/features/auth/login-form'
import { loginSearch } from '@/features/auth/redirect'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  validateSearch: loginSearch,
  beforeLoad: redirectIfSignedIn,
  component: LoginForm,
})

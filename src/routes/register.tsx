import { redirectIfSignedIn } from '@/features/auth/guards'
import { RegisterForm } from '@/features/auth/register-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
  beforeLoad: redirectIfSignedIn,
  component: RegisterForm,
})

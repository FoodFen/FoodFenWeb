import { ForgotPasswordForm } from '@/features/auth/forgot-password-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forgot-password')({ component: ForgotPasswordForm })

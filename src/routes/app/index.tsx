import { ProfilePage } from '@/features/auth/profile-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/')({ component: ProfilePage })

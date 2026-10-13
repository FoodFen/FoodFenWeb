import { ProfilePage } from '@/features/auth/profile-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/app/')({ component: ProfilePage })

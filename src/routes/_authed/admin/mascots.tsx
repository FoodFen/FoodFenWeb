import { MascotsPage } from '@/features/admin/mascots-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin/mascots')({ component: MascotsPage })

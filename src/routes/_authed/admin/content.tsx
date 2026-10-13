import { ContentPage } from '@/features/admin/content-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin/content')({ component: ContentPage })

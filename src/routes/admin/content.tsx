import { ContentPage } from '@/features/admin/content-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/content')({ component: ContentPage })

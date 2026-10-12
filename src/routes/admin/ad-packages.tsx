import { AdPackagesPage } from '@/features/admin/ad-packages-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/ad-packages')({ component: AdPackagesPage })

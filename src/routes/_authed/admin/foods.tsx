import { foodSearchSchema } from '@/features/admin/food-search'
import { FoodsPage } from '@/features/admin/foods-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin/foods')({
  validateSearch: foodSearchSchema,
  component: FoodsPage,
})

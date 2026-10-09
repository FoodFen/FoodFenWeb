import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/stats')({
  component: () => <h1 className="text-2xl font-semibold">Thống kê</h1>,
})

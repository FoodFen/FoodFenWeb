import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/')({
  component: () => <h1 className="text-2xl font-semibold">Trang chủ</h1>,
})

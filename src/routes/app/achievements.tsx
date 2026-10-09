import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/achievements')({
  component: () => <h1 className="text-2xl font-semibold">Thành tích</h1>,
})

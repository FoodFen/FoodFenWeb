import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { PageHeader } from './page-header'
import { QueryError } from '@/components/query-error'
import { ReviewQueueTable } from './review-queue-table'
import { useReviewQueue, type QueueFilter } from './use-moderation'

const filters: { value: QueueFilter; label: string }[] = [
  { value: 'needsReview', label: 'Cần duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'rejected', label: 'Bị từ chối' },
]

export function ReviewQueuePage() {
  const [filter, setFilter] = useState<QueueFilter>('needsReview')
  const queue = useReviewQueue(filter)
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Duyệt quán"
        description="Kiểm tra hồ sơ quán và dinh dưỡng từng món trước khi hiển thị."
      />
      <Tabs value={filter} onValueChange={(value) => setFilter(value as QueueFilter)}>
        <TabsList>
          {filters.map(({ value, label }) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Card className="rounded-2xl p-2">
        {queue.isPending ? (
          <Skeleton className="h-40 w-full" aria-busy />
        ) : queue.isError ? (
          <QueryError error={queue.error} onRetry={() => void queue.refetch()} />
        ) : (
          <ReviewQueueTable
            rows={queue.data}
            onOpen={(restaurantId) =>
              void navigate({ to: '/admin/restaurants/$restaurantId', params: { restaurantId } })
            }
          />
        )}
      </Card>
    </div>
  )
}

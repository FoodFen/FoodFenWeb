import { Card, CardContent } from '@/components/ui/card'
import { formatDateTime } from '@/lib/format'
import { Megaphone } from 'lucide-react'
import { useState } from 'react'

export function AdsStatus({ featuredUntil }: { featuredUntil: string | null }) {
  const [now] = useState(Date.now)
  const running = featuredUntil !== null && new Date(featuredUntil).getTime() > now
  return (
    <Card className="rounded-2xl">
      <CardContent className="flex items-center gap-3">
        <Megaphone className="text-muted-foreground size-5" aria-hidden />
        <p className="font-medium">
          {running ? `Đang quảng cáo đến ${formatDateTime(featuredUntil)}` : 'Chưa chạy quảng cáo'}
        </p>
      </CardContent>
    </Card>
  )
}

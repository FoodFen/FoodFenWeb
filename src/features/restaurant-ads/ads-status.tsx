import { Card, CardContent } from '@/components/ui/card'
import { formatDateTime } from '@/lib/format'
import { Megaphone } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function AdsStatus({ featuredUntil }: { featuredUntil: string | null }) {
  const { t } = useTranslation('ads')
  const [now] = useState(Date.now)
  const running = featuredUntil !== null && new Date(featuredUntil).getTime() > now
  return (
    <Card className="rounded-2xl">
      <CardContent className="flex items-center gap-3">
        <Megaphone className="text-muted-foreground size-5" aria-hidden />
        <p className="font-medium">
          {running
            ? t('status.running', { date: formatDateTime(featuredUntil) })
            : t('status.idle')}
        </p>
      </CardContent>
    </Card>
  )
}
